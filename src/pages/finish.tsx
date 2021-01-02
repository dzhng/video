import React from 'react';
import { useRouter } from 'next/router';
import FinishContainer from '~/containers/FinishCall/FinishCall';

export default function FinishCallPage() {
  const router = useRouter();
  const { hostEnded } = router.query;

  return <FinishContainer hostEnded={!!hostEnded} />;
}
