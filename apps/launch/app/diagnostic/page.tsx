"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const questions = [
  {
    id: "businessType",
    label: "What type of service business do you run?",
    placeholder: "Example: clinic, agency, consultant, home service",
  },
  {
    id: "website",
    label: "What is your website or Instagram link?",
    placeholder: "https://",
  },
  {
    id: "mainOffer",
    label: "What is the main service you want more enquiries for?",
    placeholder: "Example: monthly bookkeeping, wedding photography",
  },
  {
    id: "desiredAction",
    label: "What should an interested visitor do next?",
    options: [
      "Send a WhatsApp message",
      "Complete an enquiry form",
      "Book a call",
      "Request a quote",
      "Make a booking",
      "Something else",
    ],
  },
  {
    id: "biggestIssue",
    label: "Which problem sounds most familiar?",
    options: [
      "People visit but do not enquire",
      "People ask basic questions that the site should answer",
      "Leads arrive but follow-up is slow",
      "Instagram gets attention but it does not become enquiries",
      "I am not sure where the drop-off happens",
    ],
  },
];

export default function DiagnosticPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      businessType: String(formData.get("businessType") ?? ""),
      websiteOrInstagram: String(formData.get("website") ?? ""),
      mainOffer: String(formData.get("mainOffer") ?? ""),
      desiredAction: String(formData.get("desiredAction") ?? ""),
      biggestIssue: String(formData.get("biggestIssue") ?? ""),
      email: String(formData.get("email") ?? ""),
      source: "launch_site",
      campaign: "instagram_launch",
      entryPoint: "free_diagnostic",
    };

    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error ??
            "We could not save your diagnostic. Please try again.",
        );
      }

      router.push(`/thank-you?diagnosticId=${result.diagnosticId}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not save your diagnostic. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="diagnostic-page">
      <div className="container diagnostic-shell">
        <Link className="back-link" href="/">
          ← PromptProfit
        </Link>

        <div className="eyebrow">FREE CONVERSION DIAGNOSTIC</div>
        <h1>Find out where your enquiries may be disappearing.</h1>

        <p className="diagnostic-intro">
          Answer five quick questions. This is not a sales call disguised as a
          worksheet. It identifies whether clarity, trust, friction, lead
          capture, or follow-up is the likely problem.
        </p>

        <form className="diagnostic-form" onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div className="field" key={question.id}>
              <label htmlFor={question.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {question.label}
              </label>

              {question.options ? (
                <select id={question.id} name={question.id} required>
                  <option value="">Choose one</option>
                  {question.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={question.id}
                  name={question.id}
                  type={question.id === "website" ? "url" : "text"}
                  placeholder={question.placeholder}
                  required
                />
              )}
            </div>
          ))}

          <div className="field">
            <label htmlFor="email">
              <span>06</span>
              Where should we send your diagnostic result?
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@business.com"
              required
            />
          </div>

          {errorMessage ? (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            className="button button-primary"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Checking Your Conversion Journey..."
              : "Check My Conversion Journey"}
          </button>

          <p className="form-note">
            You will not be added to a vague newsletter called “Growth
            Insights.” You will receive the relevant next step for your journey.
          </p>
        </form>
      </div>
    </main>
  );
}
