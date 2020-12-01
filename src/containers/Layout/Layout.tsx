import React from 'react';
import { Grid } from '@material-ui/core';
import useLayout from '~/hooks/useLayout/useLayout';
import MenuBar from '~/components/MenuBar/MenuBar';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { showLayout } = useLayout();

  return showLayout ? (
    <>
      <MenuBar />
      <Grid container justify="center">
        {children}
      </Grid>
    </>
  ) : (
    children
  );
}
