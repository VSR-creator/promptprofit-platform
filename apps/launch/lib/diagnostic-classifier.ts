export type DiagnosticAnswers = {
  businessType?: string | null;
  websiteOrInstagram?: string | null;
  mainOffer?: string | null;
  desiredAction?: string | null;
  biggestIssue?: string | null;
};

export type DiagnosticResult = {
  key: string;
  eyebrow: string;
  title: string;
  summary: string;
  likelyLeak: string;
  whatToCheck: string[];
  auditBridge: string;
};

export function classifyDiagnostic(
  answers: DiagnosticAnswers,
): DiagnosticResult {
  const issue = (answers.biggestIssue ?? "").toLowerCase();
  const desiredAction = (answers.desiredAction ?? "").toLowerCase();
  const journey = (answers.websiteOrInstagram ?? "").toLowerCase();

  if (issue.includes("follow-up is slow")) {
    return {
      key: "follow_up",
      eyebrow: "LIKELY LEAK: FOLLOW-UP",
      title: "Your enquiry process may be slower than your buyer.",
      summary:
        "Interest is only useful while it is still warm. If leads wait too long for a reply, the website may be doing its job while the handover quietly loses the opportunity.",
      likelyLeak:
        "The likely gap is between lead capture and a clear, fast next response.",
      whatToCheck: [
        "Where enquiries currently arrive",
        "Who receives the notification",
        "What happens in the first five minutes",
      ],
      auditBridge:
        "The Profit Leak Audit maps the handover, identifies the friction, and prioritises the smallest useful fix.",
    };
  }

  if (
    issue.includes("instagram gets attention") ||
    journey.includes("instagram") ||
    desiredAction.includes("whatsapp")
  ) {
    return {
      key: "attention_to_enquiry",
      eyebrow: "LIKELY LEAK: ATTENTION TO ENQUIRY",
      title: "Attention may be arriving without a clear route to enquire.",
      summary:
        "Instagram attention does not automatically become business. The missing piece is usually a simple next action, a clear offer, or a handover that does not require visitors to become detectives.",
      likelyLeak:
        "The likely gap is between content interest and the first conversion action.",
      whatToCheck: [
        "Whether the offer is clear before the link is clicked",
        "Whether the destination matches the post promise",
        "Whether the enquiry action is obvious on mobile",
      ],
      auditBridge:
        "The Profit Leak Audit reviews the full Instagram-to-enquiry journey and ranks the first fixes.",
    };
  }

  if (issue.includes("basic questions")) {
    return {
      key: "clarity",
      eyebrow: "LIKELY LEAK: CLARITY",
      title: "Your visitors may be working too hard to understand the offer.",
      summary:
        "When people ask questions the website should answer, the problem is often not interest. It is that the value, fit, proof, or next step is unclear at the moment they are deciding.",
      likelyLeak:
        "The likely gap is message clarity before the visitor reaches the enquiry step.",
      whatToCheck: [
        "Whether the main offer is understandable in seconds",
        "Whether the right customer can recognise themselves",
        "Whether the next step is specific and low-friction",
      ],
      auditBridge:
        "The Profit Leak Audit identifies the highest-impact messaging gaps and includes three practical copy upgrades.",
    };
  }

  if (issue.includes("not sure where the drop-off")) {
    return {
      key: "measurement",
      eyebrow: "LIKELY LEAK: VISIBILITY",
      title: "You may have a conversion leak before you have a traffic problem.",
      summary:
        "If you cannot see where visitors lose momentum, it is difficult to know whether to improve the offer, the page, the call to action, or the follow-up.",
      likelyLeak:
        "The likely gap is a missing view of visitor intent and conversion friction.",
      whatToCheck: [
        "Which pages attract meaningful attention",
        "Which actions visitors take before leaving",
        "Where the enquiry journey becomes unclear or inconvenient",
      ],
      auditBridge:
        "The Profit Leak Audit gives you a focused diagnosis instead of a vague recommendation to ‘improve the website.’",
    };
  }

  return {
    key: "conversion_path",
    eyebrow: "LIKELY LEAK: CONVERSION PATH",
    title: "Visitors may be interested but not being guided to enquire.",
    summary:
      "A website can look credible and still lose business when the offer, proof, call to action, and follow-up do not work together as one conversion journey.",
    likelyLeak:
      "The likely gap is between visitor attention and one clear next action.",
    whatToCheck: [
      "Whether the primary call to action is visible and specific",
      "Whether trust appears before the visitor needs it",
      "Whether the enquiry journey has unnecessary steps",
    ],
    auditBridge:
      "The Profit Leak Audit reviews the journey, identifies the three biggest leaks, and gives you a ranked Fix First plan within 48 hours.",
  };
}
