import Link from 'next/link';
import MintingApp from '../components/Elements/MintingApp/MintingApp';
import { IWalletWrapper } from '../components/Elements/WalletWrapper/WalletWrapper';
import Layout from '../components/layout';
import css from './index.module.css';

interface IHomeProps extends IWalletWrapper {

}

export default function Home(props:IHomeProps) {

    let connected = props.signer !== null;

    let app = connected ? <MintingApp /> : <button onClick={props.connectToWallet}>Connect</button>;

    return (
        <Layout>
            <div className="wrapper-main">
                <main className="container-main">
                    <img className={css.img} src='/images/mutant-logo.png' />
                    <h1 className={css.title}>Mutant Staking App</h1>
                    
                    <div className={css.wrapper}>
                        <div className={`${css.container}`}>
                            <div>
                                One mutant costs... MR or 5 matic.
                            </div>
                            <div>
                                {app}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </Layout>
    )
}
