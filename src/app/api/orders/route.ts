import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { saveModelFile } from "@/lib/storage";
import { addStatusHistory, calculateOrderTotal, generateOrderNumber } from "@/lib/orders";
import { orderSchema, orderStatusLookupSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber");
  const email = request.nextUrl.searchParams.get("email");

  if (orderNumber && email) {
    const parsed = orderStatusLookupSchema.safeParse({ orderNumber, email });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid lookup details" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { orderNumber: parsed.data.orderNumber, customerEmail: parsed.data.email },
      include: {
        uploadedFile: true,
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where:
      user.role === "admin"
        ? undefined
        : { OR: [{ userId: user.id }, { customerEmail: user.email }] },
    include: { uploadedFile: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("modelFile");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Model file is required" }, { status: 400 });
    }

    const raw = {
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      shippingAddress: String(formData.get("shippingAddress") ?? ""),
      country: String(formData.get("country") ?? ""),
      productOption: String(formData.get("productOption") ?? ""),
      quantity: formData.get("quantity"),
      termsAccepted: formData.get("termsAccepted") === "true",
      publicGalleryConsentAccepted: formData.get("publicGalleryConsentAccepted") === "true",
      createAccount: formData.get("createAccount") === "true",
      password: String(formData.get("password") ?? ""),
    };

    const parsed = orderSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    let userId = currentUser?.id ?? null;

    if (parsed.data.createAccount && parsed.data.password) {
      const existing = await prisma.user.findUnique({
        where: { email: parsed.data.customerEmail },
      });
      if (existing) {
        return NextResponse.json({ error: "Account already exists for this email" }, { status: 409 });
      }
      const passwordHash = await hashPassword(parsed.data.password);
      const user = await prisma.user.create({
        data: {
          email: parsed.data.customerEmail,
          name: parsed.data.customerName,
          passwordHash,
          role: "customer",
        },
      });
      userId = user.id;
    }

    const savedFile = await saveModelFile(file);
    const uploadedFile = await prisma.uploadedFile.create({ data: savedFile });
    const { unitPrice, totalPrice } = calculateOrderTotal(parsed.data.productOption, parsed.data.quantity);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        customerName: parsed.data.customerName,
        customerEmail: parsed.data.customerEmail,
        shippingAddress: parsed.data.shippingAddress,
        country: parsed.data.country,
        productOption: parsed.data.productOption,
        quantity: parsed.data.quantity,
        unitPrice,
        totalPrice,
        uploadedFileId: uploadedFile.id,
        termsAccepted: parsed.data.termsAccepted,
        publicGalleryConsentAccepted: parsed.data.publicGalleryConsentAccepted,
        paymentStatus: "unpaid",
        productionStatus: "submitted",
      },
    });

    await addStatusHistory(order.id, "submitted", "Order submitted");

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalPrice,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
