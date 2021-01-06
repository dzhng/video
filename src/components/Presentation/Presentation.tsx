import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
import { Presentation } from '~/firebase/schema-types';
import Slide from './Slide';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      border: theme.dividerBorder,
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',
    },
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

interface PropTypes {
  presentation: Presentation;
  startAt: number;

  // optional overrides for internal index function
  index?: number;
  setIndex?(index: number): void;
}

export default function PresentationDisplay({ presentation, startAt, index, setIndex }: PropTypes) {
  const [_index, _setIndex] = useState<number>(startAt);
  const classes = useStyles();

  const finalSetIndex = setIndex ? setIndex : _setIndex;
  const finalIndex = typeof index === 'number' ? index : _index;

  const previousSlide = useCallback(() => {
    if (finalIndex > 0) {
      finalSetIndex(finalIndex - 1);
    }
  }, [finalIndex, finalSetIndex]);

  const nextSlide = useCallback(() => {
    if (finalIndex < presentation.slides.length - 1) {
      finalSetIndex(finalIndex + 1);
    }
  }, [finalIndex, finalSetIndex, presentation]);

  // we want to load all slides at once, so that the ones to be displayed will load in the background. We toggle which slide to display via CSS
  return (
    <div className={classes.container}>
      {presentation.slides.map((slide, idx) => (
        <Slide
          key={slide}
          slideUrl={slide}
          className={idx === finalIndex ? classes.showSlide : classes.hideSlide}
          priority={idx === finalIndex}
        />
      ))}
      <div className={classes.controls}>
        <IconButton size="small" onClick={previousSlide}>
          <NavigateBefore />
        </IconButton>

        <span className={classes.pageNumber}>{finalIndex + 1}</span>

        <IconButton size="small" onClick={nextSlide}>
          <NavigateNext />
        </IconButton>
      </div>
    </div>
  );
}
