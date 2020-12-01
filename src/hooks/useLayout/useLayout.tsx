import { useState, useEffect } from 'react';

export default function useLayout() {
  const [showLayout, setShowLayout] = useState(true);

  // once the current component unmounts, always go back to showing layout
  useEffect(() => {
    return () => setShowLayout(true);
  }, []);

  return { showLayout, setShowLayout };
}
