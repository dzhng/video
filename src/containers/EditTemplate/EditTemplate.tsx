import React, { useState } from 'react';
import { Drawer, Hidden } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { LocalModel, Template } from '~/firebase/schema-types';
import { isBrowser } from '~/utils';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const container = isBrowser ? () => window.document.body : undefined;

  return (
    <div className={classes.container}>
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <TemplateTitle showBackButton template={template} />
          <ActivitiesBar template={template} mode="edit" />
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <TemplateTitle showBackButton template={template} />
          <ActivitiesBar template={template} mode="edit" />
        </Drawer>
        <div className={classes.activitiesSpacer} />
      </Hidden>

      <div className={classes.content}>
        <SessionMenu openDrawer={() => setMobileOpen(true)} />
      </div>
    </div>
  );
}
