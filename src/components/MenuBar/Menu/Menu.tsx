import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';

import IconButton from '@material-ui/core/IconButton';
import MenuContainer from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';

import { useAppState } from '~/state';
import AboutDialog from '../AboutDialog/AboutDialog';
import UserAvatar from './UserAvatar/UserAvatar';

export default function Menu() {
  const router = useRouter();
  const { user, signOut } = useAppState();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  const handleSignOut = useCallback(() => {
    signOut?.();
    // hard reload the page after signing out
    router.reload();
  }, [signOut, router]);

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
        {user && <MenuItem onClick={handleSignOut}>Logout</MenuItem>}
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
    </div>
  );
}
