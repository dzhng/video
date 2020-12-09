import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Presentation } from '~/firebase/schema-types';
import Slide from './Slide';

interface PropTypes {
  presentation: Presentation;
  startAt: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imageContainer: {
      position: 'relative',
      backgroundColor: theme.palette.grey[900],

      // trick to lock this component in 4/3 aspect ratio
      width: '100%',
      height: 0,
      paddingBottom: '75%',
    },
  }),
);

export default function PresentationDisplay({ presentation, startAt }: PropTypes) {
  const classes = useStyles();

  const previewImage = presentation.slides[startAt];

  return <Slide slideUrl={previewImage} />;
}
