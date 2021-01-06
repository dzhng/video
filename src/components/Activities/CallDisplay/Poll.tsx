import React, { useState, useMemo, useCallback } from 'react';
import { get, without, uniq, values, flatten } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Button } from '@material-ui/core';
import {
  RadioButtonUnchecked as UncheckedIcon,
  RadioButtonChecked as CheckedIcon,
} from '@material-ui/icons';
import { PollActivityMetadata } from '~/firebase/schema-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { useAppState } from '~/state';

// key of votes, keyed by userIds, value is array of option votes
const VoteMapKey = 'voteMap';

interface VoteMapType {
  // key is uid, values is array of options
  [uid: string]: string[];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    options: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    option: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: theme.dividerBorder,
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
      cursor: 'pointer',
      transition: theme.transitionTime,

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: theme.shadows[1],
      },
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(2),
      borderTop: theme.dividerBorder,
    },
  }),
);

function PollOption({ option, vote, voted }: { option: string; vote(): void; voted: boolean }) {
  const classes = useStyles();

  return (
    <div className={classes.option} onClick={vote}>
      <Typography variant="h3">{option}</Typography>
      <IconButton size="small">{voted ? <CheckedIcon /> : <UncheckedIcon />}</IconButton>
    </div>
  );
}

export default function PollDisplay() {
  const classes = useStyles();
  const { user } = useAppState();
  const { currentActivity, updateActivity, currentCallData, isHost } = useCallContext();
  const [isShowingResults, setIsShowingResults] = useState(false);

  const metadata = currentActivity?.metadata as PollActivityMetadata | undefined;

  const totalVotes = useMemo<number>(() => {
    const voteMap = (get(currentCallData, VoteMapKey) as VoteMapType) || {};
    return flatten(values(voteMap)).length;
  }, [currentCallData]);

  const votedForOption = useCallback(
    (option: string): boolean => {
      if (!currentCallData || !user) {
        return false;
      }

      const votes = (get(currentCallData, [VoteMapKey, user.uid]) as string[]) || [];
      return votes.includes(option);
    },
    [currentCallData, user],
  );

  const toggleOption = useCallback(
    (option: string) => {
      if (!currentActivity || !user || !currentCallData) {
        return;
      }

      const votes = (get(currentCallData, [VoteMapKey, user.uid]) as string[]) || [];
      if (votes.includes(option)) {
        updateActivity(currentActivity, `${VoteMapKey}.${user.uid}`, without(votes, option));
      } else {
        updateActivity(currentActivity, `${VoteMapKey}.${user.uid}`, uniq([...votes, option]));
      }
    },
    [currentActivity, currentCallData, updateActivity, user],
  );

  return (
    <div className={classes.container}>
      <div className={classes.options}>
        {metadata &&
          metadata.options.map((option, idx) => (
            <PollOption
              key={idx}
              option={option}
              voted={votedForOption(option)}
              vote={() => toggleOption(option)}
            />
          ))}
      </div>

      {isHost && (
        <div className={classes.controls}>
          <Typography variant="h4">
            <b>Total votes:</b> {totalVotes}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setIsShowingResults(true)}>
            Show Results
          </Button>
        </div>
      )}
    </div>
  );
}
