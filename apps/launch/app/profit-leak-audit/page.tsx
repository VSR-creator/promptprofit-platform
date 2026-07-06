"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Region = "za" | "international" | "unknown";

const deliverables = [
  "The three biggest conversion leaks in one website or Instagram journey",
  "A ranked Fix First plan, so you know what to change before changing everything",
  "Three practical copy upgrades for the moments that currently lose attention",
  "A short screen-recorded walkthrough of the journey",
  "A 20-minute Audit Debrief + Install Call included for the first 50 launch buyers",
];

const notIncluded = [
  "A full website redesign",
  "Paid advertising management",
  "Unlimited consulting",
  "A custom app build",
  "Guaranteed revenue",
];

export default function ProfitLeakAuditPage() {
  const [region, setRegion] = useState<Region>("unknown");

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (timezone === "Africa/Johannesburg") {
      setRegion("za");
      return;
    }

    if (timezone) {
      setRegion("international");
    }
  }, []);

  const isSouthAfrica = region === "za";
  const price = isSouthAfrica ? "R997" : "$49 USD";
  const priceDetail = isSouthAfrica
    ? "Launch price for South African businesses"
    : "Launch price for international businesses";

  // Replace these values after payment verification.
  const checkoutUrl = isSouthAfrica
    ? "https://paystack.com/pay/REPLACE_WITH_ZA_AUDIT_LINK"
    : "https://paystack.com/pay/REPLACE_WITH_USD_AUDIT_LINK";

  return (
    <main className="audit-page">
      <section className="audit-hero">
        <div className="container audit-hero-inner">
          <Link className="back-link audit-back-link" href="/diagnostic">
            ← Back to the free diagnostic
          </Link>

          <div className="eyebrow">PROMPTPROFIT PROFIT LEAK AUDIT</div>
          <h1>Find the three places your customer journey loses money.</h1>
          <p className="audit-hero-copy">
            A focused conversion diagnosis for service businesses that already
            get attention but want more qualified enquiries from it.
          </p>

          <div className="audit-price-panel">
            <div>
              <div className="price-label">FIRST 50 LAUNCH AUDITS</div>
              <div className="audit-price">{price}</div>
              <p>{priceDetail}</p>
              <p className="price-fallback">
                Your price is shown according to your region. If regional
                pricing cannot be confirmed, pricing defaults to USD.
              </p>
            </div>

            <a
              className="button button-primary"
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
            >
              Reserve My Audit
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <div className="section-label">WHAT YOU RECEIVE</div>
            <h2>A clear diagnosis. Not a 40-page document that dies in Downloads.</h2>
          </div>

          <div className="audit-list">
            {deliverables.map((item) => (
              <div className="audit-list-item" key={item}>
                <span>✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="section-label">HOW IT WORKS</div>
          <h2>One journey. One diagnosis. A useful next move.</h2>

          <div className="steps-grid">
            <article className="step-card">
              <span>01</span>
              <h3>Reserve your audit</h3>
              <p>
                Choose the launch offer and complete the paid audit intake form.
              </p>
            </article>

            <article className="step-card">
              <span>02</span>
              <h3>We inspect the journey</h3>
              <p>
                PromptProfit reviews one website or Instagram journey for
                clarity, trust, friction, capture, and follow-up leaks.
              </p>
            </article>

            <article className="step-card">
              <span>03</span>
              <h3>Receive your Fix First plan</h3>
              <p>
                Your audit arrives within 48 hours of a completed intake form.
              </p>
            </article>

            <article className="step-card">
              <span>04</span>
              <h3>Choose the next move</h3>
              <p>
                The first 50 buyers receive an included 20-minute Audit Debrief
                + Install Call.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <div className="section-label">WHAT THIS IS NOT</div>
            <h2>A diagnosis before a decision, not an agency relationship in disguise.</h2>
          </div>

          <div className="not-included">
            {notIncluded.map((item) => (
              <p key={item}>— {item}</p>
            ))}
            <p className="not-included-note">
              PromptProfit identifies the smallest conversion fix worth making
              first. If you want us to install it, you can decide after the
              audit.
            </p>
          </div>
        </div>
      </section>

      <section className="section audit-final-cta">
        <div className="container narrow">
          <div className="section-label">LAUNCH BATCH</div>
          <h2>Fixing the right leak is usually cheaper than buying more traffic.</h2>
          <p>
            Reserve one of the first 50 Profit Leak Audits. Delivery begins once
            your intake form is complete.
          </p>
          <a
            className="button button-light"
            href={checkoutUrl}
            target="_blank"
            rel="noreferrer"
          >
            Reserve My Audit for {price}
          </a>
        </div>
      </section>
    </main>
  );
}
