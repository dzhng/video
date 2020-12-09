import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Typography, Paper, CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Presentation } from '~/firebase/schema-types';
import { storage } from '~/utils/firebase';

interface Props {
  data: Presentation;
  removePresentation(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imageContainer: {},
  }),
);

export default function Preview({ data, removePresentation }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const previewImage = data.slides[0];
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
    <>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Presentation preview"
          layout="fill"
          objectFit="contain"
          quality={100}
        />
      )}
    </>
  );
}
