"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { FormField, inputClassName, textareaClassName } from "@/components/forms";
import { LEGAL_CHECKOUT_TEXT, SHIPPING_COUNTRY } from "@/lib/constants";
import { formatAud } from "@/lib/format";

type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  priceDisplay: string;
  thumbnailUrl: string | null;
};

export function OrderForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [postcode, setPostcode] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [productId, setProductId] = useState("");
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [shippingLabel, setShippingLabel] = useState("Enter postcode for quote");
  const [quoting, setQuoting] = useState(false);

  const selected = products.find((p) => p.id === productId) ?? null;
  const unitPrice = selected?.priceCents ?? 0;
  const productTotal = unitPrice * quantity;
  const totalPrice = productTotal + (shippingPrice ?? 0);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.products ?? []) as CatalogProduct[];
        setProducts(list);
        if (list[0]) setProductId(list[0].id);
      })
      .catch(() => setError("Unable to load products"));
  }, []);

  useEffect(() => {
    if (!/^\d{4}$/.test(postcode)) {
      setShippingPrice(null);
      setShippingLabel(postcode ? "Enter a valid 4-digit postcode" : "Enter postcode for quote");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setQuoting(true);
      fetch(
        `/api/shipping/quote?postcode=${encodeURIComponent(postcode)}&quantity=${quantity}`,
        { signal: controller.signal },
      )
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) throw new Error(data.error ?? "Unable to quote shipping");
          setShippingPrice(data.shippingPriceCents);
          const eta = data.deliveryTime ? ` · ${data.deliveryTime}` : "";
          setShippingLabel(`${data.serviceName}${eta}`);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          setShippingPrice(null);
          setShippingLabel(err instanceof Error ? err.message : "Unable to quote shipping");
        })
        .finally(() => {
          if (!controller.signal.aborted) setQuoting(false);
        });
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [postcode, quantity]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!productId) {
      setError("Select a product");
      setLoading(false);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("productId", productId);
    formData.set("country", SHIPPING_COUNTRY);
    formData.set("shippingPostcode", postcode);
    formData.set("termsAccepted", formData.get("termsAccepted") ? "true" : "false");
    formData.set("publicGalleryConsentAccepted", "true");
    formData.set("createAccount", createAccount ? "true" : "false");

    try {
      const response = await fetch("/api/orders", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to submit order");

      router.push(`/order/confirm?orderId=${data.orderId}&orderNumber=${data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit order");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-medium text-stone-100">Your model file</h2>
          <FormField label="Upload STL, OBJ, or 3MF" hint="Up to 100 mm in any dimension. Reviewed before production.">
            <input
              name="modelFile"
              type="file"
              required
              accept=".stl,.obj,.3mf"
              className={inputClassName}
            />
          </FormField>
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-stone-100">Finish and quantity</h2>
          {products.length === 0 ? (
            <p className="mt-4 text-sm text-stone-400">No finishes are available right now.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {products.map((product) => {
                const selectedCard = product.id === productId;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setProductId(product.id)}
                    className={`flex gap-4 rounded-lg border p-3 text-left transition ${
                      selectedCard
                        ? "border-copper bg-copper/10"
                        : "border-copper/20 bg-black/20 hover:border-copper/40"
                    }`}
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-copper/20 bg-stone-950">
                      {product.thumbnailUrl ? (
                        <img
                          src={product.thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <span className="block font-medium text-stone-100">{product.name}</span>
                      <span className="mt-1 block text-sm text-stone-400 line-clamp-2">
                        {product.description}
                      </span>
                      <span className="mt-1 block text-sm text-copper-light">{product.priceDisplay}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-4">
            <FormField label="Quantity">
              <input
                name="quantity"
                type="number"
                min={1}
                max={99}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={inputClassName}
              />
            </FormField>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-stone-100">Shipping details</h2>
          <p className="mt-2 text-sm text-stone-400">Australia Only. International shipping coming soon...</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Full name">
              <input name="customerName" required className={inputClassName} />
            </FormField>
            <FormField label="Email">
              <input name="customerEmail" type="email" required className={inputClassName} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Country" hint="Shipping is within Australia only for now.">
                <input
                  name="country"
                  value={SHIPPING_COUNTRY}
                  readOnly
                  className={`${inputClassName} cursor-default text-stone-300`}
                />
              </FormField>
            </div>
            <FormField label="Postcode" hint="Used to calculate Australia Post shipping.">
              <input
                name="shippingPostcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                required
                placeholder="e.g. 3000"
                className={inputClassName}
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Shipping address">
                <textarea name="shippingAddress" required rows={4} className={textareaClassName} />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField
                label="Order notes (optional)"
                hint="Anything I should know — including if you'd rather this piece stayed out of the gallery and marketing."
              >
                <textarea name="customerNotes" rows={3} className={textareaClassName} />
              </FormField>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-stone-100">Account (optional)</h2>
          <label className="mt-4 flex items-center gap-3 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={createAccount}
              onChange={(e) => setCreateAccount(e.target.checked)}
            />
            Create an account to track orders and reorder later
          </label>
          {createAccount && (
            <div className="mt-4">
              <FormField label="Password" hint="Minimum 8 characters">
                <input name="password" type="password" minLength={8} required={createAccount} className={inputClassName} />
              </FormField>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-stone-100">Terms</h2>
          <div className="mt-4 space-y-4 text-sm text-stone-400">
            <p>{LEGAL_CHECKOUT_TEXT.review}</p>
            <p>{LEGAL_CHECKOUT_TEXT.gallery}</p>
            <p>{LEGAL_CHECKOUT_TEXT.contact}</p>
          </div>
          <label className="mt-4 flex items-start gap-3 text-sm text-stone-300">
            <input name="termsAccepted" type="checkbox" required className="mt-1" />
            <span>
              I confirm I am 18 or over, I have the rights to print this file, and I accept the{" "}
              <a href="/terms" className="text-copper-light hover:underline">
                Terms of Service
              </a>
              .
            </span>
          </label>
        </Card>
      </div>

      <div>
        <Card className="sticky top-6">
          <h2 className="text-lg font-medium text-stone-100">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm text-stone-400">
            <div className="flex justify-between">
              <span>{selected?.name ?? "Finish"}</span>
              <span>{selected ? formatAud(unitPrice) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Shipping</span>
              <span className="text-right">
                {quoting
                  ? "Calculating…"
                  : shippingPrice !== null
                    ? formatAud(shippingPrice)
                    : "—"}
              </span>
            </div>
            <p className="text-xs text-stone-500">{shippingLabel}</p>
          </div>
          <div className="mt-4 flex justify-between border-t border-stone-700 pt-4 text-stone-100">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              {selected && shippingPrice !== null ? formatAud(totalPrice) : selected ? formatAud(productTotal) : "—"}
            </span>
          </div>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <Button
            type="submit"
            disabled={loading || !selected || shippingPrice === null || quoting}
            className="mt-6 w-full"
          >
            {loading ? "Submitting..." : "Submit Order"}
          </Button>
          <p className="mt-4 text-xs text-stone-500">
            Payment is taken on submission and includes Australia Post shipping at the quoted rate.
            Your file will be reviewed and you will be contacted if anything needs attention.
          </p>
        </Card>
      </div>
    </form>
  );
}
