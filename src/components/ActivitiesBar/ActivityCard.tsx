import React, { useCallback } from 'react';
import * as Yup from 'yup';
import { Card, Typography, Button, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { EditOutlined as EditIcon } from '@material-ui/icons';
import { Activity } from '~/firebase/schema-types';
import EditableTitle from '~/components/EditableTitle/EditableTitle';

const NameSchema = Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(1),

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
        boxShadow: theme.shadows[4],
      },
    },
    activityType: {
      color: theme.palette.grey[600],
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    content: {
      flexGrow: 1,
      paddingTop: 2,
    },
    buttonContainer: {
      marginTop: 'auto',
      marginBottom: 'auto',

      '& button': {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 36,
        height: 36,
        minWidth: 0,
        padding: 0,
        borderRadius: 18,
      },
    },
  }),
);

export default function ActivitiesCard({
  activity,
  save,
  onEdit,
}: {
  activity: Activity;
  save(activity: Activity): void;
  onEdit(): void;
}) {
  const classes = useStyles();

  const handleSettingsClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onEdit();
    },
    [onEdit],
  );

  const handleNameChange = useCallback(
    (newName: string) => {
      save({
        ...activity,
        name: newName,
      });
    },
    [save, activity],
  );

  return (
    <Card className={classes.card}>
      <div className={classes.content}>
        <EditableTitle
          title={activity.name}
          onChange={handleNameChange}
          variant="h2"
          validationSchema={NameSchema}
        />
        <Typography variant="body1" className={classes.activityType}>
          {activity.type}
        </Typography>
      </div>
      <div className={classes.buttonContainer}>
        <Tooltip title="Edit activity" placement="left">
          <Button variant="outlined" color="secondary" onClick={handleSettingsClick}>
            <EditIcon />
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
}
