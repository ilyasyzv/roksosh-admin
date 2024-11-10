import React from "react";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import OrderClient from "./components/client";
import { OrderColumn } from "./components/columns";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((order) => order.product.name).join(", "),
    quantity: order.orderItems.map((order) => order.quantity).join(", "),
    totalPrice: formatter.format(
      order.orderItems.reduce(
        (total, item) => total + (Number(item.product.price) * item.quantity),
        0,
      ),
    ),
    isPaid: order.isPaid,
    createdAt: format(new Date(order.createdAt), "MMMM do, yyyy"),
  }));

  return <OrderClient data={formattedOrders} />;
};

export default OrdersPage;
