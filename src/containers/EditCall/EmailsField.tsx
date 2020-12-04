import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Paper, InputBase, IconButton } from '@material-ui/core';
import { Add as AddIcon, HighlightOff as RemoveIcon } from '@material-ui/icons';

import { createStyles, makeStyles, styled, Theme } from '@material-ui/core/styles';
import { Field, FieldArray } from 'formik';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemPaper: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    },
    fieldItem: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      backgroundColor: theme.palette.background.default,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
  }),
);

const EmailError = styled('div')(({ theme }) => ({
  color: theme.palette.warning.main,
}));

const EmailFieldItem = ({
  value,
  name,
  index,
  remove,
}: {
  value: string;
  name: string;
  index: number;
  remove(idx: number): void;
}) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={clsx(classes.fieldItem, classes.itemPaper)}>
      <Field
        className={classes.input}
        component={InputBase}
        name={`${name}.${index}`}
        value={value}
        data-testid="email-item"
      />
      <IconButton
        data-testid="remove-button"
        className={classes.iconButton}
        onClick={() => remove(index)}
      >
        <RemoveIcon />
      </IconButton>
    </Paper>
  );
};

const emailSchema = Yup.string().email().required();

const EmailTextField = ({ pushEmail }: { pushEmail(email: string): void }) => {
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submitEmail = useCallback(() => {
    if (emailSchema.isValidSync(text)) {
      pushEmail(text);
      setError(null);
      setText('');
    } else {
      setError('You must provide a valid email');
    }

    // either way, make sure to focus back on input
    inputRef.current?.focus();
  }, [text, setError, pushEmail]);

  return (
    <>
      <Paper variant="outlined" className={classes.itemPaper}>
        <InputBase
          className={classes.input}
          placeholder="Add guests"
          value={text}
          inputRef={inputRef}
          onChange={(e) => setText(e.target.value)}
          data-testid="email-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitEmail();
            }
          }}
        />
        <IconButton data-testid="add-button" className={classes.iconButton} onClick={submitEmail}>
          <AddIcon />
        </IconButton>
      </Paper>
      <EmailError data-testid="email-error">{error}</EmailError>
    </>
  );
};

export default function EmailsField({ name, values }: { name: string; values: string[] }) {
  return (
    <FieldArray name={name}>
      {({ remove, push }) => (
        <>
          {values.map((email, index) => (
            <EmailFieldItem key={index} name={name} value={email} index={index} remove={remove} />
          ))}
          <Field component={EmailTextField} name="email" pushEmail={push} />
        </>
      )}
    </FieldArray>
  );
}
