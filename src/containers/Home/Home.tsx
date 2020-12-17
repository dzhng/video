import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';

import { LocalModel, Template } from '~/firebase/schema-types';
import TemplateCard from './TemplateCard';

interface PropTypes {
  templates: LocalModel<Template>[];
}

const useStyles = makeStyles((theme) =>
  createStyles({
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
      marginTop: theme.spacing(1),
    },
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    createButton: {},
  }),
);

export default function Home({ templates }: PropTypes) {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4">Templates</Typography>
      <Grid container className={classes.grid} spacing={3}>
        {templates.map((template) => (
          <Grid item xs={3} key={template.id}>
            <Link href={`/template/${template.id}`}>
              {/* Need to wrap Card in div since Link doesn't work with functional components. See: https://github.com/vercel/next.js/issues/7915 */}
              <div>
                <TemplateCard template={template} />
              </div>
            </Link>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Link href="/template/create">
            <Button
              color="primary"
              variant="contained"
              size="large"
              className={classes.createButton}
            >
              Create Template
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
}
