import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import pkiJson from '../contracts/PKI.json';
import InfoEntryPage from '../components/InfoEntry';

function RootCaPage() {

    const index = {
        "subject": {
            "commonName": 0,
            "organization": 1,
            "locality": 2,
            "state": 3,
            "country": 4,
        },
        "issuer": {
            "commonName": 5,
            "organization": 6,
            "locality": 7,
            "state": 8,
            "country": 9,
        },
        "validity": {
            "notBefore": 10,
            "notAfter": 11,
        },
        "subjectAltName": {
            "dnsNames": 12,
            "ipAddresses": 13,
            "emailAddresses": 14,
            "uris": 15,
        },
        "publicKeyInfo": {
            "algorithm": 16,
            "keySize": 17,
            "publicKey": 18
        },
        "miscellaneous": {
            "version": 19,
            "serialNumber": 20,
            "signatureAlgorithm": 21,
        },
        "fingerprints": {
            "sha1": 22,
            "_sha256": 23,
        },
        "basicConstraints": {
            "isCA": 24,
            "pathLenConstraint": 25,
        },
        "extensions": {
            "subjectAddress": 26,
            "issuerAddress": 27,
            "blockchainName": 28,
            "caAddress": 29,
        },
        "subjectKeyIdentifier": 30,
        "authorityKeyIdentifier": 31,
        "signature": 32,
    }

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

    async function handleSubmit(formValues) {
        setLoading(true);
        // check values
        // end check values
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const abi = pkiJson['abi'];
            const bytecode = pkiJson['bytecode'];
            const PKI = new ethers.ContractFactory(abi, bytecode, signer);
            const contract = await PKI.deploy();
            await contract.deployed();
            console.log('Contract Address: ', contract.address);
            console.log('Owner: ', await contract.owner());
            console.log('Account : ', accounts[0]);
            formValues[index["extensions"]["caAddress"]] = contract.address;
            formValues[index["extensions"]["issuerAddress"]] = accounts[0];
            formValues[index["extensions"]["subjectAddress"]] = accounts[0];
            const populateCaCertificateTx = await contract.populateCaCertificate(formValues);
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
