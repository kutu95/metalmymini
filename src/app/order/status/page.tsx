import { PageHeading } from "@/components/ui";
import { OrderStatusLookup } from "@/components/OrderStatusLookup";

export default function OrderStatusPage() {
  return (
    <div>
      <PageHeading
        title="Track Your Order"
        subtitle="Enter your order number and email to check payment and production status."
      />
      <OrderStatusLookup />
    </div>
  );
}
