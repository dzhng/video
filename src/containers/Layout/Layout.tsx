import React from 'react';
import { styled } from '@material-ui/core/styles';
import MenuBar from '~/components/MenuBar/MenuBar';

const Container = styled('div')({});

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <MenuBar />
      <Container>{children}</Container>
    </>
  );
}
