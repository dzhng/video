import React, { useState, useEffect, useCallback, useRef } from 'react';
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
      width: '100%',
      height: '100%',
      // need relative position here since Image is absolute positioned
      position: 'relative',
      backgroundColor: 'black',
    },
    show: {
      opacity: 1,
      transition: theme.transitionTime,
    },
    hide: {
      opacity: 0,
    },
  }),
);

const sizesProp = `
  (-webkit-min-device-pixel-ratio: 2) 50vw,
  (min-resolution: 192dpi) 50vw,
  (min-resolution: 2dppx) 50vw,
  (-webkit-min-device-pixel-ratio: 3) 33.33vw,
  (min-resolution: 288dpi) 33.33vw,
  (min-resolution: 3dppx) 33.33vw,
  100vw
`;

export default function Slide({ slideUrl, className, priority }: PropTypes) {
  const classes = useStyles();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // tracks mount state so that we don't set variables in useEffect
  const isMounted = useRef(true);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

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
      .then((url) => {
        if (isMounted.current) {
          setImageUrl(url);
        }
      });
  }, [slideUrl, isHostedImage]);

  const onLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // make sure to always keep Image in the DOM whenever possible so that slides can be loaded in the background.
  return (
    <div className={clsx(classes.imageContainer, className)}>
      {imageUrl && (
        <Image
          src={imageUrl}
          className={isLoading ? classes.hide : classes.show}
          alt="Presentation preview"
          layout="fill"
          objectFit="contain"
          sizes={sizesProp}
          quality={75}
          loading="eager"
          priority={priority}
          onLoad={onLoad}
        />
      )}

      {isLoading && (
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
