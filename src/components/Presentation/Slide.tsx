import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { storage } from '~/utils/firebase';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imageContainer: {
      position: 'relative',
      backgroundColor: theme.palette.grey[900],

      // trick to lock this component in 4/3 aspect ratio
      width: '100%',
      height: 0,
      paddingBottom: '75%',
    },
  }),
);

export default function Slide({ slideUrl }: { slideUrl: string }) {
  const classes = useStyles();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const isHostedImage = slideUrl.startsWith('http');

  useEffect(() => {
    if (isHostedImage) {
      setImageUrl(slideUrl);
      return;
    }

    // if the image is not hosted, it must be a google storage file id
    storage
      .ref(slideUrl)
      .getDownloadURL()
      .then((url) => setImageUrl(url));
  }, [slideUrl, isHostedImage]);

  return (
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
  );
}
