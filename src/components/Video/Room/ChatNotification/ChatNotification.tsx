import React, { forwardRef, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Typography, Slide } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import { shortName } from '~/utils';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import useUserInfo from '~/hooks/useUserInfo/useUserInfo';
import { MessageType } from '~/components/CallProvider/useCallChat/useCallChat';
import UserAvatar from '~/components/UserAvatar/UserAvatar';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      maxWidth: 300,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.secondary.dark + '90',
      color: 'white',
      padding: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',

      '& p': {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    userAvatar: {
      flexShrink: 0,
      width: 25,
      height: 25,
    },
  }),
);

const MessageWrapper = forwardRef(
  ({ id, children }: { id: string | number; children: React.ReactNode }, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={classes.container}
        onClick={() => closeSnackbar(id)}
      >
        {children}
      </div>
    );
  },
);

const Message = ({ message }: { message: MessageType }) => {
  const classes = useStyles();
  const user = useUserInfo(message.uid);
  const messageText = message.type === 'text' ? message.data : 'New message';

  return (
    <>
      {user ? (
        <UserAvatar user={user} className={classes.userAvatar} />
      ) : (
        <Skeleton variant="circle" className={classes.userAvatar} />
      )}
      <Typography variant="body1">
        <b>{shortName(user?.displayName ?? '')}: </b>
        {messageText}
      </Typography>
    </>
  );
};

export default function ReconnectingNotification() {
  const { notiMessages } = useCallContext();
  const { enqueueSnackbar } = useSnackbar();

  // everytime noti messages change, send to snackbar
  useEffect(() => {
    if (notiMessages.length > 0) {
      const lastMessage = notiMessages[notiMessages.length - 1];

      enqueueSnackbar(<Message message={lastMessage} />, {
        autoHideDuration: null,
        variant: 'default',
        content: (key, message) => (
          <MessageWrapper key={key} id={key}>
            {message}
          </MessageWrapper>
        ),
        // @ts-ignore
        TransitionComponent: Slide,
        TransitionProps: {
          // @ts-ignore
          direction: 'left',
        },
      });
    }
  }, [notiMessages, enqueueSnackbar]);

  return null;
}
