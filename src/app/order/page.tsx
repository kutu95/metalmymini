import { PageHeading } from "@/components/ui";
import { OrderForm } from "@/components/OrderForm";

export default function OrderPage() {
  return (
    <div>
      <PageHeading
        title="Commission Your Mini"
        subtitle="Send me your model, choose a copper finish, and submit your commission. I review every file personally before production begins."
      />
      <OrderForm />
    </div>
  );
}
