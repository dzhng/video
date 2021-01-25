import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Presentation } from '~/firebase/schema-types';
import Slides from './Slides';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative', // for absolute position slide elements
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      border: theme.dividerBorder,
      borderRadius: theme.shape.borderRadius,
      overflow: 'hidden',

      '& .react-transform-component,.react-transform-element': {
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
      },
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
  }),
);

interface PropTypes {
  presentation: Presentation;
  startAt: number;
  showControls: boolean;

  // optional overrides for internal index function
  index?: number;
  setIndex?(index: number): void;
}

export default function PresentationDisplay({
  presentation,
  startAt,
  index,
  setIndex,
  showControls,
}: PropTypes) {
  const [_index, _setIndex] = useState<number>(startAt);
  const classes = useStyles();
  const [currentScale, setCurrentScale] = useState<number>(1);

  const handleScaleChange = useCallback((scale: number) => {
    setCurrentScale(scale);
  }, []);

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
      <TransformWrapper
        scale={currentScale}
        onZoomChange={handleScaleChange}
        reset={{ animationTime: 100 }}
        pan={{ velocity: false }}
      >
        {({ resetTransform }: { resetTransform(): void }) => (
          <TransformComponent>
            <Slides
              slides={presentation.slides}
              index={finalIndex}
              scale={currentScale}
              resetTransform={resetTransform}
            />
          </TransformComponent>
        )}
      </TransformWrapper>

      {showControls && (
        <div className={classes.controls}>
          <IconButton size="small" onClick={previousSlide}>
            <NavigateBefore />
          </IconButton>

          <span className={classes.pageNumber}>{finalIndex + 1}</span>

          <IconButton size="small" onClick={nextSlide}>
            <NavigateNext />
          </IconButton>
        </div>
      )}
    </div>
  );
}
