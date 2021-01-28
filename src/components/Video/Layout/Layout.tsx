import React, { useMemo } from 'react';
import { take } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { sizeForSquareThatFitInRect } from './utils';

const MaxDisplayableGridItems = 50;

interface StyleProps {
  variant: 'grid' | 'focus';
  isPortrait: boolean;
  itemPadding: number;
}

const mainItemWidthPercent = 70;
const mainItemHeightPercent = 60;
const mainItemMaxWidth = 1100;

const useStyles = makeStyles((theme) =>
  createStyles({
    container: (props: StyleProps) => ({
      display: 'flex',
      flexDirection: props.isPortrait ? 'column' : 'row',
      alignItems: 'stretch',
      width: '100%',
    }),
    mainItem: (props: StyleProps) => ({
      width: props.isPortrait ? '100%' : `${mainItemWidthPercent}%`,
      maxWidth: props.isPortrait ? '100%' : mainItemMaxWidth,
      height: props.isPortrait ? `${mainItemHeightPercent}%` : '100%',
      padding: theme.spacing(1),
      display: 'flex', // make it easier to align children
    }),
    itemContainer: (props: StyleProps) => ({
      flexGrow: 1,
      display: 'flex',
      flexDirection: props.variant === 'grid' ? 'row' : 'column',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'center',
      // just in case layout algorithm goes wrong
      overflow: 'hidden',
    }),
    gridItem: (props: StyleProps) => ({
      padding: props.itemPadding + 'px',
      display: 'flex', // make it easier to align children
    }),
  }),
);

// TODO: detect when there's white space on focus mode, and adjust width accordingly
interface PropTypes {
  width: number;
  height: number;
  variant: 'grid' | 'focus';
  gridItems: { key: string; node: React.ReactNode }[];
  drawer: React.ReactNode;

  // only needed when variant is `focus`
  mainItem?: React.ReactNode;
  // if the main item should be displayed at its provided w/h aspect ratio (for stuff like screen sharing or activities)
  mainItemAspectRatio?: number;
}

export default function VideoLayout({
  width,
  height,
  variant,
  gridItems,
  mainItem,
  drawer,
}: PropTypes) {
  const displayableItems = take(gridItems, MaxDisplayableGridItems);
  const isPortrait = height > width;

  const itemSize = useMemo<number>(() => {
    // calculate item container width based on given parent width
    const itemContainerWidth =
      variant === 'focus' && !isPortrait
        ? Math.min((width * (100 - mainItemWidthPercent)) / 100, mainItemMaxWidth)
        : width;

    const itemContainerHeight =
      variant === 'focus' && isPortrait ? height * ((100 - mainItemHeightPercent) / 100) : height;

    return sizeForSquareThatFitInRect(
      itemContainerWidth,
      itemContainerHeight,
      displayableItems.length,
    );
  }, [variant, isPortrait, width, height, displayableItems]);

  // use 5% of item size as padding, or reasonable max
  const itemPadding = Math.min(itemSize * 0.05, 8);
  const classes = useStyles({ itemPadding, variant, isPortrait });

  return (
    <div className={classes.container}>
      {variant === 'focus' && <div className={classes.mainItem}>{mainItem}</div>}
      <div className={classes.itemContainer}>
        {displayableItems.map((item) => (
          <div
            key={item.key}
            className={classes.gridItem}
            style={{ width: itemSize, height: itemSize }}
          >
            {item.node}
          </div>
        ))}
      </div>
    </div>
  );
}
