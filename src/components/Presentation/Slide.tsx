import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import { storage } from '~/utils/firebase';

interface PropTypes {
  slideUrl: string;
  className?: string;
  priority: boolean;
}

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
    show: {
      visibility: 'visible',
    },
    hide: {
      visibility: 'hidden',
    },
    innerContainer: {
      // this 'fixes' the 0 height div of aspect ratio trick
      position: 'absolute',
      width: '100%',
      height: '100%',

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export default function Slide({ slideUrl, className, priority }: PropTypes) {
  const classes = useStyles();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const onLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // make sure to always keep Image in the DOM whenever possible so that slides can be loaded in the background.
  return (
    <div className={clsx(classes.imageContainer, className)}>
      <div className={classes.innerContainer}>
        {imageUrl && (
          <Image
            src={imageUrl}
            className={isLoading ? classes.hide : classes.show}
            alt="Presentation preview"
            layout="fill"
            objectFit="contain"
            quality={100}
            loading="eager"
            priority={priority}
            onLoad={onLoad}
          />
        )}

        {(!imageUrl || isLoading) && <CircularProgress />}
      </div>
    </div>
  );
}
