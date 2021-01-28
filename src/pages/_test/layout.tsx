import React from 'react';
import { fill } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useHeight from '~/hooks/Video/useHeight/useHeight';
import Layout from '~/components/Video/Layout/Layout';

function LayoutTest() {
  const router = useRouter();
  const pageHeight = useHeight();

  const numItems = Number(router.query.numItems) || 5;

  // generate random data for now
  const items = fill(Array(numItems), 0).map((_, idx) => ({
    key: String(idx),
    node: <div style={{ width: '100%', height: '100%', backgroundColor: '#999' }} />,
  }));

  const variant = (router.query.variant as string | undefined) ?? 'grid';

  return (
    <div style={{ height: pageHeight, backgroundColor: '#222' }}>
      <Layout
        variant={variant as any}
        gridItems={items}
        sideItem={<div></div>}
        mainControls={<div></div>}
        sideControls={<div></div>}
      />
    </div>
  );
}

// only render on client side b/c of useHeight hook
export default dynamic(() => Promise.resolve(LayoutTest), { ssr: false });
