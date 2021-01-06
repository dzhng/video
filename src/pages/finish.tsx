import React from 'react';
import { useRouter } from 'next/router';
import FinishContainer from '~/containers/FinishCall/FinishCall';

export default function FinishCallPage() {
  const router = useRouter();
  const { hostEnded, fromHref } = router.query;

  return (
    <FinishContainer
      hostEnded={!!hostEnded}
      fromHref={fromHref && decodeURIComponent(fromHref as string)}
    />
  );
}
