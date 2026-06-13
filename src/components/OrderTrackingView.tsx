import { Card, StatusBadge } from "@/components/ui";
import { PAYMENT_STATUS_LABELS, PRODUCTION_STATUS_LABELS, TRACKING_PIPELINE } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { ProductionStatus } from "@/generated/prisma/client";

export type OrderTrackingData = {
  orderNumber: string;
  paymentStatus: keyof typeof PAYMENT_STATUS_LABELS;
  productionStatus: ProductionStatus;
  trackingNumber?: string | null;
  customerNotes?: string | null;
  statusHistory?: Array<{ status: string; note?: string | null; createdAt: string }>;
};

const ATTENTION_STATUSES: ProductionStatus[] = [
  "awaiting_customer_action",
  "additional_payment_required",
  "rejected",
  "refunded",
  "cancelled",
];

function pipelineIndex(status: ProductionStatus): number {
  return (TRACKING_PIPELINE as readonly ProductionStatus[]).indexOf(status);
}

export function OrderTrackingView({ order }: { order: OrderTrackingData }) {
  const currentIndex = pipelineIndex(order.productionStatus);
  const needsAttention = ATTENTION_STATUSES.includes(order.productionStatus);
  const history = [...(order.statusHistory ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-stone-500">Order tracking</p>
          <h2 className="mt-1 text-xl font-medium text-stone-100">{order.orderNumber}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={PRODUCTION_STATUS_LABELS[order.productionStatus]} />
          <StatusBadge label={PAYMENT_STATUS_LABELS[order.paymentStatus]} />
        </div>
      </div>

      {needsAttention && (
        <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          This order needs your attention. Check the updates below for details.
        </p>
      )}

      {order.customerNotes && (
        <div className="mt-4 rounded-md border border-copper/25 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-wide text-copper-light">Latest update</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-200">{order.customerNotes}</p>
        </div>
      )}

      {order.trackingNumber && (
        <div className="mt-4 rounded-md border border-copper/20 bg-black/30 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-stone-500">Shipping tracking</p>
          <p className="mt-1 font-medium text-stone-100">{order.trackingNumber}</p>
        </div>
      )}

      {!needsAttention && currentIndex >= 0 && order.productionStatus !== "completed" && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-stone-500">Production progress</p>
          <ol className="mt-4 flex flex-wrap gap-2">
            {TRACKING_PIPELINE.map((step, index) => {
              const isComplete = index < currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <li
                  key={step}
                  className={`rounded-full px-3 py-1 text-xs ${
                    isCurrent
                      ? "border border-copper bg-copper/15 text-copper-light"
                      : isComplete
                        ? "bg-stone-800 text-stone-400"
                        : "border border-stone-800 text-stone-600"
                  }`}
                >
                  {PRODUCTION_STATUS_LABELS[step]}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-sm uppercase tracking-wide text-stone-500">Status updates</h3>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-stone-400">No status updates recorded yet.</p>
        ) : (
          <ol className="mt-4 space-y-0">
            {history.map((entry, index) => (
              <li key={`${entry.createdAt}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
                {index < history.length - 1 && (
                  <span
                    className="absolute left-[7px] top-4 h-full w-px bg-copper/20"
                    aria-hidden
                  />
                )}
                <span
                  className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                    index === 0 ? "border-copper bg-copper" : "border-copper/40 bg-charcoal"
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-stone-100">
                    {PRODUCTION_STATUS_LABELS[entry.status as ProductionStatus] ?? entry.status}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">{formatDateTime(entry.createdAt)}</p>
                  {entry.note && (
                    <p className="mt-2 text-sm leading-relaxed text-stone-400">{entry.note}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Card>
  );
}
