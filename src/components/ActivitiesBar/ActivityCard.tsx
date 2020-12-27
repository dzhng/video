import React, { useState, useRef, useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { debounce } from 'lodash';
import {
  Card,
  Typography,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { MoreVert as MoreIcon } from '@material-ui/icons';
import { useAppState } from '~/state';

const NameSchema = Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(1),
      cursor: 'pointer',

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
      transition: '0.3s',

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
    },
  }),
);

export default function ActivitiesCard() {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState('Activity name');
  const anchorRef = useRef<HTMLDivElement>(null);
  const { markIsWriting } = useAppState();

  const handleSettingsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMenuOpen((state) => !state);
  };

  const debouncedSaveName = useMemo(() => {
    const saveName = (newName: string) => {
      //db.collection(Collections.TEMPLATES).doc(template.id).update({ name: newName });
      markIsWriting();
    };

    return debounce(saveName, 200, { maxWait: 2000, trailing: true });
  }, [markIsWriting]);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      // if not valid, just don't set
      if (!NameSchema.isValidSync(newName)) {
        return;
      }

      setName(newName);
      debouncedSaveName && debouncedSaveName(newName);
    },
    [debouncedSaveName],
  );

  return (
    <Card className={classes.card}>
      <div className={classes.content}>
        <InputBase className={classes.nameInput} value={name} onChange={handleNameChange} />
        <Typography variant="body1" className={classes.activityType}>
          presentation
        </Typography>
      </div>
      <div ref={anchorRef} className={classes.buttonContainer}>
        <IconButton onClick={handleSettingsClick}>
          <Tooltip title="Settings" placement="bottom">
            <MoreIcon />
          </Tooltip>
        </IconButton>
        <Menu
          open={menuOpen}
          onClose={() => setMenuOpen((state) => !state)}
          anchorEl={anchorRef.current}
        >
          <MenuItem>Delete Activity</MenuItem>
        </Menu>
      </div>
    </Card>
  );
}
