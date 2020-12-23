import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { MoreVert as MoreIcon } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import Link from 'next/link';

import { LocalModel, Template, Workspace, User } from '~/firebase/schema-types';
import UserAvatar from '~/components/UserAvatar/UserAvatar';
import TemplateCard from './TemplateCard';

interface PropTypes {
  workspace?: LocalModel<Workspace>;
  members: LocalModel<User>[];
  isLoadingMembers: boolean;
  templates: LocalModel<Template>[];
  isLoadingTemplates: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    titleBar: {
      display: 'flex',
    },
    title: {
      display: 'inline',
      verticalAlign: 'top',
    },
    avatar: {
      width: 30,
      height: 30,
      backgroundColor: theme.palette.grey[300],
    },
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    createButtonItem: {
      textAlign: 'right',
    },
    membersList: {
      display: 'flex',
      marginTop: 5,
      marginLeft: theme.spacing(2),
    },
    settingsContainer: {
      marginLeft: theme.spacing(1),
      display: 'inline',
      width: 30,
      height: 30,
      backgroundColor: theme.palette.grey[300],
      borderRadius: 15,
      cursor: 'pointer',

      '& svg': {
        marginLeft: 3,
        marginTop: 3,
      },
    },
  }),
);

export default function Home({
  workspace,
  members,
  isLoadingMembers,
  templates,
  isLoadingTemplates,
}: PropTypes) {
  const classes = useStyles();

  const loadingTemplateSkeletons = [0, 1, 2].map((key) => (
    <Grid item xs={3} key={key}>
      <Skeleton variant="rect" height={200} />
    </Grid>
  ));

  const loadingMemberSkeletons = <Skeleton variant="circle" height={30} />;

  return (
    <>
      <Grid container className={classes.grid} spacing={3}>
        <Grid item xs={9} className={classes.titleBar}>
          <Typography variant="h4" className={classes.title}>
            {workspace ? workspace.name : <Skeleton width={150} height={38} />}
          </Typography>
          <span className={classes.membersList}>
            {isLoadingMembers
              ? loadingMemberSkeletons
              : members.map((member) => (
                  <UserAvatar key={member.id} className={classes.avatar} user={member} />
                ))}
            <div className={classes.settingsContainer}>
              <MoreIcon />
            </div>
          </span>
        </Grid>

        <Grid item xs={3} className={classes.createButtonItem}>
          <Link href="/template/create">
            <Button color="primary" variant="contained" size="large">
              Create Template
            </Button>
          </Link>
        </Grid>

        {isLoadingTemplates
          ? loadingTemplateSkeletons
          : templates.map((template) => (
              <Grid item xs={3} key={template.id}>
                <Link href={`/template/${template.id}`}>
                  {/* Need to wrap Card in div since Link doesn't work with functional components. See: https://github.com/vercel/next.js/issues/7915 */}
                  <div>
                    <TemplateCard template={template} />
                  </div>
                </Link>
              </Grid>
            ))}
      </Grid>
    </>
  );
}
