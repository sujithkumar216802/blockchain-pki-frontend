import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetaMaskOnboarding from '@metamask/onboarding';
import './LoginPage.css'

function LoginPage() {

    const [buttonFeatures, setButtonFeatures] = useState({
        buttonText: 'Connect to Metamask',
        buttonDisabled: false,
        functionToCall: onboardMetamask
    });
    const navigate = useNavigate();

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

    useEffect(() => {
        onboardMetamask();
        // eslint-disable-next-line
    }, []);

    async function getAccounts() {
        const tempAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Accounts: ', tempAccounts);
        if (tempAccounts.length > 0)
            navigate('/')
        else
            console.log('not logged in to metamask')
    }

    return (
        <React.Fragment>
            <h1>Login</h1>
            <div className="center">
                <button id="loginButton" disabled={buttonFeatures.buttonDisabled} onClick={buttonFeatures.functionToCall} >{buttonFeatures.buttonText}</button>
            </div >
        </React.Fragment>
    );
}

export default LoginPage;