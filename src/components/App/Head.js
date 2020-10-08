import React from 'react';
import NextHead from 'next/head';
import { string } from 'prop-types';
import { useTranslations } from '~/utils/translations';

const defaultDescription = '';
const defaultOGURL = '';
const defaultOGImage = '';

const Head = (props) => {
  const { description, url, ogImage } = props;
  const { t } = useTranslations();

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{t('title')}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;800&display=swap"
        rel="stylesheet"
      />
      <link rel="icon" href="/favicon.ico" />

      <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZWJBGFJE8J" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-ZWJBGFJE8J');
    `,
        }}
      />

      <meta property="og:url" content={url || defaultOGURL} />
      <meta property="og:title" content={t('title')} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta name="twitter:site" content={url || defaultOGURL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage || defaultOGImage} />
      <meta property="og:image" content={ogImage || defaultOGImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    </NextHead>
  );
};

Head.propTypes = {
  description: string,
  url: string,
  ogImage: string,
};

export default Head;
