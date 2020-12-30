import React from 'react';
import { Drawer } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { LocalModel, Template } from '~/firebase/schema-types';
import MenuBar from '~/components/MenuBar/MenuBar';
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
    toolbarSpacer: theme.mixins.toolbar,
    activitiesSpacer: theme.customMixins.activitiesBar,
    content: {
      flexGrow: 1,
      // don't do 100% height since that will create scrollbar b/c toolbar on top
      // just do enough that we can make things looks reasonably vertically centered in child elements
      minHeight: 'calc(80vh)',
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
        <div className={classes.toolbarSpacer} />
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
  return (
    <MenuBar padding={false} toolbarContent={<ToolbarContent template={template} />}>
      {template && <TemplateForm template={template} />}
    </MenuBar>
  );
}
