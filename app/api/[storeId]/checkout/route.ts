import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

type Product = {
  id: string;
  count: number;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "3600",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  const body = await req.json();
  const products = body.products;

  if (!products || products.length === 0) {
      return new NextResponse("Product data is required", { status: 400 });
  }

  const productIds = products.map((product: Product) => product.id);

  const fetchedProducts = await prismadb.product.findMany({
      where: {
          id: {
              in: productIds,
          },
      },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  fetchedProducts.forEach((product) => {
      const productDetails = products.find((p: Product) => p.id === product.id);
      const quantity = productDetails ? productDetails.count : 1;

      if (product.price == null) {
          throw new Error(`Price for product ${product.name} is missing`);
      }

      line_items.push({
          quantity,
          price_data: {
              currency: "KGS",
              product_data: {
                  name: product.name,
              },
              unit_amount: Number(product.price) * 100,
          },
      });
  });

  const order = await prismadb.order.create({
      data: {
          storeId: params.storeId,
          isPaid: false,
          orderItems: {
              create: products.map((product: Product) => ({
                  product: {
                      connect: {
                          id: product.id,
                      },
                  },
                  quantity: product.count, // Store quantity in order items
              })),
          },
      },
  });

  const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
          enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
          orderId: order.id,
      },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}

