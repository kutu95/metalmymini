import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateOrderTotal, extractPostcodeFromAddress, generateOrderNumber, addStatusHistory, orderItemsInclude } from "@/lib/orders";
import { copyStoredModelFile } from "@/lib/storage";
import { SHIPPING_COUNTRY } from "@/lib/constants";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const { id } = await params;
    const sourceOrder = await prisma.order.findFirst({
      where: {
        id,
        OR: [{ userId: user.id }, { customerEmail: user.email }],
      },
      include: orderItemsInclude,
    });

    if (!sourceOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!sourceOrder.productId) {
      return NextResponse.json(
        { error: "Original product is no longer available — place a new order" },
        { status: 400 },
      );
    }

    if (sourceOrder.items.length === 0) {
      return NextResponse.json({ error: "Original order has no model files" }, { status: 400 });
    }

    const postcode =
      sourceOrder.shippingPostcode ?? extractPostcodeFromAddress(sourceOrder.shippingAddress);
    if (!postcode) {
      return NextResponse.json(
        { error: "Original order has no postcode — place a new order with a delivery postcode" },
        { status: 400 },
      );
    }

    const totalMinis = sourceOrder.items.reduce((sum, item) => sum + item.quantity, 0);
    const { product, unitPrice, shippingPrice, totalPrice } = await calculateOrderTotal(
      totalMinis,
      postcode,
      sourceOrder.productId,
    );

    const copiedItems = [];
    for (const [sortOrder, item] of sourceOrder.items.entries()) {
      const copied = await copyStoredModelFile(item.uploadedFile);
      const uploadedFile = await prisma.uploadedFile.create({ data: copied });
      copiedItems.push({
        uploadedFileId: uploadedFile.id,
        quantity: item.quantity,
        sortOrder,
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        customerName: sourceOrder.customerName,
        customerEmail: sourceOrder.customerEmail,
        shippingAddress: sourceOrder.shippingAddress,
        shippingPostcode: postcode,
        country: SHIPPING_COUNTRY,
        productId: product.id,
        productName: product.name,
        quantity: totalMinis,
        unitPrice,
        shippingPrice,
        totalPrice,
        termsAccepted: true,
        publicGalleryConsentAccepted: true,
        paymentStatus: "unpaid",
        productionStatus: "submitted",
        items: { create: copiedItems },
      },
    });

    await addStatusHistory(order.id, "submitted", "Reorder from stored files");

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber, totalPrice });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reorder";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
