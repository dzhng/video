import React, { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@material-ui/lab';
import { useField } from 'formik';

import { Presentation } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import Uploader from './Uploader';
import Preview from './Preview';

export default function PresentationPicker({ name }: { name: string }) {
  const [field, meta, helpers] = useField({
    name,
    type: 'text',
    multiple: false,
  });
  const [isQueryingOrCreating, setIsQueryingOrCreating] = useState(true);
  const [presentationData, setPresentationData] = useState<Presentation | null>(null);

  const { value } = field;
  const { setValue } = helpers;

  useEffect(() => {
    const query = async (presentationId: string) => {
      const doc = await db.collection('presentations').doc(presentationId).get();
      if (doc.exists) {
        setPresentationData(doc.data() as Presentation);
        setIsQueryingOrCreating(false);
      }
    };

    if (value) {
      setIsQueryingOrCreating(true);
      query(value);
    } else {
      setIsQueryingOrCreating(false);
    }
  }, [value]);

  const setData = useCallback(
    (id: string | null, data: Presentation | null) => {
      if (id) {
        setPresentationData(data);
        setValue(id);
      } else {
        setPresentationData(null);
        setValue(undefined, false);
      }
    },
    [setValue],
  );

  return (
    <>
      {isQueryingOrCreating && <Skeleton variant="rect" height={150} animation="wave" />}
      {!presentationData && !isQueryingOrCreating && <Uploader setData={setData} />}
      {presentationData && (
        <Preview presentation={presentationData} removePresentation={() => setData(null, null)} />
      )}
      {meta.error ? <div className="error">{meta.error}</div> : null}
    </>
  );
}
