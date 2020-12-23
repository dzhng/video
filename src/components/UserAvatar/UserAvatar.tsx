import React, { forwardRef } from 'react';
import { Avatar } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import { Person } from '@material-ui/icons';
import { StateContextType } from '~/state';
import { User } from '~/firebase/schema-types';

const useStyles = makeStyles({
  red: {
    color: 'white',
    backgroundColor: '#F22F46',
  },
});

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((text) => text[0])
    .join('')
    .toUpperCase();
}

export default forwardRef(function UserAvatar(
  {
    user,
    ...otherProps
  }: {
    user: StateContextType['user'] | User;
    [other: string]: any;
  },
  ref,
) {
  const classes = useStyles();
  const { displayName, photoURL } = user!;

  return photoURL ? (
    <Avatar ref={ref as React.RefObject<HTMLDivElement>} {...otherProps} src={photoURL} />
  ) : (
    <Avatar ref={ref as React.RefObject<HTMLDivElement>} {...otherProps} className={classes.red}>
      {displayName ? getInitials(displayName) : <Person data-testid="person-icon" />}
    </Avatar>
  );
});
