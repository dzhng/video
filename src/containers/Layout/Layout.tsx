import React from 'react';
import { styled } from '@material-ui/core/styles';
import { useAppState } from '~/state';
import MenuBar from '~/components/MenuBar/MenuBar';

const Container = styled('div')({});

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { showLayout, title } = useAppState();

  return showLayout ? (
    <>
      <MenuBar title={title} />
      <Container>{children}</Container>
    </>
  ) : (
    children
  );
}
