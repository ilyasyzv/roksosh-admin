"use client";

import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import type { BillboardColumn } from "./columns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert-modal";

const CellActions = ({ data }: { data: BillboardColumn }) => {
	const router = useRouter();
	const params = useParams();
	const [loading, setLoading] = React.useState(false);
	const [open, setOpen] = React.useState(false);

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success("Billboard Id copied.");
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
			router.refresh();
			toast.success("Billboard deleted.");
		} catch (error) {
			toast.error(
				"Make shure you removed all categories using this billboard first.",
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<React.Fragment>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className="mr-2 w-4" />
						Copy Id
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							router.push(`/${params.storeId}/billboards/${data.id}`)
						}
					>
						<Edit className="mr-2 w-4" />
						Update
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="mr-2 w-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</React.Fragment>
	);
};

export default CellActions;
