import React, { useRef } from 'react';
import { get, values, entries } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Tooltip } from '@material-ui/core';
import {
  CallData,
  ChatsDataKey,
  PublicChatsChannelKey,
  ReactionsCountDataKey,
  ReactionMap,
  ReactionTypes,
} from '~/firebase/rtdb-types';
import { MessageList } from '~/components/Call/Chats';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 300,
      overflow: 'hidden',
      borderRadius: theme.shape.borderRadius,
      border: theme.dividerBorder,
    },
    reactionContainer: {
      margin: theme.spacing(1),
      marginBottom: 0,
      borderBottom: theme.dividerBorder,
    },
    reaction: {
      display: 'inline-block',
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[100],
      border: theme.dividerBorder,
      overflow: 'hidden',
      cursor: 'default',
    },
  }),
);

export default function Chats({ data }: { data: CallData }) {
  const classes = useStyles();
  const scrollRef = useRef(0);

  const list = values(get(data, [ChatsDataKey, PublicChatsChannelKey], {}));
  const reactions = entries(get(data, [ReactionsCountDataKey]));

  return (
    <>
      <Typography variant="h2">Chats</Typography>
      <div className={classes.container}>
        {reactions.length > 0 && (
          <div className={classes.reactionContainer}>
            {reactions.map(([type, count]) => (
              <Tooltip title={`${count} reactions were sent in this call`}>
                <span key={type} className={classes.reaction}>
                  {ReactionMap[type as ReactionTypes]} {count}
                </span>
              </Tooltip>
            ))}
          </div>
        )}

        {list.length > 0 ? (
          <MessageList data={data} scrollRef={scrollRef} />
        ) : (
          <Typography variant="body1" style={{ margin: 8, color: '#888' }}>
            No chats were sent in this call.
          </Typography>
        )}
      </div>
    </>
  );
}
