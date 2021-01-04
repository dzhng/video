import React, { useMemo } from 'react';
import { take } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const MaxDisplayableGridItems = 50;

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignContent: 'center',
    },
    mainItem: {},
    gridItem: {
      overflow: 'hidden',
      padding: (props: { itemPadding: number }) => props.itemPadding + 'px',
    },
  }),
);

// find the right gridItem size to fit in all item given container area
// Took algorithm from: https://stackoverflow.com/a/47337678
// For explaination: https://math.stackexchange.com/a/466248
function sizeForSquareThatFitInRect(width: number, height: number, n: number): number {
  const area = width * height;
  let sw, sh;
  let pw = Math.ceil(Math.sqrt(area * n));
  if (Math.floor((pw * height) / width) * pw < n) {
    sw = height / Math.ceil((pw * height) / width);
  } else {
    sw = width / pw;
  }

  let ph = Math.ceil(Math.sqrt((n * height) / width));
  if (Math.floor((ph * width) / height) * ph < n) {
    sh = width / Math.ceil((width * ph) / height);
  } else {
    sh = height / ph;
  }

  return Math.max(sw, sh);
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

  // use 6% of item size as padding
  const itemPadding = itemSize * 0.06;
  const classes = useStyles({ itemPadding });

  return (
    <div className={classes.container}>
      {variant === 'focus' && mainItem && <div className={classes.mainItem}>{mainItem}</div>}
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
  );
}
