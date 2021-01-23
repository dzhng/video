import { useState, useEffect } from 'react';
import { Collections, LocalModel, Template } from '~/firebase/schema-types';
import { db } from '~/utils/firebase';

// fetches template data from given id
export default function useTemplate(templateId?: string): LocalModel<Template> | null {
  const [data, setData] = useState<LocalModel<Template> | null>(null);

  useEffect(() => {
    if (!templateId) {
      setData(null);
      return;
    }

    // since these are meant to be called often with every template, prioritize cached data, it doesn't matter if it's stale since template data rarely updates
    db.collection(Collections.TEMPLATES)
      .doc(templateId)
      .get({ source: 'cache' })
      .catch(() => {
        // if cache fails, get it again but from server
        return db.collection(Collections.TEMPLATES).doc(templateId).get();
      })
      .then((record) => {
        setData({
          id: record.id,
          ...(record.data() as Template),
        });
      });
  }, [templateId]);

  return data;
}
