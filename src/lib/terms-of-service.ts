export const TERMS_PATH = "/terms";
export const TERMS_EFFECTIVE_DATE = "2026-08-08";

const TERMS_SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://metalmymini.com").replace(
  /\/$/,
  "",
);
const TERMS_SITE_NAME = "Metal My Mini";

export function getTermsPageJsonLd() {
  const termsUrl = `${TERMS_SITE_URL}${TERMS_PATH}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${termsUrl}#webpage`,
    url: termsUrl,
    name: "Terms of Service",
    description:
      "Terms of Service for Metal My Mini — custom resin printing and copper electroplating of customer-supplied 3D model files.",
    isPartOf: {
      "@type": "WebSite",
      url: TERMS_SITE_URL,
      name: TERMS_SITE_NAME,
    },
    inLanguage: "en-AU",
    dateModified: TERMS_EFFECTIVE_DATE,
  };
}

type TermsBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type TermsSection = {
  number: string;
  title: string;
  blocks: TermsBlock[];
};

export const TERMS_INTRO = [
  "These Terms of Service apply every time you use our website and order our service. By placing an order, you agree to these Terms. If you don't agree, please don't place an order.",
] as const;

export const TERMS_SECTIONS: TermsSection[] = [
  {
    number: "1",
    title: "Who we are and what this covers",
    blocks: [
      {
        type: "p",
        text: 'Metal My Mini ("Metal My Mini", "we", "us", "our") is a registered business name of Shay Bowskill, an individual operating as a sole trader, ABN 91 228 600 658, based in Victoria, Australia.',
      },
      {
        type: "p",
        text: "These Terms of Service (\"Terms\") apply every time you use our website at metalmymini.com (the \"Site\") and order our service. Our service is: you upload a 3D model file, choose a finish, and pay; we then review the file, resin-print the model, copper-electroplate it, and ship it to you. By placing an order, you agree to these Terms. If you don't agree, please don't place an order.",
      },
      {
        type: "p",
        text: "We may update these Terms from time to time (see section 16). The version in force is the one published on the Site when you place your order.",
      },
    ],
  },
  {
    number: "2",
    title: "Eligibility",
    blocks: [
      {
        type: "p",
        text: "You must be at least 18 years old to order from us. By ordering, you confirm you are 18 or over and able to enter into a contract.",
      },
    ],
  },
  {
    number: "3",
    title: "Your file: your rights, and the licence you give us",
    blocks: [
      {
        type: "p",
        text: "The promises you make to us. When you upload a file to us, you promise (you \"warrant\") that:",
      },
      {
        type: "ul",
        items: [
          "you own the file, or you otherwise have all the rights, licences, and permissions needed to have it 3D-printed and electroplated by us; and",
          "having us print and plate that file, and supplying the finished item to you, does not and will not infringe anyone else's intellectual property or other rights (for example copyright, registered designs, trade marks, or patents).",
        ],
      },
      {
        type: "p",
        text: "You are responsible for your file. We rely on the promises above. Deciding whether you have the rights to print something is your call to make before you upload — see section 4 for what we do and don't review.",
      },
      {
        type: "p",
        text: "The permission you give us. So that we can actually make your order, you grant us a non-exclusive, royalty-free licence to store, reproduce, and modify your file — including slicing it, scaling it, adding and removing supports, orienting it, and repairing or adjusting geometry so it prints and plates properly — and to print and plate it. This licence is limited to fulfilling your order and to the retention period in section 13, and ends when we delete your file.",
      },
      {
        type: "p",
        text: "Any permission you give us for photos under section 13 is separate from this licence, and continues until you ask us to remove them.",
      },
      {
        type: "p",
        text: "You keep all ownership of your file. We claim nothing in it.",
      },
      {
        type: "p",
        text: "Indemnity. If a third party makes a claim against us because a file you uploaded breached the promises above — for example, a rights holder says the model infringes their copyright — you agree to reimburse us for the direct loss and reasonable legal costs we actually incur, to the extent the claim results from that breach.",
      },
      {
        type: "p",
        text: "This applies only if we: tell you about the claim promptly after we become aware of it; give you a reasonable opportunity to have a say in how the claim is handled; and take reasonable steps to keep the loss down. It does not cover loss caused by our own acts, omissions, or negligence.",
      },
    ],
  },
  {
    number: "4",
    title: "What we check — and what we don't",
    blocks: [
      {
        type: "p",
        text: "When you order, our review is limited to whether the model can physically be printed and plated — things like wall thickness, fragile spans, trapped volumes, drainage, surface area for plating, and overall plateability.",
      },
      {
        type: "p",
        text: "We don't do intellectual-property clearance. We don't run searches, check licence terms, or verify that you have permission to print what you've uploaded. We rely on your promises in section 3. Separately from that, we won't knowingly print something that's obviously infringing — see section 5.",
      },
      {
        type: "p",
        text: "After payment, when we review your file, we may: accept it and move into production; ask you for a revised file if it needs changes to print or plate well; or decline it and refund you, on any of the grounds in section 10.",
      },
      {
        type: "p",
        text: "We'll do this on a case-by-case basis and we'll talk to you about it. We can decline and refund at any point during the review or revision process — we're not locked in just because we asked for a revision once.",
      },
      {
        type: "p",
        text: "If we ask you for a revised file and don't hear back from you within 14 days, we may cancel the order and refund you in full.",
      },
      {
        type: "p",
        text: "If we decline a file because it looks like an obvious intellectual-property breach (section 5), we'll refund you, but we're not obliged to suggest changes or offer a revision to make an infringing file acceptable.",
      },
    ],
  },
  {
    number: "5",
    title: "Files we won't print, and our takedown process",
    blocks: [
      {
        type: "p",
        text: "We won't knowingly print:",
      },
      {
        type: "ul",
        items: [
          "anything that obviously infringes someone else's intellectual property (for example a recognisable copy of a commercial miniature or character you don't have the rights to); or",
          "anything illegal, including functional weapons or weapon parts, or items that are unlawful to make or possess.",
        ],
      },
      {
        type: "p",
        text: "We may decline any such order at our discretion and refund you for work we haven't yet delivered.",
      },
      {
        type: "p",
        text: "Firearm and weapon files. If you upload a file for a firearm, firearm part, or other prohibited weapon, we will delete it immediately, cancel your order, and we may report it. Possessing or supplying digital blueprints of this kind is a criminal offence in parts of Australia. Please don't send them to us.",
      },
      {
        type: "p",
        text: "Takedown / complaints. If you're a rights holder and you believe a file we've been asked to print infringes your rights, email us at metalmymini@gmail.com with enough detail to identify the work and your rights in it. We'll review it promptly and, where appropriate, decline or stop the job, refuse to deliver an infringing item, and where the order is already in production we may cancel it. We may also stop working with customers who repeatedly upload infringing files.",
      },
    ],
  },
  {
    number: "6",
    title: "Pricing, quotes and turnaround (ETAs)",
    blocks: [
      {
        type: "p",
        text: "All prices are in Australian dollars (AUD).",
      },
      {
        type: "p",
        text: "Prices and ETAs shown on the Site are estimates, not fixed promises. The final price and timeframe depend on your specific file, the finish you choose, and our current workload.",
      },
      {
        type: "ul",
        items: [
          "Any delivery timeframe we give is a good-faith estimate. The clock starts when your file is approved for production, not when you pay. Plating times in particular can vary. If something is going to take materially longer than estimated, we'll let you know.",
          "If, after reviewing your file, we find the price or timeframe needs to change (for example the model is more complex than the quote assumed), we'll contact you with the revised figure before continuing. You can then approve it, or cancel for a full refund. We will never charge you more than you've already paid without your agreement first.",
        ],
      },
    ],
  },
  {
    number: "7",
    title: "Payment",
    blocks: [
      {
        type: "p",
        text: "We take payment through Stripe, our third-party payment processor. By paying, you also agree to Stripe's terms. We don't see or store your full card details — Stripe handles that.",
      },
      {
        type: "p",
        text: "Payment is due upfront, at the time you place your order. We begin reviewing your file once payment clears.",
      },
      {
        type: "p",
        text: "GST. We are not currently registered for GST, so no GST is charged on your order and no amount you pay us includes GST.",
      },
    ],
  },
  {
    number: "8",
    title: "Cancellations",
    blocks: [
      {
        type: "p",
        text: "You can cancel for a full refund at any time before we begin printing. We'll email you when your file has been approved and printing has started — that email is the cutoff. Up to that point, just tell us and we'll refund you in full.",
      },
      {
        type: "p",
        text: "Once printing has begun, we can't accept a cancellation for change of mind, because each item is made to order from your file and your chosen finish and we can't resell it.",
      },
      {
        type: "p",
        text: "This doesn't affect your rights if something goes wrong with the item itself — see section 9.",
      },
    ],
  },
  {
    number: "9",
    title: "Refunds, revisions and your consumer rights",
    blocks: [
      {
        type: "p",
        text: "Revisions. If your file needs changes to print or plate, we'll work through that with you case by case. As noted in section 4, we may decline and refund at any stage rather than keep revising.",
      },
      {
        type: "p",
        text: "Refunds we give:",
      },
      {
        type: "ul",
        items: [
          "Before printing starts: full refund if you cancel (section 8).",
          "At review: if we decline your file, we refund you.",
          "If you don't respond to a revision request within 14 days: we cancel and refund you in full.",
          "If we cancel an order for our own reasons (section 10): we refund you for any work not yet delivered.",
        ],
      },
      {
        type: "p",
        text: "Change of mind: we don't refund change-of-mind once printing has begun, because the work is custom (section 8).",
      },
      {
        type: "p",
        text: "Your guarantees under the Australian Consumer Law — which we can't and don't exclude. Our goods and services come with guarantees that cannot be excluded under the Australian Consumer Law. In plain terms:",
      },
      {
        type: "ul",
        items: [
          "The finished item must be of acceptable quality, match its description, and be reasonably fit for any purpose you told us about.",
          "Our service must be carried out with due care and skill, and within a reasonable time.",
          "If the goods have a major failure — for example the item is significantly different from its description, or is unfit for use and can't easily be made fit — you choose: reject the item and get a refund, or ask for a replacement. You can also choose to keep the item and ask us to compensate you for the drop in its value.",
          "If our service has a major failure, you can end the contract and get a refund for the unused part, or keep the service and ask for compensation for the difference between what you got and what you paid for.",
          "For a minor failure, we can choose the remedy — typically reprinting, re-plating, repairing, or refunding.",
          "In either case you may also be entitled to compensation for any other reasonably foreseeable loss or damage.",
        ],
      },
      {
        type: "p",
        text: "Nothing in these Terms — including the cancellation and refund rules above and the liability limits in section 14 — takes away these rights.",
      },
    ],
  },
  {
    number: "10",
    title: "When we can decline or cancel an order",
    blocks: [
      {
        type: "p",
        text: "We may decline or cancel an order in any of the following situations. Where we do, we'll refund you in full for any part of the order we haven't delivered.",
      },
      {
        type: "ul",
        items: [
          "We don't think the file can be printed or plated to a standard we're willing to ship.",
          "We have an intellectual-property or legality concern under section 5.",
          "The file turns out to be materially different from what the quoted price or timeframe assumed, and you don't accept the revised figure under section 6.",
          "You don't respond to a revision request within 14 days (section 4).",
          "Equipment failure, illness, or a supply problem means we can't fulfil the order within a reasonable time (section 15).",
          "We're required to by law.",
        ],
      },
    ],
  },
  {
    number: "11",
    title: "About the finished item",
    blocks: [
      {
        type: "p",
        text: "Every piece is printed and plated by hand, one at a time. So that you know what you're buying:",
      },
      {
        type: "ul",
        items: [
          "Expect some variation. Colour, surface texture, sheen, and plating thickness vary slightly from piece to piece, even between two prints of the same file. This is normal for the process, not a fault.",
          "Copper changes over time. Copper naturally darkens and develops a patina as it oxidises. How fast depends on handling, humidity, and air quality. This is inherent to the material and is not a defect. If you want to slow it, keep the piece dry, handle it as little as possible, and store it out of direct sunlight. You can polish it back with a standard metal polish, accepting that polishing removes a small amount of plating.",
          "Detail follows your file. We print what you send. We can't add detail that isn't in the model, and very fine features may be softened by the plating layer.",
          "These are display models, not toys. They aren't suitable for children under 3 — they contain small parts and can be a choking hazard. They may have sharp points or edges. They are not food-safe, not dishwasher-safe, and shouldn't be chewed, mouthed, or used with food or drink.",
          "On-screen colours are indicative and won't exactly match the finished piece.",
        ],
      },
      {
        type: "p",
        text: "None of this limits your rights under section 9. If an item is genuinely faulty — poor plating adhesion, breakage, missing detail we should have caught — tell us and we'll sort it out.",
      },
    ],
  },
  {
    number: "12",
    title: "Shipping, delivery and risk",
    blocks: [
      {
        type: "p",
        text: "We ship within Australia and internationally, using a tracked service.",
      },
      {
        type: "p",
        text: "Risk of loss in transit is ours, not yours. If your order is lost or damaged in transit before it reaches you, we'll reprint and reship it, or refund you — your choice where the law gives you one.",
      },
      {
        type: "p",
        text: "Address errors. Please check your delivery address carefully. If a delivery fails or goes astray because of an incorrect or incomplete address you gave us, we'll help you chase it, but any reshipping cost is yours.",
      },
      {
        type: "p",
        text: "International orders. Shipping cost and delivery timeframe vary by destination and are confirmed at checkout or by email before we begin. You are responsible for any customs duties, import taxes, and handling charges applied by your country — these aren't included in the price you pay us, and we can't tell you in advance what they'll be. If a parcel is refused, abandoned, or returned to us because those charges weren't paid, we'll refund you for the item, less our shipping and any return costs.",
      },
      {
        type: "p",
        text: "If we can't reliably ship to your destination, we'll tell you and refund you in full rather than send it and hope.",
      },
    ],
  },
  {
    number: "13",
    title: "Your file: storage, retention and privacy",
    blocks: [
      {
        type: "p",
        text: "Your uploaded file. We use your file only to review, print, and plate your order, under the licence in section 3. We never sell your file, and we don't use it for any other purpose.",
      },
      {
        type: "p",
        text: "Where it's kept. Your file is stored on our own private server in Australia. It isn't kept in a public cloud, and it isn't shared with any outside company. Our Privacy Policy explains who can technically access that server, and on what terms.",
      },
      {
        type: "p",
        text: "Your file stays in Australia. Some of the services we use for payments and website traffic do process data overseas, but your model file is not one of them — it never leaves our server. Our Privacy Policy sets out the detail.",
      },
      {
        type: "p",
        text: "How long we keep it. We delete your uploaded model file at the end of the month after the month your order shipped — so an order that ships in March is cleared at the end of April. We keep it that long only so we can reprint if your order is lost or damaged, and to deal with any payment dispute or warranty claim. You can ask us to delete your file sooner and we'll do so once it's no longer needed for an open order or dispute. If you'd like a copy of a file you sent us, email us and we'll send it back.",
      },
      {
        type: "p",
        text: "Order records. We keep basic order and transaction records (such as what you ordered, when, and what you paid) for as long as the law requires — generally five years for tax record-keeping. Those records don't include your 3D model file.",
      },
      {
        type: "p",
        text: "Photos of finished pieces. When you order, you agree that photos of your finished piece may appear in our gallery, on the Site, in marketing and on social media. If you'd rather we didn't, just tell us — put it in the order notes when you upload your file, or email us at metalmymini@gmail.com, before or after your piece is made. No reason needed, and it doesn't affect your order, your price, or how the piece is made. If something of yours is already published and you want it gone, say so and we'll take it down.",
      },
      {
        type: "p",
        text: "Photos show the finished miniature, not you, and we don't caption them with customer names. If you're printing a model licensed from someone else, please check whether that licence allows promotional use — you're only giving us permission to the extent you're able to.",
      },
      {
        type: "p",
        text: "Privacy. We collect your contact and shipping details and your uploaded file to fulfil your order. How we handle that is set out in our Privacy Policy at metalmymini.com/privacy.",
      },
    ],
  },
  {
    number: "14",
    title: "Limitation of liability",
    blocks: [
      {
        type: "p",
        text: "Subject to section 9 (your non-excludable consumer guarantees), and to the extent the law allows:",
      },
      {
        type: "ul",
        items: [
          "We are not liable for indirect or consequential loss — for example lost profits, lost opportunities, or loss arising from delay.",
          "Our total liability to you for any order is limited to the amount you paid us for that order.",
        ],
      },
      {
        type: "p",
        text: "These limits don't apply to liability we can't limit by law, including liability for death or personal injury caused by our negligence, or for fraud.",
      },
      {
        type: "p",
        text: "None of this limits or excludes your rights under the Australian Consumer Law, including the consumer guarantees in section 9. Where those rights apply, they prevail over this section.",
      },
    ],
  },
  {
    number: "15",
    title: "Things outside our control",
    blocks: [
      {
        type: "p",
        text: "We're not responsible for delays or failures caused by events beyond our reasonable control (for example courier failures, supply shortages, illness, or equipment breakdown). If something like that happens, we'll contact you, and if we can't fulfil your order in a reasonable time you can cancel for a refund of any undelivered work.",
      },
    ],
  },
  {
    number: "16",
    title: "Changes to these Terms",
    blocks: [
      {
        type: "p",
        text: "We may update these Terms. The version that applies to your order is the one published on the Site at the time you place that order. Changes don't apply retroactively to orders already placed.",
      },
    ],
  },
  {
    number: "17",
    title: "Governing law",
    blocks: [
      {
        type: "p",
        text: "These Terms are governed by the laws of Victoria, Australia. You and we submit to the non-exclusive jurisdiction of the courts of Victoria — meaning you can also bring a claim in the courts where you live. This doesn't take away any rights you have under the Australian Consumer Law, or your ability to take a complaint to Consumer Affairs Victoria or the consumer agency in your own state or territory.",
      },
    ],
  },
  {
    number: "18",
    title: "Contact us",
    blocks: [
      {
        type: "p",
        text: "Questions, problems, or takedown notices: metalmymini@gmail.com. If you have an account, you can also follow up on your order through the Site.",
      },
    ],
  },
];
