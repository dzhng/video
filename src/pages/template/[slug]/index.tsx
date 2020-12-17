import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { Collections, Template } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import { useAppState } from '~/state';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import LoadingContainer from '~/containers/Loading/Loading';
import EditContainer from '~/containers/EditTemplate/EditTemplate';

export default withPrivateRoute(function CallEditPage() {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const { markIsWriting } = useAppState();

  const templateId = String(router.query.slug);

  useEffect(() => {
    const unsubscribe = db
      .collection(Collections.TEMPLATES)
      .doc(templateId)
      .onSnapshot((result) => {
        setTemplate(result.data() as Template);
      });

    return unsubscribe;
  }, [templateId]);

  const save = useCallback(
    (values: Template) => {
      console.log('Saving:', template);
      db.collection(Collections.TEMPLATES).doc(templateId).update(values);

      markIsWriting();
      router.push('/');
    },
    [templateId, template, markIsWriting, router],
  );

  return template ? <EditContainer template={template} save={save} /> : <LoadingContainer />;
});
