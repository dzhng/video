import React, { useState } from 'react';
import { Card, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  SubjectOutlined as NotesIcon,
  ChatBubbleOutlineOutlined as ChatsIcon,
} from '@material-ui/icons';
import Notes from './Notes';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100%',
      margin: theme.spacing(2),
    },
  }),
);

export default function Interactions() {
  const classes = useStyles();
  const [navItem, setNavItem] = useState(0);

  return (
    <Card className={classes.container}>
      <Notes />
      <BottomNavigation
        value={navItem}
        onChange={(_, newValue) => {
          setNavItem(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction label="Notes" icon={<NotesIcon />} />
        <BottomNavigationAction label="Chats" icon={<ChatsIcon />} />
      </BottomNavigation>
    </Card>
  );
}
