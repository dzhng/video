import React, { useMemo, useCallback } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Card, TextField, Button, Tooltip } from '@material-ui/core';
import { QuestionsActivityMetadata } from '~/firebase/schema-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import { useAppState } from '~/state';

// index of current question shown
const CurrentIndexKey = 'currentIndex';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100%',
      display: 'flex',
      backgroundColor: 'white',
      flexDirection: 'column',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
      overflowY: 'auto',
    },
    questionCard: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),

      // important since it allows text to wrap on new lines set in question data
      whiteSpace: 'pre-wrap',
    },
    controls: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(2),
      borderTop: theme.dividerBorder,

      '& button': {
        marginLeft: theme.spacing(1),
      },
      '& h4': {
        flexGrow: 1,
      },
    },
  }),
);

function LoadingState() {
  const classes = useStyles();
  return (
    <div
      className={classes.container}
      style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}
    >
      <span>Loading...</span>
    </div>
  );
}

export default function QuestionsDisplay() {
  const classes = useStyles();
  const { user } = useAppState();
  const { currentActivity, updateActivity, currentCallData, isHost } = useCallContext();

  const metadata = currentActivity?.metadata as QuestionsActivityMetadata | undefined;
  const currentIndex = useMemo<number>(
    () => (currentCallData ? (currentCallData[CurrentIndexKey] as number) ?? 0 : 0),
    [currentCallData],
  );

  const currentQuestion = useMemo<string | undefined>(
    () => (metadata ? metadata.questions[currentIndex] : undefined),
    [currentIndex, metadata],
  );

  const handleNextQuestion = useCallback(() => {
    if (!metadata || !currentActivity || currentIndex >= metadata.questions.length - 1) {
      return;
    }

    updateActivity(currentActivity, CurrentIndexKey, currentIndex + 1);
  }, [metadata, currentActivity, currentIndex, updateActivity]);

  const handlePrevQuestion = useCallback(() => {
    if (!metadata || !currentActivity || currentIndex <= 0) {
      return;
    }

    updateActivity(currentActivity, CurrentIndexKey, currentIndex - 1);
  }, [metadata, currentActivity, currentIndex, updateActivity]);

  if (metadata === undefined || currentQuestion === undefined) {
    return <LoadingState />;
  }

  const isLastQuestion = currentIndex === metadata.questions.length - 1;

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Card className={classes.questionCard}>
          <Typography variant="h1">{currentQuestion}</Typography>
        </Card>

        <TextField
          fullWidth
          multiline
          label="Response"
          rows={2}
          rowsMax={5}
          placeholder="Write your response..."
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      {isHost && (
        <div className={classes.controls}>
          <Typography variant="h4">
            <b>Questions:</b> {currentIndex + 1}/{metadata.questions.length}
          </Typography>

          <Tooltip
            title={
              currentIndex <= 0
                ? 'No more questions'
                : `Back to: ${metadata.questions[currentIndex - 1]}`
            }
            placement="top"
          >
            {/* add div so tooltip will still work with disabled button */}
            <div>
              <Button
                variant="text"
                disabled={currentIndex <= 0}
                color="primary"
                onClick={handlePrevQuestion}
              >
                Previous Question
              </Button>
            </div>
          </Tooltip>
          <Tooltip
            title={
              isLastQuestion
                ? 'No more questions'
                : `Advance to: ${metadata.questions[currentIndex + 1]}`
            }
            placement="top"
          >
            {/* add div so tooltip will still work with disabled button */}
            <div>
              <Button
                variant="contained"
                disabled={isLastQuestion}
                color="primary"
                onClick={handleNextQuestion}
              >
                Next Question
              </Button>
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
