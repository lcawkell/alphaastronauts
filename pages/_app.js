import React from 'react';
import WalletWrapper from '../components/Elements/WalletWrapper/WalletWrapper';
import '../styles/reset.css';
import '../styles/styles.css';

export default function MyApp({Component, pageProps}) {
    return <WalletWrapper component={Component} pageProps={pageProps} ></WalletWrapper>
}