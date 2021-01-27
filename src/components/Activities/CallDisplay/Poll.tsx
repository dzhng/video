import React, { useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { get, without, uniq, keys, flatten, mapValues, values } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Button, Tooltip } from '@material-ui/core';
import {
  RadioButtonUnchecked as UncheckedIcon,
  RadioButtonChecked as CheckedIcon,
} from '@material-ui/icons';
import type { PollActivityMetadata, Activity } from '~/firebase/schema-types';
import type { CallDataTypes, ActivityType } from '~/firebase/rtdb-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { useAppState } from '~/state';

// key of votes, keyed by userIds, value is array of option votes
const VoteMapKey = 'voteMap';
// boolean key indicating if results should be shown (stops voting)
const FinishKey = 'isFinished';

interface VoteMapType {
  // key is uid, values is array of options
  [uid: string]: string[];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
    },
    options: {
      flexGrow: 1,
      padding: theme.spacing(2),
      overflowY: 'auto',
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
    votes: {
      display: 'inline-block',
      height: '1.15rem',
      minWidth: '1.15rem',
      lineHeight: '1.15rem',
      borderRadius: '0.5rem',
      backgroundColor: theme.palette.primary.dark,
      color: 'white',
      textAlign: 'center',
    },
    progressBar: (props: { voted?: boolean }) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      backgroundColor: props.voted ? theme.palette.primary.light + '50' : theme.palette.grey[300],
    }),
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
  votes: string[];
  maxVotes: number;
  showVotes: boolean;

  // disabled option cannot vote
  disabled: boolean;
}) {
  const classes = useStyles({ voted });

  return (
    <div
      className={clsx(classes.option, disabled ? 'disabled' : 'enabled')}
      onClick={disabled ? undefined : vote}
    >
      <Typography variant="h3">
        {option}{' '}
        {showVotes && votes.length > 0 && (
          <Tooltip title={`${votes.length} participants voted for this option`} placement="top">
            <span className={classes.votes}>{votes.length}</span>
          </Tooltip>
        )}
      </Typography>
      <IconButton size="small" color={disabled && !voted ? 'default' : 'primary'}>
        {voted ? <CheckedIcon /> : <UncheckedIcon />}
      </IconButton>
      {showVotes && votes.length > 0 && (
        <div
          className={classes.progressBar}
          style={{ width: `${100 * (votes.length / maxVotes)}%` }}
        />
      )}
    </div>
  );
}

export function PollView({
  activity,
  data,
  updateData,
  isHost,
}: {
  activity?: Activity;
  data?: ActivityType;
  updateData?(activity: Activity, path: string | null, value: CallDataTypes): void;
  isHost: boolean;
}) {
  const classes = useStyles({});
  const { user } = useAppState();

  const metadata = activity?.metadata as PollActivityMetadata | undefined;

  // creates an array of tuples in form of [userId, votedOption]
  const flattenedVotes = useMemo(() => {
    const voteMap = (get(data, VoteMapKey) as VoteMapType) || {};
    const tuples = flatten(keys(voteMap).map((uid) => voteMap[uid].map((option) => [uid, option])));
    return tuples;
  }, [data]);

  const totalVotes = useMemo<number>(() => {
    return flattenedVotes.length;
  }, [flattenedVotes]);

  const votesForOptionMap = useMemo<{ [option: string]: string[] }>(() => {
    if (!metadata) {
      return {};
    }

    return metadata.options.reduce(
      (value, option) => ({
        ...value,
        [option]: flattenedVotes.filter(([_, opt]) => opt === option).map(([uid]) => uid),
      }),
      {},
    );
  }, [metadata, flattenedVotes]);

  // find the maximum number of votes for any option
  const maxVotes = useMemo<number>(() => {
    return Math.max(...values(mapValues(votesForOptionMap, (uids) => uids.length)));
  }, [votesForOptionMap]);

  const votedForOption = useCallback(
    (option: string): boolean => {
      if (!data || !user) {
        return false;
      }

      const votes = (get(data, [VoteMapKey, user.uid]) as string[]) || [];
      return votes.includes(option);
    },
    [data, user],
  );

  const toggleOption = useCallback(
    (option: string) => {
      if (!activity || !user || !metadata) {
        return;
      }

      const votes = (get(data, [VoteMapKey, user.uid]) as string[]) || [];
      if (votes.includes(option)) {
        updateData?.(activity, `${VoteMapKey}.${user.uid}`, without(votes, option));
      } else {
        // if single choice is selectd, make sure to deselect this user from all other options first
        const newVotes = metadata.isMultipleChoice ? uniq([...votes, option]) : [option];
        updateData?.(activity, `${VoteMapKey}.${user.uid}`, newVotes);
      }
    },
    [activity, data, updateData, user, metadata],
  );

  const handleFinish = useCallback(() => {
    if (!activity) {
      return;
    }

    updateData?.(activity, FinishKey, true);
  }, [activity, updateData]);

  const showVotes =
    metadata && data ? (data[FinishKey] as boolean) || metadata.showResultsRightAway : false;

  const shouldDisable = data ? (data[FinishKey] as boolean) : false;

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
              votes={votesForOptionMap[option] ?? []}
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
                onClick={handleFinish}
              >
                Finish Voting
              </Button>
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default function PollDisplay() {
  const { currentActivity, updateActivityData, currentActivityData, isHost } = useCallContext();

  return (
    <PollView
      activity={currentActivity}
      data={currentActivityData}
      updateData={updateActivityData}
      isHost={isHost}
    />
  );
}
