"use client";

import React from "react";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./columns";

const OrderClient = ({ data }: { data: OrderColumn[] }) => {
  return (
    <React.Fragment>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </React.Fragment>
  );
};

export default OrderClient;
