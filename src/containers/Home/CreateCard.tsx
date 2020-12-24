import React from 'react';
import { Typography, Card } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { AddCircleOutline as AddIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      cursor: 'pointer',
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.primary.main,

      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },

      '& h2': {
        marginBottom: theme.spacing(1),
        fontWeight: 600,
        color: 'white',
      },
    },
    icon: {
      fontSize: '3rem',
      color: 'white',
    },
  }),
);

export default function CreateCard({ height }: { height: number }) {
  const classes = useStyles();

  return (
    <Card className={classes.card} style={{ height }}>
      <Typography variant="h2">New Template</Typography>
      <AddIcon className={classes.icon} />
    </Card>
  );
}
