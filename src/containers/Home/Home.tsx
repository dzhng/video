import React, { useRef, useState, useCallback } from 'react';
import { Typography, Grid, Menu, MenuItem, IconButton, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { MoreVert as MoreIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import Link from 'next/link';

import { LocalModel, Template, Workspace, User } from '~/firebase/schema-types';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import Nav from '~/components/Nav/Nav';
import TemplateCard from './TemplateCard';
import CreateCard from './CreateCard';
import AddMemberMenuItem from './AddMemberMenuItem';
import LeaveMenuItem from './LeaveMenuItem';
import DeleteMenuItem from './DeleteMenuItem';

interface PropTypes {
  workspace?: LocalModel<Workspace>;
  members: LocalModel<User>[];
  isLoadingMembers: boolean;
  templates: LocalModel<Template>[];
  isLoadingTemplates: boolean;
  isAdmin: boolean;
  leaveWorkspace(): void;
  deleteWorkspace(): void;
  addMembers(emails: string[]): Promise<void>;
  removeMembers(ids: string[]): Promise<void>;
}

const avatarSize = 30;
const cardHeight = 200;

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'row',
    },
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      flexGrow: 1,

      // override spacing-3 negative margins which causes a scroll bar
      width: '100%',
      margin: 0,
    },
    titleBar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      display: 'inline',
      lineHeight: `${avatarSize}px`,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      marginRight: theme.spacing(1),
      backgroundColor: theme.palette.grey[300],
      boxShadow: theme.shadows[3],
    },
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    membersList: {
      display: 'flex',
      marginLeft: theme.spacing(2),
    },
    settingsContainer: {
      display: 'inline',

      '& button': {
        width: avatarSize,
        height: avatarSize,
        backgroundColor: theme.palette.grey[200],
        boxShadow: theme.shadows[3],
      },
    },
    deleteButtonMenu: {
      color: theme.palette.error.main,
    },
  }),
);

export default function Home({
  workspace,
  members,
  isLoadingMembers,
  templates,
  isLoadingTemplates,
  isAdmin,
  leaveWorkspace,
  deleteWorkspace,
  addMembers,
  removeMembers,
}: PropTypes) {
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const classes = useStyles();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = useCallback(() => {
    setSettingsMenuOpen(false);
  }, []);

  const loadingTemplateSkeletons = [0, 1, 2].map((key) => (
    <Grid item xs={3} key={key}>
      <Skeleton variant="rect" height={cardHeight} />
    </Grid>
  ));

  const loadingMemberSkeletons = (
    <Skeleton variant="circle" height={avatarSize} width={avatarSize} className={classes.avatar} />
  );

  return (
    <div className={classes.container}>
      <Nav mobileOpen={mobileOpen} toggleOpen={() => setMobileOpen((state) => !state)} />

      <Grid container className={classes.grid} spacing={3}>
        <Grid item xs={12} className={classes.titleBar}>
          <Typography variant="h1" className={classes.title}>
            {workspace ? workspace.name : <Skeleton width={150} height={avatarSize} />}
          </Typography>
          <span className={classes.membersList}>
            {!workspace || isLoadingMembers
              ? loadingMemberSkeletons
              : members.map((member) => (
                  <Tooltip key={member.id} title={member.displayName} placement="bottom">
                    <UserAvatar className={classes.avatar} user={member} />
                  </Tooltip>
                ))}

            <div className={classes.settingsContainer} ref={anchorRef}>
              <Tooltip title="Settings" placement="bottom">
                {/* wrap in span so tooltip still works even with the button disabled */}
                <span>
                  <IconButton
                    color="inherit"
                    disabled={!workspace}
                    onClick={() => setSettingsMenuOpen((state) => !state)}
                  >
                    <MoreIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Menu
                open={settingsMenuOpen}
                onClose={() => setSettingsMenuOpen((state) => !state)}
                anchorEl={anchorRef.current}
              >
                <MenuItem disabled>Settings</MenuItem>

                {isAdmin && (
                  <AddMemberMenuItem
                    onClick={handleMenuClick}
                    addMembers={addMembers}
                    removeMembers={removeMembers}
                    members={members}
                  />
                )}

                <LeaveMenuItem onClick={handleMenuClick} leaveWorkspace={leaveWorkspace} />

                {isAdmin && (
                  <DeleteMenuItem
                    onClick={handleMenuClick}
                    deleteWorkspace={deleteWorkspace}
                    className={classes.deleteButtonMenu}
                  />
                )}
              </Menu>
            </div>
          </span>
        </Grid>

        <Grid item xs={3}>
          <Link href="/template/create">
            {/* Need to wrap Card in div since Link doesn't work with functional components. See: https://github.com/vercel/next.js/issues/7915 */}
            <div>
              <CreateCard height={cardHeight} />
            </div>
          </Link>
        </Grid>

        {isLoadingTemplates
          ? loadingTemplateSkeletons
          : templates.map((template) => (
              <Grid item xs={3} key={template.id}>
                <Link href={`/template/${template.id}`}>
                  {/* Need to wrap Card in div since Link doesn't work with functional components. See: https://github.com/vercel/next.js/issues/7915 */}
                  <div>
                    <TemplateCard template={template} height={cardHeight} />
                  </div>
                </Link>
              </Grid>
            ))}
      </Grid>
    </div>
  );
}
