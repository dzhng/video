import React, { useMemo } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { take } from 'lodash';
import useDimensions from 'react-cool-dimensions';
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
    itemContainer: (props: StyleProps) => ({
      // need to set to hidden so that dimensions will be calculated correctly
      // (if not set, size will overflow and will be wrong)
      overflow: 'hidden',
      flexGrow: 1,
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
    itemGridContainer: (props: StyleProps) => ({
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

interface PropTypes {
  variant: 'grid' | 'focus';
  gridItems: { key: string; node: React.ReactNode }[];
  mainItem?: React.ReactNode;
}

export default function LayoutItems({ gridItems, mainItem, variant }: PropTypes) {
  // measure the width and height of items area feed into layout component to
  // calculate grid sizes.
  const { ref, width, height } = useDimensions<HTMLDivElement>({ useBorderBoxSize: true });

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
    <div ref={ref} className={classes.itemContainer}>
      {variant === 'focus' && <div className={classes.mainItem}>{mainItem}</div>}
      <div className={classes.itemGridContainer}>
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