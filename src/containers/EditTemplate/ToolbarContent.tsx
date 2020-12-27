import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as Yup from 'yup';
import { debounce } from 'lodash';
import { Skeleton } from '@material-ui/lab';
import { InputBase } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import { Collections, LocalModel, Template } from '~/firebase/schema-types';

const NameSchema = Yup.string().min(1, 'Too Short!').max(50, 'Too Long!').required();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarContent: {
      display: 'flex',
      alignItems: 'center',
      width: '30%',
      minWidth: 200,
    },
    titleInput: {
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
  }),
);

export default function ToolbarContent({ template }: { template?: LocalModel<Template> }) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const { markIsWriting } = useAppState();

  useEffect(() => {
    if (template) {
      setName(template.name);
    }
  }, [template, setName]);

  const debouncedSaveName = useMemo(() => {
    if (!template) {
      return;
    }

    const saveName = (newName: string) => {
      db.collection(Collections.TEMPLATES).doc(template.id).update({ name: newName });
      markIsWriting();
    };

    return debounce(saveName, 200, { maxWait: 2000, trailing: true });
  }, [template, markIsWriting]);

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
    <div className={classes.toolbarContent}>
      {template ? (
        <InputBase className={classes.titleInput} value={name} onChange={handleNameChange} />
      ) : (
        <Skeleton component="h2" width={200} />
      )}
    </div>
  );
}
