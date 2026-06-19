import { PageHeading } from "@/components/ui";
import { OrderForm } from "@/components/OrderForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Upload Your Mini",
  description:
    "Upload your STL, OBJ, or 3MF and order a custom copper-plated tabletop miniature. Choose cosmetic or heavy-duty copper plating with expert file review.",
  path: "/order",
});

export default function OrderPage() {
  return (
    <div>
      <PageHeading
        title="Upload Your Mini"
        subtitle="Upload your model, choose a copper finish, and submit your order. Each file is reviewed before production begins."
      />
      <OrderForm />
    </div>
  );
}
