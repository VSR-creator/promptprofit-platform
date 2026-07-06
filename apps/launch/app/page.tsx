import Link from "next/link";

export default function LaunchHomePage() {
  return (
    <main className="launch-page">
      <section className="container hero">
        <div className="eyebrow">PROMPTPROFIT CONVERSION SYSTEM</div>

        <h1>
          Your website may be getting attention.
          <br />
          It may also be quietly losing enquiries.
        </h1>

        <p className="hero-copy">
          PromptProfit helps service businesses find the leaks between visitor
          attention and real enquiries — then install a measurable conversion
          journey to close them.
        </p>

        <div className="hero-actions">
          <Link className="button button-primary" href="/diagnostic">
            Get Your Free Diagnostic
          </Link>

          <Link className="button button-secondary" href="/profit-leak-audit">
            See the Profit Leak Audit
          </Link>
        </div>

        <p className="hero-note">
          No vague “growth insights.” Just the next useful conversion fix.
        </p>
      </section>

      <section className="container launch-section">
        <div className="eyebrow">THINGS YOUR WEBSITE DOES INSTEAD OF MAKING MONEY</div>
        <h2>It can look polished and still behave like a brochure.</h2>

        <div className="leak-grid">
          <article className="leak-card">
            <span>01</span>
            <h3>Explains everything</h3>
            <p>Except what a ready buyer should do next.</p>
          </article>

          <article className="leak-card">
            <span>02</span>
            <h3>Collects attention</h3>
            <p>Then sends interested people into a contact-page maze.</p>
          </article>

          <article className="leak-card">
            <span>03</span>
            <h3>Looks trustworthy</h3>
            <p>But gives visitors no proof at the moment they need it.</p>
          </article>
        </div>
      </section>

      <section className="container launch-section launch-cta">
        <div className="eyebrow">START SMALL</div>
        <h2>Find the leak before paying to redesign the pipe.</h2>
        <p>
          Answer five questions and receive the relevant next step for your
          website or Instagram customer journey.
        </p>
        <Link className="button button-primary" href="/diagnostic">
          Check My Conversion Journey
        </Link>
      </section>
    </main>
  );
}
