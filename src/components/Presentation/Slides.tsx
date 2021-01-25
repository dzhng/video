import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Slide from './Slide';

const useStyles = makeStyles(() =>
  createStyles({
    showSlide: {
      display: 'block',
    },
    hideSlide: {
      display: 'none',
    },
  }),
);

export default function Slides({
  slides,
  index,
  resetTransform,
}: {
  slides: string[];
  index: number;
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
    </>
  );
}
