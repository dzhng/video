import React from 'react';
import { Typography } from '@material-ui/core';

const TaskSection = ({ name }: { name: string }) => <Typography variant="h4">{name}</Typography>;

export default function Notes() {
  return (
    <div>
      <TaskSection name="Action Items" />
      <TaskSection name="Questions" />
      <TaskSection name="Take Aways" />
    </div>
  );
}
