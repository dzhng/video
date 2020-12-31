import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Collections, LocalModel, Template } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';
import withPrivateRoute from '~/components/PrivateRoute/withPrivateRoute';
import LoadingContainer from '~/containers/Loading/Loading';
import EditContainer from '~/containers/EditTemplate/EditTemplate';

export default withPrivateRoute(function CallEditPage() {
  const router = useRouter();
  const [template, setTemplate] = useState<LocalModel<Template>>();

  const templateId = String(router.query.slug);

  useEffect(() => {
    const unsubscribe = db
      .collection(Collections.TEMPLATES)
      .doc(templateId)
      .onSnapshot((result) => {
        setTemplate({
          id: result.id,
          ...(result.data() as Template),
        });
      });

    return unsubscribe;
  }, [templateId]);

  return template ? <EditContainer template={template} /> : <LoadingContainer />;
});
