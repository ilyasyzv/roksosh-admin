import { create } from "zustand";

interface useStoreModalStore {
	onClose: () => void;
	onOpen: () => void;
	isOpen: boolean;
}

const useStoreModal = create<useStoreModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));

export default useStoreModal;
