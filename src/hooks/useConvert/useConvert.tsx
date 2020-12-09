import { useCallback } from 'react';
import fetch from 'isomorphic-unfetch';
import useConvertToken from './useConvertToken';

export type fromType = 'pdf' | 'ppt' | 'pptx';
export type toType = 'png' | 'jpg';

const buildEndpoint = (from: fromType, to: toType, token: string) => {
  // there is a big in convert api pdf conversion where in some PDFs it will skip slide, so getting around this by using the thumbnail API which doesn't have the problem.
  return from === 'pdf'
    ? `https://v2.convertapi.com/convert/${from}/to/thumbnail?StoreFile=true&ImageResolution=150&ImageOutputFormat=${to}&Token=${token}`
    : `https://v2.convertapi.com/convert/${from}/to/${to}?StoreFile=true&ImageResolutionH=150&ImageResolutionV=150&Token=${token}`;
};

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
    async (from: fromType, to: toType, file: File): Promise<ConvertResultFile[] | undefined> => {
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

      if (!response.ok) {
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
