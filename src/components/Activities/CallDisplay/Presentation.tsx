import React, { useState, useEffect, useCallback } from 'react';
import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Collections,
  Presentation,
  PresentationActivityMetadata,
  Activity,
} from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import PresentationContainer from '~/components/Presentation/Presentation';

const CurrentIndexKey = 'currentIndex';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

export const PresentationView = ({
  activity,
  index,
  setIndex,
}: {
  activity?: Activity;
  index?: number;
  setIndex?(index: number): void;
}) => {
  const classes = useStyles();
  const [presentationData, setPresentationData] = useState<Presentation | null>(null);

  useEffect(() => {
    const getPresentation = async (id: string) => {
      const doc = await db.collection(Collections.PRESENTATIONS).doc(id).get();
      if (doc.exists) {
        setPresentationData(doc.data() as Presentation);
      } else {
        setPresentationData(null);
      }
    };

    if (activity) {
      const metadata = activity.metadata as PresentationActivityMetadata;
      // if activity chanegs, make sure to clear data so user isn't stuck viewing older presentation
      setPresentationData(null);
      getPresentation(metadata.presentationId);
    }
  }, [activity]);

  return (
    <div className={classes.container}>
      {presentationData && (
        <PresentationContainer
          showControls
          presentation={presentationData}
          startAt={0}
          index={index}
          setIndex={setIndex}
        />
      )}

      {!presentationData && <CircularProgress />}
    </div>
  );
};

export default function PresentationDisplay() {
  const { currentActivity, updateActivityData, currentActivityData } = useCallContext();
  const currentIndex: number = currentActivityData
    ? (currentActivityData[CurrentIndexKey] as number)
    : 0;

  const handleSetIndex = useCallback(
    (index: number) => {
      if (!currentActivity) {
        return;
      }

      updateActivityData(currentActivity, CurrentIndexKey, index);
    },
    [currentActivity, updateActivityData],
  );

  return (
    <PresentationView activity={currentActivity} index={currentIndex} setIndex={handleSetIndex} />
  );
}
