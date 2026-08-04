import { PageHeading } from "@/components/ui";
import { OrderForm } from "@/components/OrderForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Upload Your Mini",
  description:
    "Upload your sculpt (STL, OBJ, or 3MF). I copper-plate custom tabletop minis — cosmetic or heavy-duty finish, and I check every file before I print.",
  path: "/order",
});

export default function OrderPage() {
  return (
    <div>
      <PageHeading
        title="Upload Your Mini"
        subtitle="Send your sculpt, choose a copper finish, and place your order. I review every file before I print."
      />
      <OrderForm />
    </div>
  );
}
