import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Paper, InputBase, IconButton } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { Add as AddIcon, HighlightOff as RemoveIcon } from '@material-ui/icons';
import { createStyles, makeStyles, styled, Theme } from '@material-ui/core/styles';
import { Field, FieldArray } from 'formik';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    itemPaper: {
      marginTop: theme.spacing(2),
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
      padding: 3,
      marginRight: theme.spacing(1),
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

interface EmailOptionType {
  title: string;
  inputValue?: string;
}

const emailSchema = Yup.string().email().required();
const filter = createFilterOptions<EmailOptionType>();

const EmailTextField = ({ pushEmail }: { pushEmail(email: string): void }) => {
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>();
  const [inputValue, setInputValue] = useState<string>('hello');
  const [error, setError] = useState<string | null>(null);

  const submitEmail = useCallback(
    (text) => {
      if (emailSchema.isValidSync(text)) {
        pushEmail(text);
        setError(null);
        setInputValue('');
      } else {
        setError('You must provide a valid email');
      }

      // either way, make sure to focus back on input
      inputRef.current?.focus();
    },
    [setError, pushEmail],
  );

  return (
    <>
      <Autocomplete
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        autoHighlight
        inputValue={inputValue}
        options={[] as EmailOptionType[]}
        onChange={(_, newValue) => {
          if (typeof newValue === 'string') {
            submitEmail(newValue);
          } else if (newValue) {
            const email = newValue.inputValue;
            submitEmail(email);
          }
        }}
        onInputChange={(_, value) => setInputValue(value)}
        filterOptions={(options, state) => {
          const filtered = filter(options, state);

          // Suggest the creation of a new value
          if (state.inputValue !== '') {
            filtered.push({
              title: `Add "${state.inputValue}"`,
              inputValue: state.inputValue,
            });
          }

          return filtered;
        }}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.title;
        }}
        renderOption={(option) => (
          <>
            <AddIcon className={classes.iconButton} />
            {option.title}
          </>
        )}
        renderInput={(params) => (
          <Paper variant="outlined" className={classes.itemPaper} ref={params.InputProps.ref}>
            <InputBase
              className={classes.input}
              inputProps={params.inputProps}
              placeholder="Add guests"
              inputRef={inputRef}
              data-testid="email-input"
              onKeyPress={(e) => {
                // prevent auto form submission
                e.key === 'Enter' && e.preventDefault();
              }}
            />
          </Paper>
        )}
      />
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
