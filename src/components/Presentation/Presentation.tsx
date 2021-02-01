import React, { useState, useCallback } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useHotkeys } from 'react-hotkeys-hook';
import { IconButton, Tooltip, Fab } from '@material-ui/core';
import {
  NavigateBefore,
  NavigateNext,
  FullscreenOutlined as ResetZoomIcon,
} from '@material-ui/icons';
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
    fab: {
      position: 'absolute',
      bottom: 40,
      right: theme.spacing(1),
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

  useHotkeys(
    'right',
    (e) => {
      e.preventDefault();
      nextSlide();
    },
    [nextSlide],
  );

  useHotkeys(
    'left',
    (e) => {
      e.preventDefault();
      previousSlide();
    },
    [previousSlide],
  );

  // we want to load all slides at once, so that the ones to be displayed will load in the background. We toggle which slide to display via CSS
  return (
    <div className={classes.container}>
      <TransformWrapper defaultScale={1} reset={{ animationTime: 100 }} pan={{ velocity: false }}>
        {({ resetTransform, scale }: { resetTransform(): void; scale: number }) => (
          <>
            <TransformComponent>
              <Slides
                slides={presentation.slides}
                index={finalIndex}
                resetTransform={resetTransform}
              />
            </TransformComponent>

            {scale !== 1 && (
              <Tooltip title="Reset zoom" placement="top">
                <Fab className={classes.fab} size="small" onClick={resetTransform}>
                  <ResetZoomIcon />
                </Fab>
              </Tooltip>
            )}
          </>
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
