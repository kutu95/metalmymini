/** Australia Post Postage Assessment Calculator (PAC) helpers. */

/** Default pack: under 250 g, 150 × 100 × 75 mm (PAC uses cm / kg). */
export const DEFAULT_PARCEL = {
  lengthCm: 15,
  widthCm: 10,
  heightCm: 7.5,
  /** Quoted weight — under 250 g. */
  weightKg: 0.24,
} as const;

export const DEFAULT_SERVICE_CODE = "AUS_PARCEL_REGULAR";

export type DomesticParcelQuote = {
  amountCents: number;
  serviceName: string;
  deliveryTime?: string;
  fromPostcode: string;
  toPostcode: string;
  weightKg: number;
  serviceCode: string;
};

function getPacConfig() {
  const apiKey = process.env.AUSPOST_PAC_API_KEY?.trim();
  const baseUrl = (process.env.AUSPOST_PAC_BASE_URL ?? "https://digitalapi.auspost.com.au").replace(
    /\/$/,
    "",
  );
  const fromPostcode = (process.env.FROM_POSTCODE ?? "3101").trim();
  const serviceCode = (process.env.AUSPOST_SERVICE_CODE ?? DEFAULT_SERVICE_CODE).trim();

  if (!apiKey) {
    throw new Error("AUSPOST_PAC_API_KEY is not configured");
  }
  if (!/^\d{4}$/.test(fromPostcode)) {
    throw new Error("FROM_POSTCODE must be a 4-digit Australian postcode");
  }

  return { apiKey, baseUrl, fromPostcode, serviceCode };
}

export function normalizeAuPostcode(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 4) {
    throw new Error("Enter a valid 4-digit Australian postcode");
  }
  return digits;
}

export function estimateParcelWeightKg(_quantity: number) {
  return DEFAULT_PARCEL.weightKg;
}

export function estimateParcelDimensions(_quantity: number) {
  return {
    lengthCm: DEFAULT_PARCEL.lengthCm,
    widthCm: DEFAULT_PARCEL.widthCm,
    heightCm: DEFAULT_PARCEL.heightCm,
  };
}

function dollarsToCents(value: string | number) {
  const amount = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Invalid postage amount from Australia Post");
  }
  return Math.round(amount * 100);
}

type PacCalculateResponse = {
  postage_result?: {
    service?: string;
    delivery_time?: string;
    total_cost?: string | number;
  };
  error?: { errorMessage?: string; message?: string };
};

export async function quoteDomesticParcel(input: {
  toPostcode: string;
  quantity: number;
  serviceCode?: string;
}): Promise<DomesticParcelQuote> {
  const { apiKey, baseUrl, fromPostcode, serviceCode: defaultService } = getPacConfig();
  const toPostcode = normalizeAuPostcode(input.toPostcode);
  const serviceCode = input.serviceCode ?? defaultService;
  const weightKg = estimateParcelWeightKg(input.quantity);
  const dims = estimateParcelDimensions(input.quantity);

  const params = new URLSearchParams({
    from_postcode: fromPostcode,
    to_postcode: toPostcode,
    length: String(dims.lengthCm),
    width: String(dims.widthCm),
    height: String(dims.heightCm),
    weight: String(weightKg),
    service_code: serviceCode,
  });

  const url = `${baseUrl}/postage/parcel/domestic/calculate.json?${params}`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { "AUTH-KEY": apiKey, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "TimeoutError"
        ? "Australia Post quote timed out"
        : "Unable to reach Australia Post";
    throw new Error(message);
  }

  let data: PacCalculateResponse;
  try {
    data = (await response.json()) as PacCalculateResponse;
  } catch {
    throw new Error(`Australia Post returned an invalid response (${response.status})`);
  }

  if (!response.ok) {
    const message =
      data.error?.errorMessage ?? data.error?.message ?? `Australia Post quote failed (${response.status})`;
    throw new Error(message);
  }

  const total = data.postage_result?.total_cost;
  if (total === undefined || total === null) {
    throw new Error("Australia Post did not return a postage cost");
  }

  return {
    amountCents: dollarsToCents(total),
    serviceName: data.postage_result?.service ?? "Parcel Post",
    deliveryTime: data.postage_result?.delivery_time,
    fromPostcode,
    toPostcode,
    weightKg,
    serviceCode,
  };
}
