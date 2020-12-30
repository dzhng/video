import React from 'react';
import { TextField } from 'formik-material-ui';
import { Field, FieldArray, useFormikContext } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputAdornment, IconButton, Tooltip, Button, Divider } from '@material-ui/core';
import { ClearOutlined as DeleteIcon, AddOutlined as AddIcon } from '@material-ui/icons';
import { PollActivityMetadata } from '~/firebase/schema-types';
import SwitchControl from '~/components/Form/SwitchControl';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      color: theme.palette.error.main,
    },
    divider: {
      margin: theme.spacing(1),
    },
  }),
);

export default function CreatePollActivity() {
  const classes = useStyles();
  const { values } = useFormikContext<PollActivityMetadata>();

  return (
    <div>
      <FieldArray name="options">
        {({ remove, push }) => (
          <>
            {values.options.map((_, index) => (
              <div key={index}>
                <Field
                  fullWidth
                  component={TextField}
                  name={`options.${index}`}
                  variant="outlined"
                  margin="dense"
                  placeholder="Poll option"
                  InputProps={{
                    endAdornment: values.options.length > 1 && (
                      <InputAdornment position="end">
                        <Tooltip title="Delete option" placement="bottom">
                          <IconButton size="small" onClick={() => remove(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            ))}

            <Button color="primary" onClick={() => push('')}>
              <AddIcon /> Add Option
            </Button>
          </>
        )}
      </FieldArray>

      <Divider className={classes.divider} />

      <SwitchControl name="showResultsRightAway" title="Show results right away" />
      <SwitchControl name="isMultipleChoice" title="Multiple choice" />
    </div>
  );
}
