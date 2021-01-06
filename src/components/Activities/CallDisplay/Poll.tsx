import React, { useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { get, without, uniq, values, flatten } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Button, Tooltip } from '@material-ui/core';
import {
  RadioButtonUnchecked as UncheckedIcon,
  RadioButtonChecked as CheckedIcon,
} from '@material-ui/icons';
import { PollActivityMetadata } from '~/firebase/schema-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { useAppState } from '~/state';

// key of votes, keyed by userIds, value is array of option votes
const VoteMapKey = 'voteMap';
// boolean key indicating if results should be shown (stops voting)
// when this is set to true, the activity is effectively finished
const ShowResultsKey = 'showResults';

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
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: theme.dividerBorder,
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
      transition: theme.transitionTime,
      overflow: 'hidden',

      '& h3,button': {
        // so it shows above progress bar
        zIndex: 10,
      },

      '&.enabled': {
        cursor: 'pointer',
      },
      '&.disabled': {
        backgroundColor: theme.palette.grey[50],
      },
      '&.enabled:hover': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: theme.shadows[1],
      },
    },
    progressBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      backgroundColor: theme.palette.primary.light,
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

function PollOption({
  option,
  vote,
  voted,
  votes,
  maxVotes,
  showVotes,
  disabled,
}: {
  option: string;
  vote(): void;
  voted: boolean;
  votes: number;
  maxVotes: number;
  showVotes: boolean;

  // disabled option cannot vote
  disabled: boolean;
}) {
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.option, disabled ? 'disabled' : 'enabled')}
      onClick={disabled ? undefined : vote}
    >
      <Typography variant="h3">{option}</Typography>
      <IconButton size="small" color={disabled ? 'default' : 'primary'}>
        {voted ? <CheckedIcon /> : <UncheckedIcon />}
      </IconButton>
      <div className={classes.progressBar} style={{ width: `${100 * (votes / maxVotes)}%` }} />
    </div>
  );
}

export default function PollDisplay() {
  const classes = useStyles();
  const { user } = useAppState();
  const { currentActivity, updateActivity, currentCallData, isHost } = useCallContext();

  const metadata = currentActivity?.metadata as PollActivityMetadata | undefined;

  const flattenedVotes = useMemo<string[]>(() => {
    const voteMap = (get(currentCallData, VoteMapKey) as VoteMapType) || {};
    return flatten(values(voteMap));
  }, [currentCallData]);

  const totalVotes = useMemo<number>(() => {
    return flattenedVotes.length;
  }, [flattenedVotes]);

  const votesForOptionMap = useMemo<{ [option: string]: number }>(() => {
    if (!metadata) {
      return {};
    }

    return metadata.options.reduce(
      (value, option) => ({
        ...value,
        [option]: flattenedVotes.filter((opt) => opt === option).length,
      }),
      {},
    );
  }, [metadata, flattenedVotes]);

  // find the maximum number of votes for any option
  const maxVotes = useMemo<number>(() => {
    return Math.max(...values(votesForOptionMap));
  }, [votesForOptionMap]);

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
      if (!currentActivity || !user || !currentCallData || !metadata) {
        return;
      }

      const votes = (get(currentCallData, [VoteMapKey, user.uid]) as string[]) || [];
      if (votes.includes(option)) {
        updateActivity(currentActivity, `${VoteMapKey}.${user.uid}`, without(votes, option));
      } else {
        // if single choice is selectd, make sure to deselect this user from all other options first
        const newVotes = metadata.isMultipleChoice ? uniq([...votes, option]) : [option];
        updateActivity(currentActivity, `${VoteMapKey}.${user.uid}`, newVotes);
      }
    },
    [currentActivity, currentCallData, updateActivity, user, metadata],
  );

  const handleShowResults = useCallback(() => {
    if (!currentActivity) {
      return;
    }

    updateActivity(currentActivity, ShowResultsKey, true);
  }, [currentActivity, updateActivity]);

  const showVotes =
    metadata && currentCallData
      ? (currentCallData[ShowResultsKey] as boolean) || metadata.showResultsRightAway
      : false;

  const shouldDisable = currentCallData ? (currentCallData[ShowResultsKey] as boolean) : true;

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
              votes={votesForOptionMap[option] ?? 0}
              maxVotes={maxVotes}
              showVotes={showVotes}
              disabled={shouldDisable}
            />
          ))}
      </div>

      {isHost && (
        <div className={classes.controls}>
          <Typography variant="h4">
            <b>Total votes:</b> {totalVotes}
          </Typography>
          <Tooltip
            title={shouldDisable ? 'Currently showing results' : 'Stops voting and show results'}
            placement="top"
          >
            {/* add div so tooltip will still work with disabled button */}
            <div>
              <Button
                variant="contained"
                disabled={shouldDisable}
                color="primary"
                onClick={handleShowResults}
              >
                Show Results
              </Button>
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
