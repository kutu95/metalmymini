"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { FormField, inputClassName, textareaClassName } from "@/components/forms";
import { LEGAL_CHECKOUT_TEXT, PRODUCTS } from "@/lib/constants";
import { formatAud } from "@/lib/format";

export function OrderForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [productOption, setProductOption] = useState<"cosmetic_copper" | "heavy_duty_copper">(
    "cosmetic_copper",
  );
  const [quantity, setQuantity] = useState(1);
  const [createAccount, setCreateAccount] = useState(false);

  const unitPrice = PRODUCTS[productOption].priceCents;
  const totalPrice = unitPrice * quantity;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("productOption", productOption);
    formData.set("termsAccepted", formData.get("termsAccepted") ? "true" : "false");
    formData.set("publicGalleryConsentAccepted", formData.get("galleryConsent") ? "true" : "false");
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
          <div className="mt-4 space-y-3">
            {Object.values(PRODUCTS).map((product) => (
              <label
                key={product.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                  productOption === product.id ? "border-copper bg-copper/10" : "border-stone-700"
                }`}
              >
                <input
                  type="radio"
                  name="productOptionChoice"
                  checked={productOption === product.id}
                  onChange={() => setProductOption(product.id)}
                />
                <span>
                  <span className="block font-medium text-stone-100">{product.name}</span>
                  <span className="block text-sm text-stone-400">{product.description}</span>
                  <span className="mt-1 block text-sm text-copper-light">{product.priceDisplay}</span>
                </span>
              </label>
            ))}
          </div>
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
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Full name">
              <input name="customerName" required className={inputClassName} />
            </FormField>
            <FormField label="Email">
              <input name="customerEmail" type="email" required className={inputClassName} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Country">
                <input name="country" required className={inputClassName} />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField label="Shipping address">
                <textarea name="shippingAddress" required rows={4} className={textareaClassName} />
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
            I understand my file will be manually reviewed after payment and accept the order terms.
          </label>
          <label className="mt-3 flex items-start gap-3 text-sm text-stone-300">
            <input name="galleryConsent" type="checkbox" className="mt-1" />
            I agree completed work may appear in the public gallery and marketing.
          </label>
        </Card>
      </div>

      <div>
        <Card className="sticky top-6">
          <h2 className="text-lg font-medium text-stone-100">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm text-stone-400">
            <div className="flex justify-between">
              <span>{PRODUCTS[productOption].name}</span>
              <span>{formatAud(unitPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Calculated separately</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-stone-700 pt-4 text-stone-100">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium">{formatAud(totalPrice)}</span>
          </div>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loading} className="mt-6 w-full">
            {loading ? "Submitting..." : "Submit Order"}
          </Button>
          <p className="mt-4 text-xs text-stone-500">
            Payment is taken on submission. Your file will be reviewed and you will be contacted if anything needs attention.
          </p>
        </Card>
      </div>
    </form>
  );
}
