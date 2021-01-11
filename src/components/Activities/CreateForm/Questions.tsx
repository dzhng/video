import React from 'react';
import { TextField } from 'formik-material-ui';
import { Field, FieldArray, useFormikContext } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { InputAdornment, IconButton, Tooltip, Button, Divider } from '@material-ui/core';
import { ClearOutlined as DeleteIcon, AddOutlined as AddIcon } from '@material-ui/icons';
import { QuestionsActivityMetadata } from '~/firebase/schema-types';
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

const questionsFieldName = 'questions';

export default function CreateQuestionsActivity() {
  const classes = useStyles();
  const { values } = useFormikContext<QuestionsActivityMetadata>();

  return (
    <div>
      <FieldArray name={questionsFieldName}>
        {({ remove, push }) => (
          <>
            {values.questions.map((_, index) => (
              <div key={index}>
                <Field
                  fullWidth
                  component={TextField}
                  name={`${questionsFieldName}.${index}`}
                  multiline
                  rows={2}
                  rowsMax={4}
                  variant="outlined"
                  margin="dense"
                  placeholder="Enter the questions you want to ask during the call"
                  InputProps={{
                    endAdornment: values.questions.length > 1 && (
                      <InputAdornment position="end">
                        <Tooltip title="Delete question" placement="bottom">
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
              <AddIcon /> Add Question
            </Button>
          </>
        )}
      </FieldArray>

      <Divider className={classes.divider} />

      <SwitchControl
        name="allowMultipleSubmissions"
        title="Allow participants to submit multiple answers"
        description="By default, a participant can only submit one answer per question. We allow any participant to delete their previous submission in order to revise it."
      />
      <SwitchControl
        name="allowAnonymousSubmission"
        title="Allow participants to submit anonymously"
      />
    </div>
  );
}
