import { SUPPORT_EMAIL } from "@/lib/returns-policy";

export const PRIVACY_POLICY_PATH = "/privacy";
export const PRIVACY_POLICY_EFFECTIVE_DATE = "2026-08-08";

const PRIVACY_SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://metalmymini.com").replace(
  /\/$/,
  "",
);
const PRIVACY_SITE_NAME = "Metal My Mini";
const PRIVACY_SITE_NAME_ALT = "MetalMyMini";
const PRIVACY_LOCATION = "Melbourne, Victoria, Australia";

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
  };
}

export const PRIVACY_POLICY_INTRO = [
  `${PRIVACY_SITE_NAME} (${PRIVACY_SITE_NAME_ALT}) is a custom miniature printing and copper-plating service operated by Shay in ${PRIVACY_LOCATION}. This policy explains what personal information we collect, why we collect it, how we store it, and how you can ask us about it.`,
  "This policy is written to match how the website actually works today. If we add payment or shipping integrations later, we will update this page.",
] as const;

export const PRIVACY_POLICY_SECTIONS = [
  {
    title: "Who we are",
    paragraphs: [
      `${PRIVACY_SITE_NAME} is a sole-operator business. Shay reviews files, produces orders, and handles customer contact.`,
      `You can reach us at ${SUPPORT_EMAIL}. Our website is ${PRIVACY_SITE_URL}.`,
    ],
  },
  {
    title: "What we collect",
    paragraphs: ["We collect personal information when you place an order, create an account, or contact us."],
    bullets: [
      "Order details: name, email address, shipping address, country, product choice, quantity, prices, order number, production and payment status, tracking number (once shipped), and any notes on the order.",
      "Optional account details: name, email address, and a hashed password. We do not store your password in plain text.",
      "Uploaded model files: STL, OBJ, or 3MF files you send for printing, plus the original filename and file size.",
      "Consents: whether you accepted the order terms, and whether you agreed that completed work may appear in the public gallery or marketing.",
      "Login session: if you log in, we store a session cookie so you stay signed in.",
      "Website analytics: page views on metalmymini.com via a script hosted at analytics.margies.app.",
    ],
  },
  {
    title: "How we use your information",
    paragraphs: ["We use this information to run the service you asked for:"],
    bullets: [
      "Take, review, produce, pack, and ship your order.",
      "Contact you if a file needs clarification, cannot be produced, or needs extra work.",
      "Let you track an order with your order number and email, or through a logged-in account.",
      "Show completed work in the public gallery only if you agreed to that at checkout.",
      "Keep the website secure and understand how the site is used.",
    ],
  },
  {
    title: "Guest orders and accounts",
    paragraphs: [
      "You can order as a guest. An account is optional.",
      "Guest tracking uses the order number and the email address supplied with the order. Anyone with both of those details can look up that order.",
      "If you create an account, we link matching orders to that account so you can view history and reorder from a stored file.",
    ],
  },
  {
    title: "Uploaded files and photos",
    paragraphs: [
      "Your 3D model files are stored on our server so we can print and plate your miniature. They are not published. Only you (as the order owner) and the operator can download them.",
      "If you consent, we may photograph the finished miniature and publish it in the gallery or use it in marketing. Published gallery images are visible to anyone visiting the site.",
      "You can ask us not to publish a piece, or to take a published gallery item down, by emailing us. We will still keep the order record needed to fulfil or document the job unless you ask us to delete it and we are able to do so.",
    ],
  },
  {
    title: "Cookies",
    paragraphs: [
      "If you log in, we set one essential cookie named metalmymini_session. It is encrypted, marked httpOnly, and used only to keep you logged in. It is not used for advertising.",
      "The analytics script from analytics.margies.app is a Plausible-style tracker. It is intended to record page views (such as page URL, referrer, and general device/browser information) without building a named customer profile. It is not used to serve ads.",
    ],
  },
  {
    title: "Payments",
    paragraphs: [
      "We do not store credit card numbers in this application.",
      "If we later take card payments through a processor such as Stripe, that processor will handle card details. We would typically store only payment status or a processor reference, not full card numbers. This policy will be updated before that goes live.",
    ],
  },
  {
    title: "Who we share information with",
    paragraphs: [
      "We do not sell your personal information.",
      "We share information only as needed to operate the site and fulfil orders:",
    ],
    bullets: [
      "Our own server in Australia, where the website, database, and uploaded files are hosted.",
      "Cloudflare, which carries public website traffic (and therefore sees IP addresses and request metadata, as any CDN or tunnel provider would).",
      "analytics.margies.app, for website analytics.",
      "Shipping carriers such as Australia Post, when we quote or send a parcel (name, address, and related shipping details).",
      "A payment processor, if and when card checkout is enabled.",
    ],
    closing:
      "We may also disclose information if required by law, or to protect the business, customers, or others from serious harm.",
  },
  {
    title: "Where your information is stored",
    paragraphs: [
      "Order records, accounts, and files are stored on our server in Australia.",
      "Database records for this site live in a dedicated “metal” schema on our self-hosted PostgreSQL database. Uploaded models and photos are stored as files on the same server, outside the public website folder.",
      "Cloudflare and analytics.margies.app process some request or analytics data as described above. Those providers may process data outside Australia depending on how they operate.",
    ],
  },
  {
    title: "How long we keep information",
    paragraphs: [
      "We keep order, account, and file data for as long as needed to fulfil the order, handle follow-up, reorders, disputes, or legal obligations.",
      "There is no automated deletion in the website. If you want information deleted, email us and we will delete or de-identify it where we reasonably can. We may need to retain some records (for example completed orders, tax, or dispute history).",
    ],
  },
  {
    title: "Security",
    paragraphs: [
      "Passwords are stored as one-way hashes. Login sessions are encrypted cookies. Model files are not listed publicly and are only downloadable by the order owner or the operator.",
      "No online service is perfectly secure. If you believe there has been unauthorised access to your information, contact us promptly.",
    ],
  },
  {
    title: "Your rights",
    paragraphs: [
      "You can ask us to access, correct, or delete personal information we hold about you, or to explain how we use it. There is no self-serve export or delete button on the site — email us and we will handle the request.",
      "If you are in Australia, you also have rights under the Australian Privacy Principles and the Australian Consumer Law. If you are not satisfied with our response, you may contact the Office of the Australian Information Commissioner (OAIC).",
    ],
  },
  {
    title: "Children",
    paragraphs: [
      "This service is intended for adults purchasing custom miniatures. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "Changes to this policy",
    paragraphs: [
      "We may update this policy when the site or our practices change. The effective date at the top of this page will be updated when we do. Continued use of the site after a change means you accept the updated policy.",
    ],
  },
] as const;
