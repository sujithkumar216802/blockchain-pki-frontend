import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaMaskOnboarding from '@metamask/onboarding';

function LoginPage() {

    const [metamaskConnected, setMetamaskConnected] = useState(false);
    const [buttonFeatures, setButtonFeatures] = useState({
        buttonText: 'Connect to Metamask',
        buttonDisabled: false,
        functionToCall: onboardMetamask
    });
    const navigate = useNavigate();

    metamaskConnected ? navigate('/') : console.log('Metamask not connected');

    async function onboardMetamask() {
        if (isMetamaskInstalled()) {
            await getAccounts();
        } else {
            console.log('Metamask not installed');
            setButtonFeatures({
                buttonText: 'Install Metamask',
                buttonDisabled: false,
                functionToCall: installMetaMask
            });
        }
    };

    function isMetamaskInstalled() {
        return window.ethereum !== undefined && window.ethereum.isMetaMask;
    }

    function installMetaMask() {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
        setButtonFeatures({
            buttonText: 'Installing Metamask',
            buttonDisabled: true,
            functionToCall: null
        });
    }

    async function getAccounts() {
        const tempAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Accounts: ', tempAccounts);
        if (tempAccounts.length > 0)
            setMetamaskConnected(true);
    }

    return (
        <div>
            <h1>Login</h1>
            <button disabled={buttonFeatures.buttonDisabled} onClick={buttonFeatures.functionToCall} >{buttonFeatures.buttonText}</button>
        </div >
    );
}

export default LoginPage;