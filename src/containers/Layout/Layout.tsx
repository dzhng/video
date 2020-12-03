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
