import React, { useState, useMemo, useCallback } from 'react';
import { entries } from 'lodash';
import { Typography, Card, Button, Tooltip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { QuestionsActivityMetadata, Activity } from '~/firebase/schema-types';
import { ActivityType } from '~/firebase/rtdb-types';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import useUserInfo from '~/hooks/useUserInfo/useUserInfo';
import { ResponsesKey, ResponseType, useStyles } from './Questions';

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
}: {
  uid: string;
  isAnonymous: boolean;
  response: string;
}) {
  const classes = useStyles();
  const user = useUserInfo(isAnonymous ? undefined : uid);

  return (
    <Card className={classes.responseCard}>
      {user ? (
        <Tooltip title={user.displayName} placement="bottom">
          <UserAvatar user={user} className={classes.userAvatar} />
        </Tooltip>
      ) : (
        <Skeleton variant="circle" className={classes.userAvatar} />
      )}

      <Typography variant="body1">{response}</Typography>
    </Card>
  );
}

export default function QuestionsSummary({
  activity,
  data,
}: {
  activity: Activity;
  data: ActivityType;
}) {
  const classes = useStyles();
  const [index, setIndex] = useState(0);

  const metadata = activity.metadata as QuestionsActivityMetadata;
  const currentQuestion = metadata.questions[index];

  const currentResponses = useMemo<{ [key: string]: ResponseType } | undefined>(
    () =>
      (data[ResponsesKey] as { [question: string]: any })?.[encodeURIComponent(currentQuestion)],
    [data, currentQuestion],
  );

  const handleNextQuestion = useCallback(
    () => setIndex((state) => Math.min(metadata.questions.length - 1, state + 1)),
    [metadata],
  );

  const handlePrevQuestion = useCallback(() => {
    setIndex((state) => Math.max(0, state - 1));
  }, []);

  if (metadata === undefined || currentQuestion === undefined) {
    return <LoadingState />;
  }

  const isLastQuestion = index === metadata.questions.length - 1;

  return (
    <div className={classes.container} style={{ height: 500, overflow: 'hidden' }}>
      <div className={classes.content}>
        <Card className={classes.questionCard}>
          <Typography variant="h1">{currentQuestion}</Typography>
        </Card>

        {currentResponses && (
          <div className={classes.responses}>
            {entries(currentResponses)
              .sort((a, b) => b[1].createdAt - a[1].createdAt)
              .map(([_, response], idx) => (
                <ResponseCard
                  key={idx}
                  uid={response.uid}
                  isAnonymous={response.isAnonymous}
                  response={response.response}
                />
              ))}
          </div>
        )}
      </div>

      <div className={classes.controls}>
        <Typography variant="h4">
          <b>Questions:</b> {index + 1}/{metadata.questions.length}
        </Typography>

        <Tooltip
          title={index <= 0 ? 'No more questions' : `Back to: ${metadata.questions[index - 1]}`}
          placement="top"
        >
          {/* add div so tooltip will still work with disabled button */}
          <div>
            <Button
              variant="text"
              disabled={index <= 0}
              color="primary"
              onClick={handlePrevQuestion}
            >
              Previous Question
            </Button>
          </div>
        </Tooltip>
        <Tooltip
          title={
            isLastQuestion ? 'No more questions' : `Advance to: ${metadata.questions[index + 1]}`
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
    </div>
  );
}
