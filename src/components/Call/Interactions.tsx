import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, BottomNavigation, BottomNavigationAction, Tooltip } from '@material-ui/core';
import {
  SubjectOutlined as NotesIcon,
  ChatBubbleOutlineOutlined as ChatsIcon,
} from '@material-ui/icons';
import { useHotkeys } from 'react-hotkeys-hook';

import useCallContext from '~/hooks/useCallContext/useCallContext';
import { CallEvents } from '~/components/CallProvider/events';
import useHotkeyPopper from '~/hooks/useHotkeyPopper/useHotkeyPopper';
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

    '@global': {
      '.interactionPopper': {
        top: '48px !important',
      },
    },
  }),
);

export default function Interactions() {
  const classes = useStyles();
  const { events } = useCallContext();
  const [navItem, setNavItem] = useState(0);
  const { popperElement, anchorRef, setPopperMessage } = useHotkeyPopper({
    className: 'interactionPopper',
    placement: 'top',
  });

  useHotkeys(
    'c',
    (e) => {
      e.preventDefault();
      setNavItem(1);
      setPopperMessage(
        <>
          <b>Chats</b>: Use <b>[enter]</b> to send, <b>[tab]</b> to cancel.
        </>,
        true,
      );
    },
    [setPopperMessage],
  );

  useHotkeys(
    // action [i]tems, [q]uetions, [t]ake aways
    'i,q,t,n',
    (e) => {
      e.preventDefault();
      setNavItem(0);
      if (e.key !== 'n') {
        setPopperMessage(
          <>
            <b>Notes</b>: Use <b>[enter]</b> to create, <b>[tab]</b> to cancel.
          </>,
          true,
        );
      }
    },
    [setPopperMessage],
  );

  useEffect(() => {
    const handleNotiClick = () => {
      // set index for chats
      setNavItem(1);
    };

    events.on(CallEvents.MESSAGE_NOTI_CLICKED, handleNotiClick);
    return () => {
      events.off(CallEvents.MESSAGE_NOTI_CLICKED, handleNotiClick);
    };
  }, [events]);

  return (
    <>
      <Card className={classes.container}>
        <div className={classes.content}>{navItem === 0 ? <Notes /> : <Chats />}</div>

        <BottomNavigation
          ref={anchorRef}
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

      {popperElement}
    </>
  );
}
