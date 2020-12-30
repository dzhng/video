import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
      transition: theme.transitionTime,

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
  const inputRef = useRef<HTMLInputElement>();

  // everytime template changes, update the name
  // but make sure to not change if still editing (or else we'll get stuttering)
  //
  // NOTE: there is a bug here where if the template changes to a completely different
  // one (e.g. changing pages), and the component doesn't mount, the old name will
  // still remain if the user is in the middle of editing. However in the current
  // flow this will never happen so not worth the effort to fix.
  useEffect(() => {
    if (template && document.activeElement !== inputRef.current) {
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
        <InputBase
          inputRef={inputRef}
          className={classes.titleInput}
          value={name}
          onChange={handleNameChange}
        />
      ) : (
        <Skeleton component="h2" width={200} />
      )}
    </div>
  );
}
