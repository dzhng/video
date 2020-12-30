import React from 'react';
import { Switch, TextField } from 'formik-material-ui';
import { Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Divider,
  Typography,
} from '@material-ui/core';
import { ClearOutlined as DeleteIcon, AddOutlined as AddIcon } from '@material-ui/icons';
import { PollActivityMetadata } from '~/firebase/schema-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      color: theme.palette.error.main,
    },
    divider: {
      margin: theme.spacing(1),
    },
    switchControl: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.grey[800],
      borderRadius: theme.shape.borderRadius,

      '& .MuiTypography-root': {
        flexGrow: 1,
        marginLeft: theme.spacing(1),
      },

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },
    },
  }),
);

export default function CreatePollActivity() {
  const classes = useStyles();
  const { values } = useFormikContext<PollActivityMetadata>();

  const MyErrorMessage = ({ name }: { name: string }) => (
    <ErrorMessage className={classes.error} name={name} component="span" />
  );

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

      <div className={classes.switchControl}>
        <Typography variant="body1">Show results right away</Typography>
        <Field component={Switch} type="checkbox" name="showResultsRightAway" />
        <MyErrorMessage name="showResultsRightAway" />
      </div>

      <div className={classes.switchControl}>
        <Typography variant="body1">Multiple choice</Typography>
        <Field component={Switch} type="checkbox" name="isMultipleChoice" />
        <MyErrorMessage name="isMultipleChoice" />
      </div>
    </div>
  );
}
