import React, { useState, useRef, useCallback } from 'react';
import AboutDialog from '../AboutDialog/AboutDialog';
import IconButton from '@material-ui/core/IconButton';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';

import { useAppState } from '~/state';
import useVideoContext from '~/hooks/Call/useVideoContext/useVideoContext';
import SettingsDialog from './SettingsDialog/SettingsDialog';
import UserAvatar from './UserAvatar/UserAvatar';

export default function Menu() {
  const { user, signOut } = useAppState();
  const { room, localTracks } = useVideoContext();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  const handleSignOut = useCallback(() => {
    room.disconnect?.();
    localTracks.forEach((track) => track.stop());
    signOut?.();
  }, [room, localTracks, signOut]);

  return (
    <div ref={anchorRef}>
      <IconButton color="inherit" onClick={() => setMenuOpen((state) => !state)}>
        {user ? (
          <UserAvatar data-testid="avatar" user={user} />
        ) : (
          <MoreIcon data-testid="more-icon" />
        )}
      </IconButton>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen((state) => !state)}
        anchorEl={anchorRef.current}
        data-testid="menu"
      >
        {user?.displayName && (
          <MenuItem data-testid="name-item" disabled>
            {user.displayName}
          </MenuItem>
        )}
        <MenuItem onClick={() => setAboutOpen(true)}>About</MenuItem>
        <MenuItem onClick={() => setSettingsOpen(true)}>Settings</MenuItem>
        {user && <MenuItem onClick={handleSignOut}>Logout</MenuItem>}
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <SettingsDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </div>
  );
}
