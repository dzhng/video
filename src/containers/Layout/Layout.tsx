import React from 'react';
import { useRouter } from 'next/router';
import MenuBar from '~/components/MenuBar/MenuBar';

export default function Layout({ children }: { children: React.ReactChild }) {
  const router = useRouter();

  // make special exception for room page to not wrap anything
  // this is hacky, but for now we only have 1 path that needs this
  const showLayout = router.pathname !== '/call/[slug]/room';

  return showLayout ? (
    <>
      <MenuBar>{children}</MenuBar>
    </>
  ) : (
    <>children</>
  );
}
