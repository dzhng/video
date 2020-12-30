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

      '& .MuiTypography-root': {
        flexGrow: 1,
        marginLeft: theme.spacing(1),
      },

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },
    },
  }),
);

export default function SwitchControl({ name, title }: { name: string; title: string }) {
  const classes = useStyles();

  return (
    <div className={classes.switchControl}>
      <Typography variant="body1">
        {title}
        <ErrorMessage className={classes.error} name={name} component="span" />
      </Typography>
      <Field component={Switch} type="checkbox" name={name} />
    </div>
  );
}
