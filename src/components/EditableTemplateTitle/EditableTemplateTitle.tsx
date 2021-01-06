import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import { Collections, LocalModel, Template } from '~/firebase/schema-types';
import EditableTitle from '~/components/EditableTitle/EditableTitle';
import BackButton from '~/components/BackButton/BackButton';

const NameSchema = Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarContent: {
      display: 'flex',
      padding: theme.spacing(1),
      borderBottom: theme.dividerBorder,
      height: theme.headerBarHeight,
    },
    title: {
      flexGrow: 1,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  }),
);

export default function ToolbarContent({
  template,
  showBackButton,
  backHref,
}: {
  template?: LocalModel<Template>;
  showBackButton?: boolean;
  backHref?: string;
}) {
  const classes = useStyles();
  const { markIsWriting } = useAppState();

  const saveName = useCallback(
    (newName: string) => {
      if (!template) {
        return;
      }

      db.collection(Collections.TEMPLATES).doc(template.id).update({ name: newName });
      markIsWriting();
    },
    [markIsWriting, template],
  );

  return (
    <div className={classes.toolbarContent}>
      {showBackButton && <BackButton href={backHref} />}
      <EditableTitle
        className={classes.title}
        title={template?.name}
        isLoading={!template}
        variant="h2"
        validationSchema={NameSchema}
        onChange={saveName}
      />
    </div>
  );
}
