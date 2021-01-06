import React, { useMemo } from 'react';
import { take } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const MaxDisplayableGridItems = 50;

interface StyleProps {
  flexDirection: 'row' | 'column';
  itemPadding: number;
}

const mainItemWidthPercent = 70;
const mainItemMaxWidth = 1100;

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    mainItem: {
      width: `${mainItemWidthPercent}%`,
      maxWidth: mainItemMaxWidth,
      padding: theme.spacing(3),
      // less padding on bottom since controls will already have a lot
      // TODO: this feels a bit hacky since layout shouldn't know about controls
      paddingBottom: theme.spacing(1),
    },
    itemContainer: {
      flexGrow: 1,
      display: 'flex',
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

// TODO: detect when there's white space on focus mode, and adjust width accordingly
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

  // calculate item container width based on given parent width
  const itemContainerWidth =
    variant === 'focus'
      ? Math.min((width * (100 - mainItemWidthPercent)) / 100, mainItemMaxWidth)
      : width;

  const itemSize = useMemo<number>(
    () => sizeForSquareThatFitInRect(itemContainerWidth, height, displayableItems.length),
    [itemContainerWidth, height, displayableItems],
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
