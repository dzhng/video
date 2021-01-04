import React from 'react';
import { take } from 'lodash';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const MaxDisplayableGridItems = 50;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    mainItem: {},
    gridItem: {
      overflow: 'hidden',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[600],
    },
  }),
);

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

export default function VideoLayout({ variant, gridItems, mainItem }: PropTypes) {
  const displayableItems = take(gridItems, MaxDisplayableGridItems);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {variant === 'focus' && mainItem && <div className={classes.mainItem}>{mainItem}</div>}
      {displayableItems.map((item) => (
        <div key={item.key} className={classes.gridItem}>
          {item.node}
        </div>
      ))}
    </div>
  );
}
