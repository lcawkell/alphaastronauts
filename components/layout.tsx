import css from './layout.module.css';

import Head from 'next/head';


export default function Layout({ children }) {
    return (
        <div className={css.layout}>

            <Head>
                <title>Alpha Astronauts - Mutant Staking</title>
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <div>
                {children}
            </div>

            <div>

            </div>

        </div>
    )
}