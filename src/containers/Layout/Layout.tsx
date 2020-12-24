import React from 'react';
import { useRouter } from 'next/router';
import MenuBar from '~/components/MenuBar/MenuBar';

export default function Layout({ children }: { children: JSX.Element }): JSX.Element {
  const router = useRouter();

  // make special exception for room page to not wrap anything
  // this is hacky, but for now we only have 2 path that needs this
  const showLayout = !['/call/[slug]/room', '/login'].includes(router.pathname);

  return showLayout ? <MenuBar>{children}</MenuBar> : children;
}
