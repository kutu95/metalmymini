export const PRIVACY_POLICY_PATH = "/privacy";
export const PRIVACY_POLICY_EFFECTIVE_DATE = "2026-08-08";

const PRIVACY_SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://metalmymini.com").replace(
  /\/$/,
  "",
);
const PRIVACY_SITE_NAME = "Metal My Mini";

export function getPrivacyPageJsonLd() {
  const privacyUrl = `${PRIVACY_SITE_URL}${PRIVACY_POLICY_PATH}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${privacyUrl}#webpage`,
    url: privacyUrl,
    name: "Privacy Policy",
    description:
      "How Metal My Mini collects, stores, and uses personal information for custom miniature orders.",
    isPartOf: {
      "@type": "WebSite",
      url: PRIVACY_SITE_URL,
      name: PRIVACY_SITE_NAME,
    },
    inLanguage: "en-AU",
    dateModified: PRIVACY_POLICY_EFFECTIVE_DATE,
  };
}

type PrivacyBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h3"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type PrivacySection = {
  number: string;
  title: string;
  blocks: PrivacyBlock[];
};

export const PRIVACY_POLICY_SECTIONS: PrivacySection[] = [
  {
    number: "1",
    title: "Who this policy is about",
    blocks: [
      {
        type: "p",
        text: 'Metal My Mini ("Metal My Mini", "I", "we", "us", "our") is a registered business name of Shay Bowskill, an individual operating as a sole trader, ABN 91 228 600 658, based in Melbourne, Victoria, Australia.',
      },
      {
        type: "p",
        text: "Metal My Mini is one person. When you send me your details and your model file, they come to me — not to a team, a call centre, or a marketing department.",
      },
      {
        type: "p",
        text: "This policy explains what personal information I collect when you use metalmymini.com (the \"Site\") or order from me, what I do with it, and how you can get at it, correct it, or complain.",
      },
      {
        type: "p",
        text: "Where the Privacy Act sits. Metal My Mini is a small business with an annual turnover under $3 million, so the small business exemption in the Privacy Act 1988 (Cth) currently applies and I am not legally bound by the Australian Privacy Principles. I've written this policy to follow them anyway, and I handle your information in line with what's set out here. If my turnover grows past the threshold, or the law changes to remove the exemption, I'll update this policy and comply.",
      },
      {
        type: "p",
        text: "Contact: metalmymini@gmail.com",
      },
    ],
  },
  {
    number: "2",
    title: "Anonymity, and ordering without an account",
    blocks: [
      {
        type: "p",
        text: "You can browse the Site without telling me who you are.",
      },
      {
        type: "p",
        text: "You don't need an account to order. You can check out as a guest. An account is optional — you can create one at signup or at checkout — and it exists only so you can log in and see your own orders in one place.",
      },
      {
        type: "p",
        text: "To place an order I do need your real contact and delivery details. I can't ship a physical object to an anonymous person.",
      },
    ],
  },
  {
    number: "3",
    title: "What I collect",
    blocks: [
      {
        type: "h3",
        text: "If you create an account (optional)",
      },
      {
        type: "ul",
        items: [
          "your name",
          "your email address, which is also your login",
          "a hash of your password — I never store or see your actual password",
          "whether the account is a customer or admin account",
          "the date the account was created",
        ],
      },
      {
        type: "h3",
        text: "When you place an order (including as a guest)",
      },
      {
        type: "ul",
        items: [
          "your full name",
          "your email address",
          "your shipping address and country",
          "what you ordered: product choice, quantity, prices, and shipping cost",
          "payment status and production status, plus a dated history of production status changes and any note attached to them",
          "whether you accepted the Terms of Service (required to order)",
          "any notes you send with the order, and any internal notes I add while working on it",
          "your courier tracking number, once it ships",
          "your order number (a public reference in the form MMM-…)",
          "a link to your account, if you were logged in or created one at checkout",
          "the dates the order was created and last updated",
        ],
      },
      {
        type: "h3",
        text: "Your uploaded 3D model file",
      },
      {
        type: "p",
        text: "When you upload an STL, OBJ or 3MF file, I store the file itself on the server's disk, and in the database I record its original filename, stored filename, file type, file size, storage path, and the time it was uploaded.",
      },
      {
        type: "p",
        text: "Model files are never public, and they aren't downloadable through the Site by anyone but me. They exist so I can review, print and plate your order. If you want a copy of a file you sent me, email me and I'll send it back to you.",
      },
      {
        type: "h3",
        text: "If you subscribe for updates",
      },
      {
        type: "p",
        text: "If you use the website signup form, I store your email address, optional first name, where you signed up from (for example the footer), and when you subscribed. I use that only to send the updates you asked for.",
      },
      {
        type: "h3",
        text: "Payments",
      },
      {
        type: "p",
        text: "Payments are processed by Stripe. Card numbers never reach my server — Stripe handles them. My system stores only the payment status and Stripe's reference for the transaction. What I can see in my Stripe dashboard is limited: the amount, date, outcome, card type and last four digits, and the name and email on the payment.",
      },
      {
        type: "h3",
        text: "Session cookie",
      },
      {
        type: "p",
        text: "If you log in, the Site sets one cookie, named metalmymini_session. It's encrypted, httpOnly, sameSite=lax, and secure. It holds your user ID, email, name, role, and a logged-in flag, and its only job is to keep you logged in between pages. It is not used for advertising, tracking across other websites, or profiling.",
      },
      {
        type: "p",
        text: "If you never log in, the Site doesn't set this cookie.",
      },
      {
        type: "h3",
        text: "Analytics",
      },
      {
        type: "p",
        text: "The Site uses Plausible Analytics, running as my own installation on the same server as the Site. Plausible is a privacy-focused, cookieless analytics tool: it records aggregate page views — the page visited, the referring site, and general device and browser type — without setting cookies and without identifying you as a named individual.",
      },
      {
        type: "p",
        text: "Because it's self-hosted, this data never leaves my server and isn't shared with an analytics company. I use it only to see which pages people find useful.",
      },
      {
        type: "h3",
        text: "Network traffic",
      },
      {
        type: "p",
        text: "The Site is served through Cloudflare, which sits in front of my server. As with any CDN, Cloudflare processes your IP address and basic request metadata to route traffic and block malicious activity.",
      },
      {
        type: "h3",
        text: "If you email me",
      },
      {
        type: "p",
        text: "I hold your email address and whatever you put in the message — including takedown notices sent under the Terms of Service.",
      },
      {
        type: "h3",
        text: "What I don't collect",
      },
      {
        type: "p",
        text: "I don't ask for and don't want government identifiers (driver's licence, Medicare, passport, tax file numbers) or any health, financial, biometric, or other sensitive information. Please don't send me these.",
      },
    ],
  },
  {
    number: "4",
    title: "Why I collect it, and what I use it for",
    blocks: [
      {
        type: "p",
        text: "I use your information to:",
      },
      {
        type: "ul",
        items: [
          "review your file for printability and plateability",
          "print, plate, and finish your order",
          "ship it to you and give you a tracking number",
          "take payment and handle refunds, chargebacks and disputes",
          "let you look up your order status",
          "talk to you about your order — revision requests, delays, questions",
          "run your account and keep you logged in, if you have one",
          "publish photos of finished work in my gallery, marketing and social media, unless you've asked me not to (section 5)",
          "keep the tax and business records the law requires me to keep",
          "deal with a warranty claim, complaint, or takedown notice",
          "see which pages of the Site people use, in aggregate",
        ],
      },
      {
        type: "p",
        text: "That's it. I don't build customer profiles, I don't sell data, and I don't use your information for anything you wouldn't expect from the list above.",
      },
    ],
  },
  {
    number: "5",
    title: "Who I share it with, and who can see what",
    blocks: [
      {
        type: "p",
        text: "I never sell your personal information or your model file.",
      },
      {
        type: "p",
        text: "Your data lives on a private server. It isn't handed to a marketing platform, a data broker, or a cloud CRM. Analytics runs on that same server, so it isn't shared with anyone either. The only outside parties involved are the ones needed to take the money, move the traffic, and deliver the parcel:",
      },
      {
        type: "table",
        headers: ["Who", "What they get", "Why"],
        rows: [
          ["Stripe", "Your name, email, and payment details", "To process payment"],
          ["Cloudflare", "Your IP address and request metadata", "To serve and protect the Site"],
          [
            "Australia Post / courier",
            "Your name, delivery address, and phone number if given",
            "To deliver your order",
          ],
        ],
      },
      {
        type: "p",
        text: "I'll also disclose information where I'm required or authorised to by law, or where it's reasonably necessary to deal with a legal claim.",
      },
      {
        type: "h3",
        text: "Who can see your data",
      },
      {
        type: "ul",
        items: [
          "You, logged in: your own orders and their status.",
          "You, as a guest: a single order, by entering that order's number together with the email address used on it.",
          "Me: everything — all orders, addresses, emails, model files, notes and gallery entries. I'm the person doing the work.",
          "My dad, who runs and maintains the private server the Site lives on. Keeping the machine running means he has administrator access to it. He doesn't take part in the business, doesn't handle orders, and has agreed in writing not to access or use customer data for any purpose other than maintaining the system.",
          "The public: only published gallery images and marketing pages. Never your files, your name, or your order details.",
        ],
      },
      {
        type: "p",
        text: "I'd rather tell you plainly that two people can technically reach the server than write \"only me\" and have it be untrue.",
      },
      {
        type: "h3",
        text: "Gallery and marketing photos",
      },
      {
        type: "p",
        text: "Photos of finished work are how people find this business and see what the process actually produces. When you order, you agree that photos of your finished piece may appear in my gallery, on the Site, in marketing, and on social media.",
      },
      {
        type: "p",
        text: "If you'd rather I didn't, just tell me. Put it in the order notes when you upload your file, or email me at metalmymini@gmail.com — before your piece is made, or any time afterwards. You don't need to give a reason, and it doesn't affect your order, your price, or how the piece is made. If something of yours is already published and you want it gone, say so and I'll take it down.",
      },
      {
        type: "p",
        text: "Photos show the finished miniature, not you. I don't caption gallery entries with customer names or link them to your order.",
      },
      {
        type: "h3",
        text: "Rights holders and takedown notices",
      },
      {
        type: "p",
        text: "If someone sends a valid takedown notice about a file, I may tell them that I've declined or stopped the job. I won't hand over your name, contact details, or your file unless I'm legally required to — for example under a court order or subpoena.",
      },
    ],
  },
  {
    number: "6",
    title: "How long I keep things",
    blocks: [
      {
        type: "p",
        text: "Your uploaded model file. I clear out model files on a monthly schedule: your file is deleted in the clear-out at the end of the month after the month your order shipped. So an order that ships in March is cleared at the end of April.",
      },
      {
        type: "p",
        text: "I keep it that long so I can reprint if your order is lost or damaged in transit, and so I can deal with a payment dispute or a warranty claim. Ask me and I'll delete it sooner — as soon as it's no longer needed for an open order or dispute. I'd rather delete a file than hold it.",
      },
      {
        type: "p",
        text: "Everything else:",
      },
      {
        type: "ul",
        items: [
          "Order and transaction records (what you ordered, when, what you paid, your address): five years, which is the record-keeping period required for tax purposes.",
          "Account details, if you have an account: kept while your account is open. Ask me to close it and I'll delete the account and its password hash, keeping only the order records I'm required to hold.",
          "Email correspondence: kept while it's relevant to an order, a dispute, or my records, then deleted.",
          "Gallery images: kept while published. Ask me to remove one and I'll unpublish it.",
          "Analytics data: aggregate only, held on my own server, and never linked back to your order or account.",
          "Backups: The server is backed up so that orders and files can be recovered after a hardware failure. When I delete something it goes from the live system straight away, but a copy may survive in a backup for up to 90 days before that backup is overwritten.",
        ],
      },
      {
        type: "p",
        text: "When I no longer need personal information and I'm not required to keep it, I delete it.",
      },
    ],
  },
  {
    number: "7",
    title: "Where your data is stored, and overseas disclosure",
    blocks: [
      {
        type: "p",
        text: "Your order details and your uploaded model files are stored in Australia, on a private server in Western Australia, run and maintained by my dad on my behalf. They are not stored in a public cloud. Site analytics live on that same server. Nothing in that list is sent overseas by me.",
      },
      {
        type: "p",
        text: "Two of the services above do operate outside Australia:",
      },
      {
        type: "ul",
        items: [
          "Stripe processes and stores payment data in the United States and in other countries where it operates. This covers your payment details and the name and email attached to the payment — not your model file or your order notes.",
          "Cloudflare operates a global network, so your IP address and request metadata may be processed at a data centre outside Australia when you visit the Site.",
        ],
      },
    ],
  },
  {
    number: "8",
    title: "Marketing",
    blocks: [
      {
        type: "p",
        text: "You can opt in to occasional website updates (new finishes, gallery pieces, shipping news) using the signup form on the Site. That list is opt-in only. When I send those emails, every message will have a working unsubscribe link. I won't buy, sell or rent mailing lists.",
      },
      {
        type: "p",
        text: "Emails about your actual order — file queries, revision requests, production updates, dispatch — aren't marketing. They're the service you paid for, and they'll keep coming while your order is running.",
      },
    ],
  },
  {
    number: "9",
    title: "Cookies",
    blocks: [
      {
        type: "p",
        text: "The Site uses one cookie: the login session cookie described in section 3, and only if you log in. There are no advertising cookies, no third-party tracking cookies, and no cross-site trackers. The analytics doesn't set cookies either — that's the point of using Plausible.",
      },
      {
        type: "p",
        text: "If you block the session cookie you can still browse the Site and place a guest order, but you won't be able to stay logged in to an account.",
      },
    ],
  },
  {
    number: "10",
    title: "Keeping it secure",
    blocks: [
      {
        type: "p",
        text: "I take reasonable steps to protect your information:",
      },
      {
        type: "ul",
        items: [
          "The Site runs over HTTPS, behind Cloudflare.",
          "Card details never touch my server — Stripe handles them.",
          "Passwords are stored only as bcrypt hashes. I can't see your password, and neither could anyone who obtained the database.",
          "Uploaded model files sit outside the database in access-controlled storage, and can't be downloaded through the Site by anyone but me.",
          "The session cookie is encrypted, httpOnly and secure, which limits what a malicious script or an intercepted connection could do with it.",
          "Access is limited to two people: me, for the business itself, and my dad, for maintaining the server (section 5). Both accounts use strong, unique credentials.",
          "I clear out model files monthly (section 6) — the safest data is data I no longer hold.",
        ],
      },
      {
        type: "p",
        text: "No system is completely secure, and I won't pretend otherwise. If something goes wrong and a breach is likely to cause you serious harm, I'll tell you and the Office of the Australian Information Commissioner promptly, with what happened, what was affected, and what you should do about it. I'm committing to that voluntarily — the Notifiable Data Breaches scheme doesn't formally apply to a business my size.",
      },
    ],
  },
  {
    number: "11",
    title: "Getting at your information, correcting it, and deleting it",
    blocks: [
      {
        type: "p",
        text: "There's no self-service download or delete button on the Site. Everything below happens by email, and I handle it personally.",
      },
      {
        type: "p",
        text: "Access. Email me at metalmymini@gmail.com and I'll tell you what I hold about you and send you a copy, free of charge. I'll respond within 30 days and usually much sooner — it's a small business and there isn't much to look up. If there's something I can't give you, I'll explain why.",
      },
      {
        type: "p",
        text: "Correction. If something I hold is wrong, out of date, or incomplete, tell me and I'll fix it. If you spot a wrong delivery address before your order ships, tell me quickly — once it's with the courier there's not much either of us can do.",
      },
      {
        type: "p",
        text: "Deletion. You can ask me to delete your model file at any time, and to close your account. I can't delete order and transaction records inside the five-year tax retention period, but I'll delete everything I'm not required to keep.",
      },
    ],
  },
  {
    number: "12",
    title: "Complaints",
    blocks: [
      {
        type: "p",
        text: "If you think I've mishandled your information, email me at metalmymini@gmail.com with the details. I'll acknowledge it within 5 business days and give you a proper answer within 30 days.",
      },
      {
        type: "p",
        text: "If you're not happy with how I've handled it, you can contact the Office of the Australian Information Commissioner at oaic.gov.au or 1300 363 992. Note that because Metal My Mini is currently covered by the small business exemption, there may be limits on what the OAIC can do about a complaint against me. For consumer issues about your order rather than your privacy, Consumer Affairs Victoria (consumer.vic.gov.au) or the consumer agency in your own state or territory can help.",
      },
    ],
  },
  {
    number: "13",
    title: "Children",
    blocks: [
      {
        type: "p",
        text: "The Terms of Service require you to be 18 or over to order. I don't knowingly collect personal information from children. If you believe a child has given me their information, email me and I'll delete it.",
      },
    ],
  },
  {
    number: "14",
    title: "Changes to this policy",
    blocks: [
      {
        type: "p",
        text: "I'll update this policy when my practices change — for example if I change hosting, add a service provider, or start doing something new with data. The current version is always the one published here, with the \"last updated\" date at the top. If a change materially affects how I handle information I already hold about you, I'll email you about it.",
      },
    ],
  },
  {
    number: "15",
    title: "Contact",
    blocks: [
      {
        type: "p",
        text: "Questions about this policy, access and correction requests, or privacy complaints: metalmymini@gmail.com",
      },
    ],
  },
];
