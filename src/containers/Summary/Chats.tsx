import React, { useRef } from 'react';
import { get, values } from 'lodash';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { CallData, ChatsDataKey, PublicChatsChannelKey } from '~/firebase/rtdb-types';
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
  }),
);

export default function Chats({ data }: { data: CallData }) {
  const classes = useStyles();
  const scrollRef = useRef(0);

  const list = values(get(data, [ChatsDataKey, PublicChatsChannelKey], {}));

  return (
    <>
      <Typography variant="h2">Chats</Typography>
      <div className={classes.container}>
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
