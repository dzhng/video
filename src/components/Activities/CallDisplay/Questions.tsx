import React, { useState, useMemo, useCallback } from 'react';
import { entries, values } from 'lodash';
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
// NOTE: because of firebase limitations, key has to be encoded via encodeURIComponent,
// as questions can contain spaces or special characters that is not allowed as firebase keys
const ResponsesKey = 'responses';

interface ResponseType {
  uid: string;
  isAnonymous: boolean;
  response: string;
  createdAt: number; // since rtdb doesn't store dates, store ms timestamp
}

const ResponseSchema = Yup.string().min(1).max(500).required();

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      width: '100%',
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

      '& button': {
        marginTop: theme.spacing(1),
      },
    },
    responses: {
      paddingTop: theme.spacing(2),
      borderTop: theme.dividerBorder,
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
  const { currentActivity, updateActivityData, currentActivityData, isHost } = useCallContext();

  // map of pending responses in text area, keyed by question
  const [responseValues, setResponseValues] = useState<{ [question: string]: string }>({});

  const metadata = currentActivity?.metadata as QuestionsActivityMetadata | undefined;
  const currentIndex = useMemo<number>(
    () => (currentActivityData ? (currentActivityData[CurrentIndexKey] as number) ?? 0 : 0),
    [currentActivityData],
  );

  const currentQuestion = useMemo<string | undefined>(
    () => (metadata ? metadata.questions[currentIndex] : undefined),
    [currentIndex, metadata],
  );

  const currentResponses = useMemo<{ [key: string]: ResponseType } | undefined>(
    () =>
      currentActivityData && currentQuestion
        ? (currentActivityData[ResponsesKey] as { [question: string]: any })?.[
            encodeURIComponent(currentQuestion)
          ]
        : undefined,
    [currentActivityData, currentQuestion],
  );

  const haveSubmittedResponse = useMemo(
    () =>
      Boolean(
        user ? values(currentResponses).find((response) => response.uid === user.uid) : false,
      ),
    [currentResponses, user],
  );

  const handleNextQuestion = useCallback(() => {
    if (!metadata || !currentActivity || currentIndex >= metadata.questions.length - 1) {
      return;
    }

    updateActivityData(currentActivity, CurrentIndexKey, currentIndex + 1);
  }, [metadata, currentActivity, currentIndex, updateActivityData]);

  const handlePrevQuestion = useCallback(() => {
    if (!metadata || !currentActivity || currentIndex <= 0) {
      return;
    }

    updateActivityData(currentActivity, CurrentIndexKey, currentIndex - 1);
  }, [metadata, currentActivity, currentIndex, updateActivityData]);

  const handleSubmit = useCallback(
    (response: string, isAnonymous: boolean) => {
      if (!currentActivity || !currentQuestion || !user || !currentActivityData) {
        return;
      }

      if (!ResponseSchema.isValidSync(response)) {
        return;
      }

      // check if the user already has something in current responses
      // don't allow the user to submit multiple
      if (!metadata?.allowMultipleSubmissions && haveSubmittedResponse) {
        return;
      }

      const nowMs = new Date().getTime();
      const responseObject: ResponseType = {
        uid: user.uid,
        isAnonymous,
        response,
        createdAt: nowMs,
      };
      // key this by uid and timestamp, to avoid conflict with the user's prev response
      const key = `${user.uid}-${nowMs}`;

      updateActivityData(
        currentActivity,
        `${ResponsesKey}.${encodeURIComponent(currentQuestion)}.${key}`,
        responseObject,
      );

      // clear text area on submit
      setResponseValues((state) => ({ ...state, [currentQuestion]: '' }));
    },
    [
      currentQuestion,
      currentActivity,
      currentActivityData,
      updateActivityData,
      user,
      haveSubmittedResponse,
      metadata,
    ],
  );

  const handleDeleteResponse = useCallback(
    (key) => {
      if (!currentActivity || !currentQuestion) {
        return;
      }

      updateActivityData(
        currentActivity,
        `${ResponsesKey}.${encodeURIComponent(currentQuestion)}.${key}`,
        null,
      );
    },
    [currentActivity, currentQuestion, updateActivityData],
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

        {(metadata.allowMultipleSubmissions || !haveSubmittedResponse) && (
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
                handleSubmit(responseValues[currentQuestion], metadata.allowAnonymousSubmissions)
              }
            >
              Submit
            </Button>
          </div>
        )}

        {currentResponses && (
          <div className={classes.responses}>
            {entries(currentResponses)
              .sort((a, b) => b[1].createdAt - a[1].createdAt)
              .map(([key, response], idx) => (
                <ResponseCard
                  key={idx}
                  uid={response.uid}
                  isAnonymous={response.isAnonymous}
                  response={response.response}
                  isOwnResponse={response.uid === user?.uid}
                  deleteResponse={() => handleDeleteResponse(key)}
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
