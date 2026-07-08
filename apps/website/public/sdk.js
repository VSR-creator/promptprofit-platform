(function () {
  "use strict";

  var script = document.currentScript;

  if (!script) {
    script = document.querySelector("script[data-key][src*='sdk.js']");
  }

  if (!script) {
    console.warn("[PromptProfit] SDK script tag was not found.");
    return;
  }

  var siteKey = script.getAttribute("data-key");

  if (!siteKey) {
    console.warn("[PromptProfit] data-key is required.");
    return;
  }

  var configuredApiBase = script.getAttribute("data-api-base");
  var apiBase = configuredApiBase || "https://promptprofit.co.za";
  var endpoint = apiBase.replace(/\/$/, "") + "/api/brain/events";

  var visitorStorageKey = "pp_visitor_id";
  var sessionStorageKey = "pp_session_id";
  var sessionStartedStorageKey = "pp_session_started_at";
  var sessionLifetimeMs = 30 * 60 * 1000;
  var queue = [];
  var flushTimer = null;
  var hasTrackedScroll = false;

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getVisitorId() {
    var visitorId = localStorage.getItem(visitorStorageKey);

    if (!visitorId) {
      visitorId = uuid();
      localStorage.setItem(visitorStorageKey, visitorId);
    }

    return visitorId;
  }

  function getSessionId() {
    var sessionId = sessionStorage.getItem(sessionStorageKey);
    var startedAt = Number(sessionStorage.getItem(sessionStartedStorageKey) || "0");
    var expired = !startedAt || Date.now() - startedAt > sessionLifetimeMs;

    if (!sessionId || expired) {
      sessionId = uuid();
      sessionStorage.setItem(sessionStorageKey, sessionId);
      sessionStorage.setItem(sessionStartedStorageKey, String(Date.now()));
    }

    return sessionId;
  }

  var visitorId = getVisitorId();
  var sessionId = getSessionId();

  function normaliseTarget(target) {
    if (!target || !target.closest) return {};

    var element = target.closest("a, button, input, textarea, select, [role='button']");

    if (!element) return {};

    return {
      tag: element.tagName.toLowerCase(),
      text: (element.innerText || element.getAttribute("aria-label") || "")
        .trim()
        .slice(0, 120),
      href: element.getAttribute("href") || null,
      id: element.id || null,
      name: element.getAttribute("name") || null
    };
  }

  function track(type, data) {
    queue.push({
      type: type,
      data: data || {},
      clientTimestamp: new Date().toISOString()
    });

    if (queue.length >= 10) {
      flush();
      return;
    }

    if (!flushTimer) {
      flushTimer = window.setTimeout(flush, 1500);
    }
  }

  function flush() {
    if (flushTimer) {
      window.clearTimeout(flushTimer);
      flushTimer = null;
    }

    if (!queue.length) return;

    var events = queue.splice(0, queue.length);
    var payload = JSON.stringify({
      siteKey: siteKey,
      sessionId: sessionId,
      visitorId: visitorId,
      events: events
    });

    if (navigator.sendBeacon) {
      var sent = navigator.sendBeacon(
        endpoint,
        new Blob([payload], { type: "application/json" })
      );

      if (sent) return;
    }

    fetch(endpoint, {
      method: "POST",
      mode: "cors",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: payload
    }).catch(function () {
      queue = events.concat(queue);
    });
  }

  function scrollPercent() {
    var documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var scrollable = documentHeight - viewportHeight;

    if (scrollable <= 0) return 100;

    return Math.min(100, Math.round((scrollTop / scrollable) * 100));
  }

  track("page_view", {
    path: window.location.pathname,
    url: window.location.href,
    title: document.title,
    referrer: document.referrer || null
  });

  window.addEventListener("scroll", function () {
    if (hasTrackedScroll || scrollPercent() < 50) return;

    hasTrackedScroll = true;

    track("scroll", {
      path: window.location.pathname,
      depth: scrollPercent()
    });
  }, { passive: true });

  document.addEventListener("click", function (event) {
    track("click", {
      path: window.location.pathname,
      target: normaliseTarget(event.target)
    });
  }, { passive: true });

  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush();
  });

  window.PromptProfit = {
    track: track,
    flush: flush,
    sessionId: sessionId,
    visitorId: visitorId
  };
})();
