import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Collections,
  Presentation,
  PresentationActivityMetadata,
  ActivityCallData,
} from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import PresentationContainer from '~/components/Presentation/Presentation';

const CurrentIndexKey = 'currentIndex';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

export default function PresentationDisplay() {
  const classes = useStyles();
  const { call, currentActivity, updateActivity } = useCallContext();
  const [presentationData, setPresentationData] = useState<Presentation | null>(null);

  const currentCallData = useMemo<ActivityCallData | undefined>(() => {
    if (call && currentActivity) {
      return (call.activityData ? call.activityData[currentActivity.id] : {}) as ActivityCallData;
    }
  }, [call, currentActivity]);

  useEffect(() => {
    const getPresentation = async (id: string) => {
      const doc = await db.collection(Collections.PRESENTATIONS).doc(id).get();
      if (doc.exists) {
        setPresentationData(doc.data() as Presentation);
      } else {
        setPresentationData(null);
      }
    };

    if (currentActivity) {
      const metadata = currentActivity.metadata as PresentationActivityMetadata;
      // if activity chanegs, make sure to clear data so user isn't stuck viewing older presentation
      setPresentationData(null);
      getPresentation(metadata.presentationId);
    }
  }, [currentActivity]);

  const currentIndex: number = currentCallData ? (currentCallData[CurrentIndexKey] as number) : 0;

  const handleSetIndex = useCallback(
    (index: number) => {
      if (!currentActivity) {
        return;
      }

      updateActivity(currentActivity, CurrentIndexKey, index);
    },
    [currentActivity, updateActivity],
  );

  return (
    <div className={classes.container}>
      {presentationData && (
        <PresentationContainer
          presentation={presentationData}
          startAt={0}
          index={currentIndex}
          setIndex={handleSetIndex}
        />
      )}

      {!presentationData && <CircularProgress />}
    </div>
  );
}
