import React from 'react';
import { useRouter } from 'next/router';

// view call summary from call id
export default function SummaryPage() {
  const router = useRouter();

  const callId = String(router.query.slug);

  return null;
}
