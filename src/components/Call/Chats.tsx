import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { get, values } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, TextField, Tooltip, IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { SendOutlined as SendIcon } from '@material-ui/icons';
import { useAppState } from '~/state';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import useUserInfo from '~/hooks/useUserInfo/useUserInfo';
import { MessageType, ChatChannelType } from './types';

const ChatsDataKey = 'tasks';
const MaxDisplayableMessages = 500;

// TODO: support other channels in the future (host only, private 1-1)
const PublicChatsChannelKey = 'all';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    messageList: {
      flexGrow: 1,
      marginTop: theme.spacing(1),
      overflowY: 'auto',

      // scroll bar customization
      '&::-webkit-scrollbar': {
        width: 8,
      },
      '&::-webkit-scrollbar-track': {
        background: 'none',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: 4,
        background: 'rgba(0,0,0,0.2)',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0,0,0,0.4)',
      },
    },
    message: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),

      '&.isSelf': {
        flexDirection: 'row-reverse',
        textAlign: 'right',
      },
      '& p': {
        flexGrow: 1,
        alignSelf: 'center',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
      },
    },
    messageAvatar: {
      width: 25,
      height: 25,
    },
    composeBar: {
      padding: theme.spacing(1),
      marginTop: 0,
    },
  }),
);

const Message = ({ message, isSelf }: { message: MessageType; isSelf: boolean }) => {
  const classes = useStyles();
  const user = useUserInfo(message.uid);

  return (
    <div className={clsx(classes.message, { isSelf })}>
      {user ? (
        <Tooltip title={user.displayName} placement="bottom">
          <UserAvatar user={user} className={classes.messageAvatar} />
        </Tooltip>
      ) : (
        <Skeleton variant="circle" className={classes.messageAvatar} />
      )}

      <Typography variant="body1">{message.data}</Typography>
    </div>
  );
};

const ComposeBar = ({ sendMessage }: { sendMessage(text: string): void }) => {
  const classes = useStyles();
  const [input, setInput] = useState('');

  const handleSend = useCallback(() => {
    if (input.length > 0) {
      sendMessage(input);
      setInput('');
    }
  }, [input, sendMessage]);

  return (
    <TextField
      className={classes.composeBar}
      variant="outlined"
      fullWidth
      multiline
      rows={1}
      rowsMax={3}
      margin="dense"
      placeholder="Type a message"
      value={input}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
      onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSend();
        }
      }}
      InputProps={{
        endAdornment: (
          <IconButton
            size="small"
            color="secondary"
            disabled={input.length === 0}
            onClick={handleSend}
          >
            <SendIcon />
          </IconButton>
        ),
      }}
    />
  );
};

export default function Chats() {
  const classes = useStyles();
  const { user } = useAppState();
  const { currentCallData, updateCallData } = useCallContext();
  const listRef = useRef<HTMLDivElement>(null);
  const scrollBottomRef = useRef(0);

  const createMessage = useCallback(
    (text: string) => {
      if (!user) {
        return;
      }

      const nowMs = new Date().getTime();
      const messageData: MessageType = {
        uid: user.uid,
        type: 'text',
        data: text,
        createdAt: nowMs,
      };

      // should generate a relatively unique key
      const key = `${user.uid}-${nowMs}`;

      updateCallData(ChatsDataKey, `${PublicChatsChannelKey}.${key}`, messageData);

      // on next UI update, scroll to bottom
      scrollBottomRef.current = 0;
    },
    [user, updateCallData],
  );

  const messageList = useMemo(() => {
    const publicChatsData = get(
      currentCallData,
      [ChatsDataKey, PublicChatsChannelKey],
      {},
    ) as ChatChannelType;

    return values(publicChatsData)
      .slice(0, MaxDisplayableMessages)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [currentCallData]);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      scrollBottomRef.current = Math.max(
        listRef.current.scrollHeight - listRef.current.clientHeight - listRef.current.scrollTop,
        0,
      );
    }
  }, []);

  useLayoutEffect(() => {
    // whenever messageList updates, keep the same bottom scroll position
    // this will handle the case when user creates new message, or when a new messages comes in from remote
    if (listRef.current) {
      listRef.current.scroll({
        top: listRef.current.scrollHeight - listRef.current.clientHeight - scrollBottomRef.current,
      });
    }
  }, [messageList]);

  return (
    <div className={classes.container}>
      <Typography variant="h3" className={classes.title}>
        <b>Chats</b>
      </Typography>
      <Divider />

      <div ref={listRef} className={classes.messageList} onScroll={handleScroll}>
        {messageList.map((message) => (
          <Message message={message} isSelf={user?.uid === message.uid} />
        ))}
      </div>

      <ComposeBar sendMessage={createMessage} />
    </div>
  );
}
