import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Grid, Typography, Divider, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Presentation } from '~/firebase/schema-types';
import firebase, { storage } from '~/utils/firebase';
import { formatDate } from '~/utils';

interface Props {
  presentation: Presentation;
  removePresentation(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: theme.spacing(1),
    },
    imageGridItem: {
      paddingRight: theme.spacing(2),
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.grey[900],
    },
    name: {},
    info: {},
  }),
);

export default function Preview({ presentation, removePresentation }: Props) {
  const classes = useStyles();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const previewImage = presentation.slides[0];
  const isHostedImage = previewImage.startsWith('http');

  useEffect(() => {
    if (isHostedImage) {
      setImageUrl(previewImage);
      return;
    }

    // if the image is not hosted, it must be a google storage file id
    storage
      .ref(previewImage)
      .getDownloadURL()
      .then((url) => setImageUrl(url));
  }, [previewImage, isHostedImage]);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={8} className={classes.imageGridItem}>
        <div className={classes.imageContainer}>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Presentation preview"
              layout="fill"
              objectFit="contain"
              quality={100}
            />
          )}
        </div>
      </Grid>

      <Grid item xs={4}>
        <Typography variant="body2" className={classes.name}>
          {presentation.name}
        </Typography>
        <br />
        <Divider />
        <br />
        <Typography variant="body2" className={classes.info}>
          Total slides: {presentation.slides.length}
        </Typography>
        <Typography variant="body2" className={classes.info}>
          Uploaded: {formatDate((presentation.createdAt as firebase.firestore.Timestamp).toDate())}
        </Typography>
        <br />
        <Divider />
        <br />
        <Button variant="outlined" color="secondary" onClick={removePresentation}>
          Change
        </Button>
      </Grid>
    </Grid>
  );
}
