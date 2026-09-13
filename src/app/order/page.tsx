import { Card, PageHeading } from "@/components/ui";
import { OrderForm } from "@/components/OrderForm";
import { EmailSignupForm } from "@/components/EmailSignupForm";
import { createPageMetadata } from "@/lib/seo";
import { getOrderPageSettings } from "@/lib/site-settings";

export const metadata = createPageMetadata({
  title: "Upload Your Mini",
  description:
    "Upload your STL, OBJ, or 3MF. I print it in resin and plate it in real copper — Display Copper.",
  path: "/order",
});

export default async function OrderPage() {
  const settings = await getOrderPageSettings();

  if (settings.orderingPaused) {
    return (
      <div>
        <PageHeading
          title="Ordering paused"
          subtitle="I’m not taking new uploads at the moment. Leave your email and I’ll let you know when it opens again."
        />
        <Card className="max-w-xl">
          <p className="whitespace-pre-wrap text-stone-300">{settings.orderingPausedMessage}</p>
          <div className="mt-6">
            <EmailSignupForm
              source="order_waitlist"
              buttonLabel="Email me when ordering resumes"
              successDetail="I’ll email you when I’m taking orders again."
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeading
        title="Upload Your Mini"
        subtitle="Upload your model and submit. I review every file before anything is printed."
      />
      {settings.bannerEnabled && settings.bannerMessage.trim() ? (
        <div
          className="mb-8 rounded-xl border border-copper/40 bg-copper/10 px-5 py-4"
          role="status"
        >
          <p className="whitespace-pre-wrap text-stone-100">{settings.bannerMessage}</p>
        </div>
      ) : null}
      <OrderForm />
    </div>
  );
}
