import React, { useState, useMemo, useCallback } from 'react';
import { without } from 'lodash';
import * as Yup from 'yup';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Card, TextField, Button, IconButton, Tooltip } from '@material-ui/core';
import { DeleteOutline as DeleteIcon } from '@material-ui/icons';
import { QuestionsActivityMetadata } from '~/firebase/schema-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import useUserInfo from '~/hooks/useUserInfo/useUserInfo';
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
    responses: {
      marginTop: theme.spacing(2),
    },
    responseCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),

      '& p': {
        flexGrow: 1,
        alignSelf: 'center',

        // important since it allows text to wrap on new lines set in question data
        whiteSpace: 'pre-wrap',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
      },
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

function ResponseCard({
  uid,
  isAnonymous,
  response,
  isOwnResponse,
  deleteResponse,
}: {
  uid: string;
  isAnonymous: boolean;
  response: string;
  isOwnResponse: boolean;
  deleteResponse(): void;
}) {
  const classes = useStyles();
  const user = useUserInfo(isAnonymous ? undefined : uid);

  return (
    <Card className={classes.responseCard}>
      {user && (
        <Tooltip title={user.displayName} placement="bottom">
          <UserAvatar user={user} />
        </Tooltip>
      )}

      <Typography variant="body1">{response}</Typography>

      {isOwnResponse && (
        <Tooltip title="Delete your response" placement="bottom">
          <IconButton size="small" onClick={deleteResponse}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Card>
  );
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

  const currentResponses = useMemo<ResponseType[] | undefined>(
    () =>
      currentCallData && currentQuestion
        ? (currentCallData[ResponsesKey] as { [question: string]: ResponseType[] })?.[
            currentQuestion
          ]
        : undefined,
    [currentCallData, currentQuestion],
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

      // check if the user already has something in current responses
      // don't allow the user to submit multiple
      if (currentResponses?.find((res) => res.uid === user.uid)) {
        return;
      }

      // TODO: hash uid if isAnonymous, only need it to be stable for user
      const responseObject: ResponseType = {
        uid: user.uid,
        isAnonymous,
        response,
      };

      updateActivity(currentActivity, `${ResponsesKey}.${currentQuestion}`, [
        ...(currentResponses || []),
        responseObject,
      ]);
      // clear text area on submit
      setResponseValues((state) => ({ ...state, [currentQuestion]: '' }));
    },
    [currentQuestion, currentActivity, currentCallData, currentResponses, updateActivity, user],
  );

  const handleDeleteResponse = useCallback(
    (response: ResponseType) => {
      if (!currentResponses || !currentActivity || !currentQuestion) {
        return;
      }

      const newCurrentResponse = without(currentResponses, response);
      updateActivity(currentActivity, `${ResponsesKey}.${currentQuestion}`, newCurrentResponse);
    },
    [currentResponses, currentActivity, currentQuestion, updateActivity],
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
            value={responseValues[currentQuestion] ?? ''}
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

        {currentResponses && (
          <div className={classes.responses}>
            {currentResponses.map((response, idx) => (
              <ResponseCard
                key={idx}
                uid={response.uid}
                isAnonymous={response.isAnonymous}
                response={response.response}
                isOwnResponse={response.uid === user?.uid}
                deleteResponse={() => handleDeleteResponse(response)}
              />
            ))}
          </div>
        )}
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
