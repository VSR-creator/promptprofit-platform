(function () {
  "use strict";

  var script = document.currentScript;
  var siteKey = script && script.getAttribute("data-site-key");
  var apiBase = (script && script.getAttribute("data-api-base")) || "";
  var eventQueue = [];
  var flushTimer = null;
  var config = null;

  if (!siteKey) {
    console.error("[PromptProfit] Missing data-site-key.");
    return;
  }

  function createUuid() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
      var random = (Math.random() * 16) | 0;
      var value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  function getOrCreateId(key) {
    var existing = window.sessionStorage.getItem(key);

    if (existing) {
      return existing;
    }

    var id = createUuid();
    window.sessionStorage.setItem(key, id);
    return id;
  }

  var sessionId = getOrCreateId("pp_session_id");
  var visitorId = getOrCreateId("pp_visitor_id");

  function track(type, data) {
    eventQueue.push({
      type: type,
      timestamp: new Date().toISOString(),
      data: data || {},
    });

    scheduleFlush();
  }

  function scheduleFlush() {
    if (flushTimer) {
      return;
    }

    flushTimer = window.setTimeout(function () {
      flushTimer = null;
      flush();
    }, 1000);
  }

  function hasSeenFlow(flowId) {
    return window.sessionStorage.getItem("pp_flow_seen_" + flowId) === "true";
  }

  function markFlowSeen(flowId) {
    window.sessionStorage.setItem("pp_flow_seen_" + flowId, "true");
  }

  function dispatchDecision(decision) {
    if (
      !decision ||
      decision.decisionType !== "show_flow" ||
      !decision.flowId ||
      hasSeenFlow(decision.flowId)
    ) {
      return;
    }

    markFlowSeen(decision.flowId);

    console.log("[PromptProfit] Dispatching flow decision:", decision);

    window.dispatchEvent(
      new CustomEvent("pp-decision", {
        detail: decision,
      })
    );
  }

  async function flush() {
    if (!eventQueue.length) {
      return;
    }

    var events = eventQueue.splice(0, eventQueue.length).map(function (event) {
      return {
        type: event.type || "unknown",
        timestamp: event.timestamp || new Date().toISOString(),
        data: event.data || {},
      };
    });

    console.log("[BrainSDK FLUSH]", events);

    try {
      var response = await fetch(apiBase + "/api/brain/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteKey: siteKey,
          sessionId: sessionId,
          visitorId: visitorId,
          events: events,
        }),
        keepalive: true,
      });

      if (!response.ok) {
        var errorBody = await response.text();

        console.error(
          "[PromptProfit] Event delivery failed:",
          response.status,
          errorBody
        );

        eventQueue.unshift.apply(eventQueue, events);
        return;
      }

      var result = await response.json();

      console.log("[PromptProfit] Events accepted:", result);

      dispatchDecision(result.decision);
    } catch (error) {
      console.error("[PromptProfit] Event delivery failed:", error);

      eventQueue.unshift.apply(eventQueue, events);
    }
  }

  async function loadConfig() {
    try {
      var response = await fetch(
        apiBase + "/api/brain/config?siteKey=" + encodeURIComponent(siteKey),
        {
          headers: {
            Origin: window.location.origin,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Config request failed: " + response.status);
      }

      config = await response.json();

      console.log("[PromptProfit] Config loaded:", config);
    } catch (error) {
      console.error("[PromptProfit] Config load failed:", error);
    }
  }

  function initialiseTracking() {
    track("page_view", {
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer || null,
    });

    var maxScrollDepth = 0;

    window.addEventListener(
      "scroll",
      function () {
        var documentHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        if (documentHeight <= 0) {
          return;
        }

        var scrollDepth = Math.round(
          (window.scrollY / documentHeight) * 100
        );

        if (scrollDepth >= maxScrollDepth + 25) {
          maxScrollDepth = Math.min(scrollDepth, 100);

          track("scroll_depth", {
            depth: maxScrollDepth,
            path: window.location.pathname,
          });
        }
      },
      { passive: true }
    );

    document.addEventListener("click", function (event) {
      var target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      var interactiveElement = target.closest("a, button, input[type='submit']");

      if (!interactiveElement) {
        return;
      }

      track("click", {
        tag: interactiveElement.tagName.toLowerCase(),
        text: (interactiveElement.textContent || "").trim().slice(0, 120),
        href: interactiveElement.getAttribute("href"),
        path: window.location.pathname,
      });
    });

    window.addEventListener("beforeunload", function () {
      flush();
    });
  }

  loadConfig();
  initialiseTracking();

  window.PromptProfit = {
    track: track,
    flush: flush,
    getSessionId: function () {
      return sessionId;
    },
    getVisitorId: function () {
      return visitorId;
    },
    getConfig: function () {
      return config;
    },
  };
})();
