import React from 'react';
import { Drawer } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { LocalModel, Template } from '~/firebase/schema-types';
import ActivitiesBar from '~/components/ActivitiesBar/ActivitiesBar';
import SessionMenu from '~/components/SessionsMenu/SessionsMenu';
import ToolbarContent from './ToolbarContent';

interface PropTypes {
  template?: LocalModel<Template>;
}

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

const TemplateForm = ({ template }: { template: LocalModel<Template> }) => {
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
        <ToolbarContent template={template} />
        <ActivitiesBar template={template} />
      </Drawer>
      <div className={classes.activitiesSpacer} />
      <div className={classes.content}>
        <SessionMenu />
      </div>
    </div>
  );
};

export default function EditContainer({ template }: PropTypes) {
  return template && <TemplateForm template={template} />;
}
