"use client";

import React from "react";

import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you shure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button
          type="button"
          disabled={loading}
          onClick={onClose}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={loading}
          onClick={onConfirm}
          variant="destructive"
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
