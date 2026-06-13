import { Suspense } from "react";
import { PageHeading } from "@/components/ui";
import { OrderStatusLookup } from "@/components/OrderStatusLookup";
import { getCurrentUser } from "@/lib/auth";

export default async function OrderStatusPage() {
  const user = await getCurrentUser().catch(() => null);
  const isLoggedIn = !!user && user.role === "customer";

  return (
    <div>
      <PageHeading
        title="Track Your Order"
        subtitle={
          isLoggedIn
            ? "Select an order below to view production status and tracking updates."
            : "Enter your order number and email to check production status and tracking updates."
        }
      />
      <Suspense fallback={<p className="text-stone-400">Loading...</p>}>
        <OrderStatusLookup isLoggedIn={isLoggedIn} />
      </Suspense>
    </div>
  );
}
