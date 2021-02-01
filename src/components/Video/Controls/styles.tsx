import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),

      '&.Mui-disabled': {
        backgroundColor: theme.palette.grey[300],
      },

      // if small screen, have smaller buttons so they can all fit
      [theme.breakpoints.down('xs')]: {
        width: 40,
        height: 40,
      },
    },
  }),
);
