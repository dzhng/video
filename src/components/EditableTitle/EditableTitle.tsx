import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { StringSchema } from 'yup';
import { debounce } from 'lodash';
import { Skeleton } from '@material-ui/lab';
import { InputBase } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

type TypographyTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: 'flex',
      alignItems: 'center',
    },
    titleInput: (props: { variant: TypographyTypes }) => ({
      ...theme.typography[props.variant],
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

      '&.Mui-disabled': {
        // keep same colors when disabled (because it'll just be a normal title)
        color: 'inherit',

        // turn off border hover effect
        '&:hover': {
          border: '1px solid transparent',
        },
      },
    }),
  }),
);

export default function EditableTitle({
  title,
  isLoading,
  disabled,
  variant = 'h2',
  validationSchema,
  onChange,
  className,
  debounceChange = true,
}: {
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: TypographyTypes;
  validationSchema: StringSchema;
  onChange(newTitle: string): void;
  className?: string;
  debounceChange?: boolean;
}) {
  const classes = useStyles({ variant });
  const [value, setValue] = useState<string>(title ?? '');
  const inputRef = useRef<HTMLInputElement>();

  // everytime title changes, update the value
  // but make sure to not change if still editing (or else we'll get stuttering)
  //
  // NOTE: there is a bug here where if the title changes to a completely different
  // one (e.g. changing pages), and the component doesn't mount, the old value will
  // still remain if the user is in the middle of editing. However in the current
  // flow this will never happen so not worth the effort to fix.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setValue(title ?? '');
    }
  }, [title, setValue]);

  const debouncedSaveValue = useMemo(() => {
    if (debounceChange) {
      return debounce(onChange, 200, { maxWait: 2000, trailing: true });
    } else {
      return onChange;
    }
  }, [onChange, debounceChange]);

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // if not valid, just don't set
      if (!validationSchema.isValidSync(newValue)) {
        return;
      }

      // if still loading, ignore all change events
      if (isLoading) {
        return;
      }

      setValue(newValue);
      debouncedSaveValue && debouncedSaveValue(newValue);
    },
    [debouncedSaveValue, validationSchema, isLoading],
  );

  return (
    <div className={clsx(classes.content, className)}>
      {isLoading ? (
        <Skeleton component={variant} width="100%" />
      ) : (
        <InputBase
          fullWidth
          disabled={disabled}
          inputRef={inputRef}
          className={classes.titleInput}
          value={value}
          onChange={handleValueChange}
        />
      )}
    </div>
  );
}
