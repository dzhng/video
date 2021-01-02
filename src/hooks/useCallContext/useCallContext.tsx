import { useContext } from 'react';
import { CallContext } from '~/components/CallProvider';

export default function useVideoContext() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
}
