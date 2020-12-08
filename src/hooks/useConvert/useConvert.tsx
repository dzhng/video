import { useCallback } from 'react';
import fetch from 'isomorphic-unfetch';
import useConvertToken from './useConvertToken';

const buildEndpoint = (from: string, to: string, token: string) =>
  `https://v2.convertapi.com/convert/${from}/to/${to}?StoreFile=true&Token=${token}`;

export interface ConvertResultFile {
  FileName: string;
  FileExt: string;
  FileSize: number;
  FileId: string;
  Url: string;
}

export interface ConvertResult {
  ConversionCost: number;
  Files: ConvertResultFile[];
}

export default function useConvert() {
  const { token, isFetchingToken } = useConvertToken();

  const convert = useCallback(
    async (from: string, to: string, file: File): Promise<ConvertResultFile[] | undefined> => {
      if (!(token && !isFetchingToken)) {
        console.warn('Token is not ready for conversion');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(buildEndpoint(from, to, token), {
        method: 'POST',
        body: formData,
      });

      if (response.status !== 200) {
        console.warn('Invalid conversion result');
        return;
      }

      const results: ConvertResult = await response.json();
      return results.Files;
    },
    [token, isFetchingToken],
  );

  return { convert, isPreparing: isFetchingToken };
}
