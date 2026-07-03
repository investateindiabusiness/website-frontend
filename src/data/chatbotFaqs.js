export const chatbotFaqGroups = {
  public: {
    label: 'Company',
    intro: 'Before login, I can explain what this platform is, who it is for, and what information you need to sign in.',
    faqs: [
      {
        question: 'What is this platform about?',
        answer:
          'This platform helps NRIs and builders explore real estate opportunities, get support, and manage property-related inquiries in India.',
      },
      {
        question: 'Who can use this platform?',
        answer:
          'Investors, builders, and new visitors can use it to learn about services, browse opportunities, and request support.',
      },
      {
        question: 'What information do I need to log in?',
        answer:
          'You usually need your registered email or phone number and password to access your account. If you are new, you may need to register first.',
      },
    ],
  },
  investor: {
    label: 'Investor Support',
    intro: 'After login, I can help with technical issues, account support, and investment-related questions.',
    faqs: [
      {
        question: 'I need help with my account or profile',
        answer:
          'We can help with login access, password reset, profile updates, and verification issues.',
      },
      {
        question: 'I need help finding or comparing properties',
        answer:
          'We can guide you on residential, commercial, plot, villa, and ready-to-move or under-construction options and compare projects.',
      },
      {
        question: 'I need help with booking or investment details',
        answer:
          'We can assist with booking confirmation, property IDs, investment questions, and project comparison.',
      },
      {
        question: 'I need help with payments or refunds',
        answer:
          'We can review payment failures, deducted amounts, and payment-method issues and escalate them if needed.',
      },
      {
        question: 'I need help with legal, ownership, or property management issues',
        answer:
          'We can guide you on documentation, ownership concerns, compliance, rental management, maintenance, or sale-related support.',
      },
      {
        question: 'I am facing a technical issue',
        answer:
          'Share the issue area, error message, and screenshot or video so the technical team can troubleshoot or escalate quickly.',
      },
    ],
  },
  builder: {
    label: 'Builder Support',
    intro: 'After login, I can help with technical issues, listings, leads, and builder support requests.',
    faqs: [
      {
        question: 'I need help with registration or onboarding',
        answer:
          'We can assist with registration, onboarding steps, verification status, or duplicate account issues.',
      },
      {
        question: 'I need help with project listing or uploads',
        answer:
          'We can help with new listings, updates, rejected or hidden listings, and upload failures.',
      },
      {
        question: 'I need help with leads, CRM, or sales',
        answer:
          'We can assist with lead access, duplicate leads, missing follow-ups, visit scheduling, and CRM issues.',
      },
      {
        question: 'I need help with payments, commissions, or compliance',
        answer:
          'We can review payment delays, commission mismatches, invoice issues, and approval or compliance concerns.',
      },
      {
        question: 'I am facing a technical issue',
        answer:
          'Share the affected area, error message, and screenshot or video so the support team can troubleshoot or escalate.',
      },
    ],
  },
  customer: {
    label: 'Support',
    intro: 'Urgent support guidance for logged-in users and existing customers.',
    faqs: [
      {
        question: 'Which issues need immediate escalation?',
        answer:
          'Fraud complaints, unauthorized account access, multiple payment deductions, legal notices, and data breach reports should be escalated immediately.',
      },
      {
        question: 'What should I share for a technical or urgent issue?',
        answer:
          'Please share your issue description, supporting documents, contact number, and any screenshot or error message.',
      },
    ],
  },
};

export const fallbackQuestion = 'My question is not listed';
