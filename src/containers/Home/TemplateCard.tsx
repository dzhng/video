import React from 'react';
import { Typography, Card, Button, Tooltip, Divider } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { VideoCall } from '@material-ui/icons';
import { LocalModel, Template } from '~/firebase/schema-types';

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      transition: '0.3s',
      boxShadow: theme.shadows[2],

      '&:hover': {
        boxShadow: theme.shadows[4],
      },
    },
    title: {
      flexGrow: 1,
      margin: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

      '& h2': {
        fontWeight: 500,
        fontSize: '1.4rem',
        lineHeight: 2,
        color: theme.palette.grey[900],
      },
    },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.palette.grey[50],
      borderTop: '1px solid ' + theme.palette.grey[200],
      height: 70,

      '& button': {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        marginRight: theme.spacing(2),
        height: 38,
      },

      '& p': {
        color: theme.palette.grey[600],
        marginLeft: theme.spacing(2),
      },
    },
  }),
);

export default function TemplateCard({
  template,
  height,
}: {
  template: LocalModel<Template>;
  height: number;
}) {
  const classes = useStyles();

  return (
    <Card className={classes.card} style={{ height }}>
      <div className={classes.title}>
        <Typography variant="h2">{template.name}</Typography>
      </div>
      <div className={classes.footer}>
        <div>
          <Typography variant="body2">
            <b>{template.activities.length}</b> activities
          </Typography>
          <Typography variant="body2">
            <b>0</b> calls
          </Typography>
        </div>
        <Tooltip title="Start call" placement="left">
          <Button color="secondary" variant="contained">
            <VideoCall />
          </Button>
        </Tooltip>
      </div>
    </Card>
  );
}
