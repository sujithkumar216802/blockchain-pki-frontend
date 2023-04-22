import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

function HomePage() {

    const [accounts, setAccounts] = useState([]);

    const navigate = useNavigate();

    async function connectMetaMask() {
        try {
            const tempAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts: ', tempAccounts);
            setAccounts(tempAccounts);
        } catch (err) {
            console.error('error occured while connecting to MetaMask: ', err);
            navigate('/login');
        }
    }

    useEffect(() => {
        connectMetaMask();
        // eslint-disable-next-line
    }, []);

    function toRootCa() {
        navigate('/root');
    }

    function toConnectToContract() {
        navigate('/connect');
    }

    return (
        <div>
            <h1>Home</h1>
            <p>Accounts: {accounts}</p>
            <button onClick={toRootCa}>Become a root CA</button>
            <button onClick={toConnectToContract}>Connect to contract</button>
        </div>
    );
}

export default HomePage;