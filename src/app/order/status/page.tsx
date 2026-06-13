import { Suspense } from "react";
import { PageHeading } from "@/components/ui";
import { OrderStatusLookup } from "@/components/OrderStatusLookup";
import { getCurrentUser } from "@/lib/auth";

export default async function OrderStatusPage() {
  const user = await getCurrentUser().catch(() => null);
  const isCustomer = user && user.role !== "admin";

  return (
    <div>
      <PageHeading
        title="Track Your Order"
        subtitle={
          isCustomer
            ? "Your commissions are listed below — click one to see its current status."
            : "Enter your order number and email to check payment and production status."
        }
      />
      <Suspense
        fallback={
          <p className="text-stone-400">Loading...</p>
        }
      >
        <OrderStatusLookup />
      </Suspense>
    </div>
  );
}
