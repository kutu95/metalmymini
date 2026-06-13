import { PageHeading } from "@/components/ui";
import { OrderForm } from "@/components/OrderForm";

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
