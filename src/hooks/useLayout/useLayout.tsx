import { useState, useEffect } from 'react';

export default function useLayout() {
  const [showLayout, setShowLayout] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');

  // once the current component unmounts, always go back to default settings
  useEffect(() => {
    return () => {
      setShowLayout(true);
      setTitle('');
    };
  }, []);

  return { showLayout, setShowLayout, title, setTitle };
}
