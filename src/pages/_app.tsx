import React from 'react';

import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from '../styles/theme';
import 'fontsource-roboto';
import Axios from 'axios';

export default function CustomApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    window.onbeforeunload = () => {
      Axios.post('./api/program/exit')
        .then(() => null)
        .catch(() => null);
      return null;
    }
  }, []);

  return (
    <>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
