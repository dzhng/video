import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
import { Presentation } from '~/firebase/schema-types';
import Slide from './Slide';

interface PropTypes {
  presentation: Presentation;
  startAt: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    controls: {
      backgroundColor: theme.palette.background.default,
      textAlign: 'center',
    },
    pageNumber: {
      fontSize: '16px',
      fontWeight: 'bold',
      verticalAlign: 'middle',
      margin: theme.spacing(1),
    },
    showSlide: {
      display: 'block',
    },
    hideSlide: {
      display: 'none',
    },
  }),
);

export default function PresentationDisplay({ presentation, startAt }: PropTypes) {
  const [index, setIndex] = useState<number>(startAt);
  const classes = useStyles();

  const previousSlide = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index]);

  const nextSlide = useCallback(() => {
    if (index < presentation.slides.length - 1) {
      setIndex(index + 1);
    }
  }, [index, presentation]);

  // we want to load all slides at once, so that the ones to be displayed will load in the background. We toggle which slide to display via CSS
  return (
    <>
      {presentation.slides.map((slide, idx) => (
        <Slide
          key={slide}
          slideUrl={slide}
          className={idx === index ? classes.showSlide : classes.hideSlide}
          priority={idx === index}
        />
      ))}
      <div className={classes.controls}>
        <IconButton size="small" onClick={previousSlide}>
          <NavigateBefore />
        </IconButton>

        <span className={classes.pageNumber}>{index + 1}</span>

        <IconButton size="small" onClick={nextSlide}>
          <NavigateNext />
        </IconButton>
      </div>
    </>
  );
}
