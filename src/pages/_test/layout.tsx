import React from 'react';
import { fill } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useDimensions from 'react-cool-dimensions';
import useHeight from '~/hooks/Video/useHeight/useHeight';
import Layout from '~/components/Video/Layout/Layout';

function LayoutTest() {
  const router = useRouter();
  const pageHeight = useHeight();

  // measure the width and height of LayoutContainer to feed into layout component
  const { ref, width, height } = useDimensions<HTMLDivElement>();

  const numItems = Number(router.query.numItems) || 5;

  // generate random data for now
  const items = fill(Array(numItems), 0).map((_, idx) => ({
    key: String(idx),
    node: <div style={{ width: '100%', height: '100%' }} />,
  }));

  const variant = (router.query.variant as string | undefined) ?? 'grid';

  return (
    <div ref={ref} style={{ height: pageHeight, backgroundColor: '#222' }}>
      <Layout variant={variant as any} width={width} height={height} gridItems={items} />
    </div>
  );
}

// only render on client side b/c of useHeight hook
export default dynamic(() => Promise.resolve(LayoutTest), { ssr: false });
