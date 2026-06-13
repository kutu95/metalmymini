import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateOrderTotal, generateOrderNumber, addStatusHistory } from "@/lib/orders";

export async function POST(
  request: NextRequest,
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
      include: { uploadedFile: true },
    });

    if (!sourceOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const body = await request.json();
    const productOption = body.productOption ?? sourceOrder.productOption;
    const quantity = Number(body.quantity ?? 1);
    const { unitPrice, totalPrice } = calculateOrderTotal(productOption, quantity);

    const reorderFile = await prisma.uploadedFile.create({
      data: {
        originalFilename: sourceOrder.uploadedFile.originalFilename,
        storedFilename: sourceOrder.uploadedFile.storedFilename,
        fileType: sourceOrder.uploadedFile.fileType,
        fileSize: sourceOrder.uploadedFile.fileSize,
        filePath: sourceOrder.uploadedFile.filePath,
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        customerName: sourceOrder.customerName,
        customerEmail: sourceOrder.customerEmail,
        shippingAddress: sourceOrder.shippingAddress,
        country: sourceOrder.country,
        productOption,
        quantity,
        unitPrice,
        totalPrice,
        uploadedFileId: reorderFile.id,
        termsAccepted: true,
        publicGalleryConsentAccepted: sourceOrder.publicGalleryConsentAccepted,
        paymentStatus: "unpaid",
        productionStatus: "submitted",
      },
    });

    await addStatusHistory(order.id, "submitted", "Reorder from stored file");

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber, totalPrice });
  } catch {
    return NextResponse.json({ error: "Unable to reorder" }, { status: 500 });
  }
}
