import React, { useState, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import LocalPreview from './LocalPreview';

export default function CreateCall({ create }: { create(): Promise<boolean> }) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = useCallback(() => {
    if (isCreating) {
      return;
    }

    create();
    setIsCreating(true);
  }, [create, isCreating]);

  useHotkeys(
    'enter',
    (e) => {
      e.preventDefault();
      handleCreate();
    },
    [handleCreate],
  );

  return (
    <LocalPreview
      title="Start call as host"
      helperText="Please check that your camera and mic is enabled, and start the call when you are ready."
      actionText="Start Call"
      disabled={isCreating}
      isSubmitting={isCreating}
      onSubmit={handleCreate}
    />
  );
}
