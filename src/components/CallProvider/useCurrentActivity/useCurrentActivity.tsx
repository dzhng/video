import { useMemo } from 'react';
import { LocalModel, Template } from '~/firebase/schema-types';

export default function useCurrentActivity(
  template: LocalModel<Template>,
  currentActivityId: string | undefined,
) {
  const currentActivity = useMemo(() => {
    if (currentActivityId) {
      return template.activities.find((activity) => activity.id === currentActivityId);
    }
  }, [template, currentActivityId]);

  return { currentActivity };
}
