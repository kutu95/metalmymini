import { PageHeading } from "@/components/ui";
import { OrderForm } from "@/components/OrderForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Upload Your Mini",
  description:
    "Upload your STL, OBJ, or 3MF. I print it in resin and plate it in real copper — Display Copper.",
  path: "/order",
});

export default function OrderPage() {
  return (
    <div>
      <PageHeading
        title="Upload Your Mini"
        subtitle="Upload your model and submit. I review every file before anything is printed."
      />
      <OrderForm />
    </div>
  );
}
