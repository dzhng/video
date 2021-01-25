import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Fab, Tooltip } from '@material-ui/core';
import { FullscreenOutlined as ResetZoomIcon } from '@material-ui/icons';
import Slide from './Slide';

const useStyles = makeStyles((theme) =>
  createStyles({
    showSlide: {
      display: 'block',
    },
    hideSlide: {
      display: 'none',
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  }),
);

export default function Slides({
  slides,
  index,
  scale,
  resetTransform,
}: {
  slides: string[];
  index: number;
  scale: number;
  resetTransform(): void;
}) {
  const classes = useStyles();
  // use this to preventing resetting transform on first render, when there's no dom el
  const [isFirstMount, setIsFirstMount] = useState(true);

  // everytime index change, reset transform
  useEffect(() => {
    if (!isFirstMount) {
      resetTransform();
    }
    setIsFirstMount(false);
  }, [index, isFirstMount, resetTransform]);

  return (
    <>
      {slides.map((slide, idx) => (
        <Slide
          key={slide}
          slideUrl={slide}
          className={idx === index ? classes.showSlide : classes.hideSlide}
          priority={idx === index}
        />
      ))}

      {scale !== 1 && (
        <Tooltip title="Reset zoom" placement="top">
          <Fab size="small" onClick={resetTransform}>
            <ResetZoomIcon />
          </Fab>
        </Tooltip>
      )}
    </>
  );
}
