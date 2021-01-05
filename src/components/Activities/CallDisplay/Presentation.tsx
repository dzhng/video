import React from 'react';
import useCallContext from '~/hooks/useCallContext/useCallContext';

export default function PresentationDisplay() {
  const { updateActivity } = useCallContext();

  return <div>Presentation Display</div>;
}
