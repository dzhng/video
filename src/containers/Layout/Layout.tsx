import React from 'react';
import { styled } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import MenuBar from '~/components/MenuBar/MenuBar';

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
}));

export default function Layout({ children }: { children: React.ReactChild }) {
  const router = useRouter();

  // make special exception for room page to not wrap anything
  // this is hacky, but for now we only have 1 path that needs this
  const showLayout = router.pathname !== '/call/[slug]/room';

  return showLayout ? (
    <>
      <MenuBar />
      <Container>{children}</Container>
    </>
  ) : (
    <>children</>
  );
}
