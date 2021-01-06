import React, { useState, useMemo, useCallback } from 'react';
import * as Yup from 'yup';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Card, TextField, Button, Tooltip, Divider } from '@material-ui/core';
import { QuestionsActivityMetadata } from '~/firebase/schema-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import { useAppState } from '~/state';

// index of current question shown
const CurrentIndexKey = 'currentIndex';
// map of responses for questions, key is question, value is array of ResponseType
const ResponsesKey = 'responses';

interface ResponseType {
  // for anonymous - it still needs a string for submission checking,
  // but can be random (as long as its stable per user)
  uid: string;
  isAnonymous: boolean;
  response: string;
}

const ResponseSchema = Yup.string().min(1).max(500).required();

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
      padding: theme.spacing(3),

      // important since it allows text to wrap on new lines set in question data
      whiteSpace: 'pre-wrap',
    },
    responseContainer: {
      marginTop: theme.spacing(3),
      paddingBottom: theme.spacing(2),
      borderBottom: theme.dividerBorder,

      '& button': {
        marginTop: theme.spacing(1),
      },
    },
    responseCard: {
      padding: theme.spacing(2),

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

function Response({
  name,
  avatar,
  isAnonymous,
  response,
  deleteResponse,
}: {
  name: string;
  avatar?: string;
  isAnonymous: boolean;
  response: string;
  deleteResponse(): void;
}) {
  const classes = useStyles();
  return <Card className={classes.responseCard}>{response}</Card>;
}

export default function QuestionsDisplay() {
  const classes = useStyles();
  const { user } = useAppState();
  const { currentActivity, updateActivity, currentCallData, isHost } = useCallContext();

  // map of pending responses in text area, keyed by question
  const [responseValues, setResponseValues] = useState<{ [question: string]: string }>({});

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

  const handleSubmit = useCallback(
    (response: string, isAnonymous: boolean) => {
      if (!currentActivity || !currentQuestion || !user || !currentCallData) {
        return;
      }

      if (!ResponseSchema.isValidSync(response)) {
        return;
      }

      // TODO: hash uid if isAnonymous, only need it to be stable for user
      const responseObject: ResponseType = {
        uid: user.uid,
        isAnonymous,
        response,
      };

      const currentResponses = (currentCallData[ResponsesKey] as ResponseType[]) || [];
      updateActivity(currentActivity, ResponsesKey, [...currentResponses, responseObject]);
      // clear text area on submit
      setResponseValues((state) => ({ ...state, [currentQuestion]: '' }));
    },
    [currentQuestion, currentActivity, currentCallData, updateActivity, user],
  );

  const handleResponseChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;
      if (!currentQuestion || !ResponseSchema.isValidSync(value)) {
        return;
      }

      setResponseValues((state) => ({ ...state, [currentQuestion]: e.target.value }));
    },
    [currentQuestion],
  );

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

        <div className={classes.responseContainer}>
          <TextField
            fullWidth
            multiline
            label="Response"
            rows={2}
            rowsMax={5}
            placeholder="Write your response..."
            variant="outlined"
            value={responseValues[currentQuestion]}
            onChange={handleResponseChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() =>
              handleSubmit(responseValues[currentQuestion], metadata.allowAnonymousSubmission)
            }
          >
            Submit
          </Button>
        </div>
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
