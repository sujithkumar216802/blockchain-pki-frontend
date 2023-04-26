import { ethers } from "ethers";
import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import pkiJson from '../contracts/PKI.json';
import InfoEntryPage from '../components/InfoEntry';
import './ConnectToContractPage.css';

function ConnectToContractPage() {

    const correspondingStatus = {
        0: 'Pending',
        1: 'Issued',
        2: 'Revoked',
        3: 'Rejected',
        4: 'Expired',
    }

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

    // eslint-disable-next-line
    const [accounts, setAccounts] = useState([]);
    const [contractDetails, setContractDetails] = useState({
        contractAddress: '',
        contract: null,
        isOwner: false,
    });
    const defaultRenderInfo = { 'renderOption': 'getCertificateStatus', 'status': '', 'serialNumber': '', 'isPendingCertificate': false, 'isPendingCertificateCallDone': false, 'certificate': [], 'loading': false, 'showSerialNumber': false };
    const [renderInfo, setRenderInfo] = useReducer(renderReducer, defaultRenderInfo);

    function renderReducer(state, action) {
        let tempState = { ...state, ...action };
        if ((action.renderOption !== undefined && action.renderOption !== state.renderOption) || action.reset) tempState = defaultRenderInfo;
        if (action.reset) tempState.renderOption = state.renderOption;
        if (action.renderOption !== undefined) tempState.renderOption = action.renderOption;
        switch (tempState.renderOption) {
            case 'requestCertificate':
                break;
            case 'getCertificateStatus':
                break;
            case 'getCertificate':
                break;
            case 'OldestPendingCertificate':
                if (!tempState.isPendingCertificateCallDone) {
                    getPendingCertificate();
                    tempState.loading = true;
                    tempState.isPendingCertificateCallDone = true;
                }
                break;
            case 'revokeCertificate':
                break;
            default:
        }
        console.log('action: ', action);
        console.log('new State: ', tempState);
        return tempState;
    }

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

    // 0x9142A507e93233A51219973C5DBe25E5789D135c
    async function connectToContract() {
        console.log('hekki');
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const abi = pkiJson['abi'];
            const contract = new ethers.Contract(contractDetails.contractAddress, abi, signer);
            const owner = await contract.owner();
            const account = accounts[0];
            setContractDetails({
                contractAddress: contractDetails.contractAddress,
                contract: contract,
                isOwner: owner.toLowerCase() === account.toLowerCase(),
            });
        } catch (err) {
            console.error('error occured while connecting to contract: ', err);
        }
    }

    async function getCertificateStatus(event) {
        event.preventDefault();
        setRenderInfo({ 'loading': true });
        const serialNumber = event.target.serialNumber.value;
        console.log('serialNumber: ', serialNumber);
        try {
            const status = await contractDetails.contract.getCertificateStatus(serialNumber);
            console.log('status: ', status);
            setRenderInfo({ 'renderOption': 'getCertificateStatus', 'status': correspondingStatus[status] });
        } catch (err) {
            console.error('error occured while getting status: ', err);
        }
        setRenderInfo({ 'loading': false });
    }

    async function getCertificate(event) {
        event.preventDefault();
        setRenderInfo({ 'loading': true });
        const serialNumber = event.target.serialNumber.value;
        console.log('serialNumber: ', serialNumber);
        try {
            console.time('Execution Time');
            const certificate = await contractDetails.contract["getCertificate(uint256)"](serialNumber);
            console.timeEnd('Execution Time');
            console.log('certificate: ', certificate);
            setRenderInfo({ 'renderOption': 'getCertificate', 'certificate': certificate });
        }
        catch (err) {
            console.error('error occured while getting certificate: ', err);
        }
        setRenderInfo({ 'loading': false });
    }

    async function getPendingCertificate() {
        try {
            const isPending = await contractDetails.contract.isPendingCertificate();
            console.log('isPending: ', isPending);
            var pendingCertificate = []
            if (isPending) pendingCertificate = await contractDetails.contract.getPendingCertificate();
            setRenderInfo({ 'isPendingCertificate': isPending, 'certificate': pendingCertificate });
            // return isPending;
        } catch (err) {
            console.error('error occured while checking pending certificate: ', err);
        }
        setRenderInfo({ 'loading': false });
    }

    async function issuePendingCertificate(event) {
        event.preventDefault();
        setRenderInfo({ 'loading': true });
        try {
            if (renderInfo.certificate[index['basicConstraints']['isCA']] === 'true') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const abi = pkiJson['abi'];
                const bytecode = pkiJson['bytecode'];
                const PKI = new ethers.ContractFactory(abi, bytecode, signer);
                const subCacontract = await PKI.deploy();
                await subCacontract.deployed();
                console.log('Contract Address: ', subCacontract.address);
                console.log('Owner: ', await subCacontract.owner());
                console.log('Account : ', accounts[0]);

                let tx = await contractDetails.contract.issuePendingCertificate(event.target.signature.value, subCacontract.address);
                await tx.wait();

                const tempSubCaCertificate = await contractDetails.contract["getCertificate(uint256)"](renderInfo.certificate[index['miscellaneous']['serialNumber']]);
                tx = await subCacontract.populateCaCertificate(tempSubCaCertificate);
                await tx.wait();

                tx = await subCacontract.transferOwnership(renderInfo.certificate[index['extensions']['subjectAddress']]);
                await tx.wait();
                console.log('Owner: ', await subCacontract.owner());
            }
            else {
                let tx = await contractDetails.contract.issuePendingCertificate(event.target.signature.value, "");
                await tx.wait();
            }
            setRenderInfo({ 'showSerialNumber': true, 'serialNumber': renderInfo.certificate[index['miscellaneous']['serialNumber']] });
        }
        catch (err) {
            console.error('error occured: ', err);
        }
        setRenderInfo({ 'loading': false });
    }

    async function rejectPendingCertificate(event) {
        setRenderInfo({ 'loading': true });
        event.preventDefault();
        try {
            let tx = await contractDetails.contract.rejectPendingCertificate();
            await tx.wait();
            setRenderInfo({ 'showSerialNumber': true, 'serialNumber': renderInfo.certificate[index['miscellaneous']['serialNumber']] });
        } catch (err) {
            console.error('error occured while checking pending certificate: ', err);
        }
        setRenderInfo({ 'loading': false });
    }

    async function revokeCertificate(event) {
        event.preventDefault();
        setRenderInfo({ 'loading': true });
        try {
            const serialNumber = event.target.serialNumber.value;
            console.log('serialNumber: ', serialNumber);
            const tx = await contractDetails.contract.revokeCertificate(serialNumber);
            await tx.wait();
            console.log('certificate revoked');
            setRenderInfo({ 'showSerialNumber': true, 'serialNumber': renderInfo.certificate[index['miscellaneous']['serialNumber']] });
        }
        catch (err) {
            console.error('error occured while revoking certificate: ', err);
        }
        setRenderInfo({ 'loading': false });
    }

    async function requestCertificate(formValues) {
        setRenderInfo({ 'loading': true });
        try {
            const tx = await contractDetails.contract.requestCertificate(formValues);
            const recipt = await tx.wait();
            const certificateRequestedEvent = recipt.events.find(event => event.event === "CertificateRequested");
            const serialNumber = certificateRequestedEvent.args.serialNumber.toNumber();
            console.log('serialNumber: ', serialNumber);
            setRenderInfo({ 'showSerialNumber': true, 'serialNumber': serialNumber });
        } catch (err) {
            console.error('error occured while requesting certificate: ', err);
        }
        setRenderInfo({ 'loading': false });
    }

    function renderSwitch() {
        if (renderInfo.loading) {
            return (<div className="loadingWrapper">Loading...</div>);
        }

        console.log('renderOption: ', renderInfo);

        switch (renderInfo.renderOption) {
            case 'requestCertificate':
                if (renderInfo.showSerialNumber) return (
                    <div>
                        <p>Serial Number: {renderInfo.serialNumber}</p>
                        <button onClick={() => setRenderInfo({ 'reset': true })}>Reset</button>
                    </div>);
                return <InfoEntryPage key='user' type='user' handleSubmit={requestCertificate} />;
            case 'getCertificateStatus':
                return (
                    <form onSubmit={getCertificateStatus}>
                        <div className="inputWrapper">
                            <label htmlFor="serialNumber">Serial No. : </label>
                            <input key="getCertificateStatus" type="number" id="serialNumber" value={renderInfo.serialNumber} onChange={(event) => setRenderInfo({ 'serialNumber': event.target.value })} required />
                        </div>
                        <button type="submit">Get Certificate Status</button>
                        {renderInfo.status !== '' ? <p>Status: {renderInfo.status}</p> : null}
                    </form>);
            case 'getCertificate':
                return (
                    <React.Fragment>
                        <form onSubmit={getCertificate}>
                            <div className="inputWrapper">
                                <label htmlFor="serialNumber">Serial No. : </label>
                                <input key="getCertificate" type="number" id="serialNumber" value={renderInfo.serialNumber} onChange={(event) => setRenderInfo({ 'serialNumber': event.target.value })} required />
                            </div>
                            <button type="submit">Get Certificate</button>
                        </form>
                        {renderInfo.certificate.length !== 0 ? <InfoEntryPage key='view' type='view' viewFormValues={renderInfo.certificate} handleSubmit={requestCertificate} /> : null}
                    </React.Fragment>
                );
            case 'OldestPendingCertificate':
                if (renderInfo.isPendingCertificate) {
                    if (renderInfo.showSerialNumber) {
                        return (
                            <React.Fragment>
                                <div>Completed. Check Status of Serial Number {renderInfo.serialNumber}</div>
                                <button onClick={() => setRenderInfo({ 'reset': true })}>Reset</button>
                            </React.Fragment>);
                    }
                    return (
                        <div>
                            <InfoEntryPage type='view' viewFormValues={renderInfo.certificate} handleSubmit={requestCertificate} />
                            <form onSubmit={issuePendingCertificate}>
                                <div className="inputWrapper">
                                    <label htmlFor="signature">Signature: </label>
                                    <input key="OldestPendingCertificate" type="text" id="signature" required />
                                </div>
                                <button type="submit">Issue</button>
                                <button onClick={rejectPendingCertificate}>Reject</button>
                            </form>
                        </div>
                    )
                }
                else {
                    return <div>No Pending Cerficates</div>;
                }
            case 'revokeCertificate':
                if (renderInfo.showSerialNumber) {
                    return (
                        <React.Fragment>
                            <div>Completed. Check Status of Serial Number {renderInfo.serialNumber}</div>
                            <button onClick={() => setRenderInfo({ 'reset': true })}>Reset</button>
                        </React.Fragment>
                    );
                }
                return (
                    <form onSubmit={revokeCertificate}>
                        <div className="inputWrapper">
                            <label htmlFor="serialNumber">Serial No. : </label>
                            <input key="revokeCertificate" type="number" id="serialNumber" value={renderInfo.serialNumber} onChange={(event) => setRenderInfo({ 'serialNumber': event.target.value })} required />
                        </div>
                        <button type="submit">Revoke Certificate</button>
                    </form>);
            default:
                return null;
        }
    }

    return (
        <div id="ConnectToContract">
            <h1>Contract</h1>
            {contractDetails.contract == null ?
                <div className="inputWrapper">
                    <label htmlFor="contractAddress">Contract Address</label>
                    <input type="text" id="contractAddress" value={contractDetails.contractAddress} onChange={(event) => setContractDetails({ ...contractDetails, 'contractAddress': event.target.value })} />
                    <button onClick={connectToContract}>Connect</button>
                </div> :
                <div id="ConnectToContract">
                    <p>Contract Address: {contractDetails.contract.address}</p>
                    <form onChange={(event) => setRenderInfo({ 'renderOption': event.target.value })}>
                        <div className="inputWrapper">
                            <label className="wideLabel" htmlFor="getCertificateStatus">Get Certificate Status</label>
                            <input checked={renderInfo.renderOption === "getCertificateStatus"} type="radio" value="getCertificateStatus" id="getCertificateStatus" name="option" />
                        </div>
                        <div className="inputWrapper">
                            <label className="wideLabel" htmlFor="getCertificate">Get Certificate</label>
                            <input checked={renderInfo.renderOption === "getCertificate"} type="radio" id="getCertificate" value="getCertificate" name="option" />
                        </div>
                        {contractDetails.isOwner ?
                            <React.Fragment>
                                <div className="inputWrapper">
                                    <label className="wideLabel" htmlFor="OldestPendingCertificate">Get Oldest Pending Certificate</label>
                                    <input checked={renderInfo.renderOption === "OldestPendingCertificate"} type="radio" id="OldestPendingCertificate" value="OldestPendingCertificate" name="option" />
                                </div>
                                <div className="inputWrapper">
                                    <label className="wideLabel" htmlFor="revokeCertificate">Revoke Certificate</label>
                                    <input checked={renderInfo.renderOption === "revokeCertificate"} type="radio" id="revokeCertificate" value="revokeCertificate" name="option" />
                                </div>
                            </React.Fragment>
                            : <div className="inputWrapper">
                                <label className="wideLabel" htmlFor="requestCertificate">Request Certificate</label>
                                <input checked={renderInfo.renderOption === "requestCertificate"} type="radio" id="requestCertificate" value="requestCertificate" name="option" />
                            </div>}
                    </form>
                    {renderSwitch()}
                </div>
            }
        </div>
    );
}

export default ConnectToContractPage;
