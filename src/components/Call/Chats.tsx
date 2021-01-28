import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import clsx from 'clsx';
import { get, values } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, TextField, Tooltip, IconButton } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { SendOutlined as SendIcon } from '@material-ui/icons';
import Linkify from 'react-linkify';
import { useHotkeys } from 'react-hotkeys-hook';

import { useAppState } from '~/state';
import {
  CallData,
  MessageType,
  ChatChannelType,
  ChatsDataKey,
  PublicChatsChannelKey,
} from '~/firebase/rtdb-types';
import useCallContext from '~/hooks/useCallContext/useCallContext';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import useUserInfo from '~/hooks/useUserInfo/useUserInfo';

const MaxDisplayableMessages = 500;

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      // need to set this so messageList overflow can work in a flex layout
      overflow: 'hidden',
    },
    title: {
      margin: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    messageList: {
      flexGrow: 1,
      marginTop: theme.spacing(1),
      overflowY: 'auto',
      ...theme.customMixins.scrollBar,
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

        '& p': {
          border: '1px solid ' + theme.palette.secondary.main + '70',
          backgroundColor: theme.palette.secondary.main + '10',
        },
      },
      '& p': {
        alignSelf: 'center',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,

        border: '1px solid ' + theme.palette.grey[400],
        backgroundColor: theme.palette.grey[100],
      },
    },
    messageAvatar: {
      flexShrink: 0,
      width: 25,
      height: 25,
    },
    composeBar: {
      padding: theme.spacing(1),
      marginTop: 0,
      flexShrink: 0,
      flexGrow: 0,
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

      <Typography variant="body1">
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          {message.data}
        </Linkify>
      </Typography>
    </div>
  );
};

const ComposeBar = ({ sendMessage }: { sendMessage(text: string): void }) => {
  const classes = useStyles();
  const [input, setInput] = useState('');
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    if (input.length > 0) {
      sendMessage(input);
      setInput('');
    }
  }, [input, sendMessage]);

  useHotkeys(
    'c',
    (e) => {
      e.preventDefault();
      textFieldRef.current?.focus();
    },
    // use keyup event since keypress is taken by nav
    // this way the same hotkey can be binded to multiple
    // handlers
    { keyup: true },
  );

  // cancel focus when esc is pressed
  useHotkeys(
    'esc,tab',
    (e) => {
      if (window.document.activeElement === textFieldRef.current) {
        e.preventDefault();
        textFieldRef.current?.blur();
      }
    },
    {
      enableOnTags: ['TEXTAREA'],
    },
  );

  return (
    <TextField
      inputRef={textFieldRef}
      className={classes.composeBar}
      variant="outlined"
      color="secondary"
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

export const MessageList = ({
  data,
  scrollRef,
}: {
  data?: CallData;
  scrollRef: React.MutableRefObject<number>;
}) => {
  const classes = useStyles();
  const { user } = useAppState();
  const listRef = useRef<HTMLDivElement>(null);

  const messageList = useMemo(() => {
    const publicChatsData = get(data, [ChatsDataKey, PublicChatsChannelKey], {}) as ChatChannelType;

    return values(publicChatsData)
      .slice(0, MaxDisplayableMessages)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [data]);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      scrollRef.current = Math.max(
        listRef.current.scrollHeight - listRef.current.clientHeight - listRef.current.scrollTop,
        0,
      );
    }
  }, [scrollRef]);

  useLayoutEffect(() => {
    // whenever messageList updates, keep the same bottom scroll position
    // this will handle the case when user creates new message, or when a new messages comes in from remote
    if (listRef.current) {
      listRef.current.scroll({
        top: listRef.current.scrollHeight - listRef.current.clientHeight - scrollRef.current,
      });
    }
  }, [messageList, scrollRef]);

  return (
    <div ref={listRef} className={classes.messageList} onScroll={handleScroll}>
      {messageList.map((message) => (
        <Message
          key={`${message.uid}-${message.createdAt}}`}
          message={message}
          isSelf={user?.uid === message.uid}
        />
      ))}
    </div>
  );
};

export default function Chats() {
  const classes = useStyles();
  const { user } = useAppState();
  const { currentCallData, updateCallData } = useCallContext();
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

  return (
    <div className={classes.container}>
      <Typography variant="h3" className={classes.title}>
        <b>Chats</b>
      </Typography>
      <Divider />

      <MessageList data={currentCallData} scrollRef={scrollBottomRef} />
      <ComposeBar sendMessage={createMessage} />
    </div>
  );
}
