import { useState, useEffect } from 'react';

export default function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = () =>
      navigator.mediaDevices.enumerateDevices().then((newDevices) => setDevices(newDevices));
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  return devices;
}
