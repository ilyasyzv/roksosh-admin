"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
	children?: React.ReactNode;
	title: string;
	description?: string;
	isOpen: boolean;
	onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
	children,
	title,
	description,
	isOpen,
	onClose,
}) => {
	const onCloseModal = (open: boolean) => {
		if (!open && onClose) {
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onCloseModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div>{children}</div>
			</DialogContent>
		</Dialog>
	);
};

export default Modal;
