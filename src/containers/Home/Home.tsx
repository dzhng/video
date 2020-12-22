import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import Link from 'next/link';

import { LocalModel, Template } from '~/firebase/schema-types';
import TemplateCard from './TemplateCard';

interface PropTypes {
  templates: LocalModel<Template>[];
  isLoading: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    grid: {
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    divider: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    createButtonItem: {
      textAlign: 'right',
    },
  }),
);

export default function Home({ templates, isLoading }: PropTypes) {
  const classes = useStyles();

  const loadingSkeletons = [0, 1, 2].map((key) => (
    <Grid item xs={3} key={key}>
      <Skeleton variant="rect" height={200} />
    </Grid>
  ));

  return (
    <>
      <Grid container className={classes.grid} spacing={3}>
        <Grid item xs={9}>
          <Typography variant="h4">Templates</Typography>
        </Grid>

        <Grid item xs={3} className={classes.createButtonItem}>
          <Link href="/template/create">
            <Button color="primary" variant="contained" size="large">
              Create Template
            </Button>
          </Link>
        </Grid>

        {isLoading
          ? loadingSkeletons
          : templates.map((template) => (
              <Grid item xs={3} key={template.id}>
                <Link href={`/template/${template.id}`}>
                  {/* Need to wrap Card in div since Link doesn't work with functional components. See: https://github.com/vercel/next.js/issues/7915 */}
                  <div>
                    <TemplateCard template={template} />
                  </div>
                </Link>
              </Grid>
            ))}
      </Grid>
    </>
  );
}
