import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import index from '../utils/index';
import InfoEntryPage from '../components/InfoEntry';
import { deploy } from '../utils/ContractUtils';

function RootCaPage() {

    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(null);

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

    async function handleSubmit(formValues, pem) {
        setLoading(true);
        // check values
        // end check values
        try {
            const contract = await deploy();
            console.log('Contract Address: ', contract.address);
            console.log('Owner: ', await contract.owner());
            console.log('Account : ', accounts[0]);
            formValues[index["extensions"]["contractAddress"]] = contract.address;
            formValues[index["extensions"]["subjectWalletAddress"]] = accounts[0];

            const populateCaCertificateTx = await contract.populateCaCertificate(formValues, pem);
            await populateCaCertificateTx.wait();
            console.log('CA Certificate: ', await contract.getCaCertificate());
            setContract(contract);
        }
        catch (err) {
            console.error('error occured while connecting to contract: ', err);
        }
        setLoading(false);
    };

    return (
        <div>
            <h1>Root CA Creation</h1>
            {loading ? <p className="center">Loading...</p> :
                (contract ? <p>Contract Created, Address: {contract.address}</p> : <InfoEntryPage type='root' handleSubmit={handleSubmit} />)
            }
        </div >
    );
}

export default RootCaPage;
