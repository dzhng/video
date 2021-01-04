import React from 'react';
import { Drawer } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { LocalModel, Template } from '~/firebase/schema-types';
import ActivitiesBar from '~/components/Activities/ActivitiesBar/ActivitiesBar';
import SessionMenu from '~/components/SessionsMenu/SessionsMenu';
import TemplateTitle from '~/components/EditableTemplateTitle/EditableTemplateTitle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      width: '100%',
    },
    drawerPaper: theme.customMixins.activitiesBar,
    activitiesSpacer: theme.customMixins.activitiesBar,
    content: {
      flexGrow: 1,
      height: '100vh',
    },
  }),
);

export default function EditContainer({ template }: { template: LocalModel<Template> }) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        variant="permanent"
        open
      >
        <TemplateTitle showBackButton template={template} />
        <ActivitiesBar template={template} />
      </Drawer>
      <div className={classes.activitiesSpacer} />
      <div className={classes.content}>
        <SessionMenu />
      </div>
    </div>
  );
}
