import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Field, ErrorMessage } from 'formik';
import { Switch } from 'formik-material-ui';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      color: theme.palette.error.main,
      marginLeft: theme.spacing(1),
    },
    switchControl: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[800],
      borderRadius: theme.shape.borderRadius,

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },
    },
    textContent: {
      flexGrow: 1,
      marginLeft: theme.spacing(1),

      '& .MuiTypography-body1': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(0.5),
      },

      '& .MuiTypography-body2': {
        marginBottom: theme.spacing(1),
      },
    },
  }),
);

export default function SwitchControl({
  name,
  title,
  description,
}: {
  name: string;
  title: string;
  description?: string;
}) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.switchControl}>
        <div className={classes.textContent}>
          <Typography variant="body1">{description ? <b>{title}</b> : title}</Typography>
          <Typography variant="body2">{description}</Typography>
          <ErrorMessage className={classes.error} name={name} component="span" />
        </div>
        <Field component={Switch} type="checkbox" name={name} />
      </div>
    </>
  );
}
