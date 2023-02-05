import React from 'react';
import Button from '@/components/ui/button';
import { useModal } from '@/components/modal-views/context';

export default function Preview() {
  const { openModal } = useModal();

  return (
    <div className="flex items-center justify-between">
      <Button
        size="small"
        variant="ghost"
        onClick={() => openModal('NFT_PREVIEW')}
        className="border-white text-white"
        type="button"
      >
        PREVIEW
      </Button>
    </div>
  );
}
