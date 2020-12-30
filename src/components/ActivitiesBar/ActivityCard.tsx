import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { Card, Typography, InputBase, Button, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { EditOutlined as EditIcon } from '@material-ui/icons';
import { Activity } from '~/firebase/schema-types';

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
    nameInput: {
      ...theme.typography.h2,
      width: '100%',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),

      // have transparent border here so its correctly sized
      border: '1px solid transparent',
      borderRadius: theme.shape.borderRadius,
      transition: theme.transitionTime,

      '&:hover': {
        border: '1px solid ' + theme.palette.grey[300],
      },

      '&.Mui-focused': {
        border: '1px solid ' + theme.palette.grey[500],
        backgroundColor: 'white',
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
  const [name, setName] = useState(activity.name);
  const inputRef = useRef<HTMLInputElement>();

  // everytime activity changes, update name with latest
  // but make sure to not change if still editing (or else we'll get stuttering)
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setName(activity.name);
    }
  }, [activity]);

  const handleSettingsClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onEdit();
    },
    [onEdit],
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      // if not valid, just don't set
      if (!NameSchema.isValidSync(newName)) {
        return;
      }

      setName(newName);
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
        <InputBase
          inputRef={inputRef}
          className={classes.nameInput}
          value={name}
          onChange={handleNameChange}
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
