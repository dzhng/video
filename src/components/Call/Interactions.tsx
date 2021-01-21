import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, BottomNavigation, BottomNavigationAction, Tooltip } from '@material-ui/core';
import {
  SubjectOutlined as NotesIcon,
  ChatBubbleOutlineOutlined as ChatsIcon,
} from '@material-ui/icons';
import Notes from './Notes';
import Chats from './Chats';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: '100%',
      margin: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flexGrow: 1,
      overflowY: 'auto',
      ...theme.customMixins.scrollBar,
    },
    nav: {
      borderTop: theme.dividerBorder,
      flexShrink: 0,
    },
  }),
);

export default function Interactions() {
  const classes = useStyles();
  const [navItem, setNavItem] = useState(0);

  return (
    <Card className={classes.container}>
      <div className={classes.content}>{navItem === 0 ? <Notes /> : <Chats />}</div>

      <BottomNavigation
        className={classes.nav}
        value={navItem}
        onChange={(_, newValue) => {
          setNavItem(newValue);
        }}
        showLabels
      >
        <Tooltip
          placement="top"
          title="Collaborate with other participants on shared notes, eveyone can edit notes collaboratively."
        >
          <BottomNavigationAction label="Notes" icon={<NotesIcon />} />
        </Tooltip>

        <Tooltip
          placement="top"
          title="Message other participants, new participants joining will be able to see past messages."
        >
          <BottomNavigationAction label="Chats" icon={<ChatsIcon />} />
        </Tooltip>
      </BottomNavigation>
    </Card>
  );
}
