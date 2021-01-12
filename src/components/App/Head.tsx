import NextHead from 'next/head';

const defaultTitle = '';
const defaultDescription = '';
const defaultOGURL = '';
const defaultOGImage = '';

interface HeadProps {
  title?: string;
  description?: string;
  url?: string;
  ogImage?: string;
}

export default function Head({ title, description, url, ogImage }: HeadProps) {
  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{title ?? defaultTitle}</title>
      <meta name="description" content={description ?? defaultDescription} />
      {/* this no longer applies to iOS, Apple disabled user-scalable, and other fixes are janky */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;800&display=swap"
        rel="stylesheet"
      />
      <link rel="icon" href="/favicon.png" />

      <meta property="og:url" content={url ?? defaultOGURL} />
      <meta property="og:title" content={title ?? defaultTitle} />
      <meta property="og:description" content={description ?? defaultDescription} />
      <meta name="twitter:site" content={url ?? defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage ?? defaultOGImage} />
      <meta property="og:image" content={ogImage ?? defaultOGImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* disable scroll bouncing effect on ios */}
      <style>
        {`html, body {
            height: 100%;
            overflow: hidden;
        }`}
      </style>
    </NextHead>
  );
}
