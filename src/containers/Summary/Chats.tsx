import React, { useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { CallData } from '~/firebase/schema-types';
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

export default function Chats({ data }: { data: { [key: string]: CallData } }) {
  const classes = useStyles();
  const scrollRef = useRef(0);

  return (
    <div className={classes.container}>
      <MessageList data={data} scrollRef={scrollRef} />
    </div>
  );
}
