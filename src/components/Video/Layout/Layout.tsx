import React, { useMemo } from 'react';
import { take } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const MaxDisplayableGridItems = 50;

interface StyleProps {
  flexDirection: 'row' | 'column';
  itemPadding: number;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
    },
    mainItem: {
      width: '70%',
      maxWidth: 1100,
    },
    itemContainer: {
      flexGrow: 1,
      display: 'flex',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      flexDirection: (props: StyleProps) => props.flexDirection,
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'center',
    },
    gridItem: {
      overflow: 'hidden',
      padding: (props: StyleProps) => props.itemPadding + 'px',
    },
  }),
);

// find the right gridItem size to fit in all item given container area
// Took algorithm from: https://math.stackexchange.com/a/2570649
function sizeForSquareThatFitInRect(width: number, height: number, n: number): number {
  const x = width;
  const y = height;

  // catch invalid values to avoid NaN output
  if (n <= 0 || x <= 0 || y <= 0) {
    return 0;
  }

  const ratio = x / y;
  const ncols_float = Math.sqrt(n * ratio);
  const nrows_float = n / ncols_float;

  // Find best option filling the whole height
  let nrows1 = Math.ceil(nrows_float);
  let ncols1 = Math.ceil(n / nrows1);
  while (nrows1 * ratio < ncols1) {
    nrows1++;
    ncols1 = Math.ceil(n / nrows1);
  }
  const cell_size1 = y / nrows1;

  // Find best option filling the whole width
  let ncols2 = Math.ceil(ncols_float);
  let nrows2 = Math.ceil(n / ncols2);
  while (ncols2 < nrows2 * ratio) {
    ncols2++;
    nrows2 = Math.ceil(n / ncols2);
  }
  const cell_size2 = x / ncols2;

  // Find the best values
  if (cell_size1 < cell_size2) {
    return cell_size2;
  } else {
    return cell_size1;
  }
}

interface PropTypes {
  width: number;
  height: number;
  variant: 'grid' | 'focus';
  gridItems: { key: string; node: React.ReactNode }[];

  // only needed when variant is `focus`
  mainItem?: React.ReactNode;
  // if the main item should be displayed at its provided w/h aspect ratio (for stuff like screen sharing or activities)
  mainItemAspectRatio?: number;
}

export default function VideoLayout({ width, height, variant, gridItems, mainItem }: PropTypes) {
  const displayableItems = take(gridItems, MaxDisplayableGridItems);

  const itemSize = useMemo<number>(
    () => sizeForSquareThatFitInRect(width, height, displayableItems.length),
    [width, height, displayableItems],
  );

  const flexDirection = variant === 'grid' ? 'row' : 'column';

  // use 6% of item size as padding
  const itemPadding = itemSize * 0.06;
  const classes = useStyles({ itemPadding, flexDirection });

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
