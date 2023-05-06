import React, { useState, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import index from '../utils/index';
import InfoEntryPage from '../components/InfoEntry';
import './ConnectToContractPage.css';
import { connect, deploy } from "../utils/ContractUtils";

function ConnectToContractPage() {

    const correspondingStatus = {
        0: 'Pending',
        1: 'Issued',
        2: 'Revoked',
        3: 'Rejected',
        4: 'Expired',
    };

    const [accounts, setAccounts] = useState([]);
    const [contractDetails, setContractDetails] = useState({
        contractAddress: '',
        contract: null,
        isOwner: false,
    });
    const defaultRenderInfo = { 'renderOption': 'getCertificateStatus', 'status': '', 'serialNumber': '', 'isPendingCertificate': false, 'isPendingCertificateCallDone': false, 'certificate': [], 'certificateFile': '', 'loading': false, 'showSerialNumber': false };
    const [renderInfo, setRenderInfo] = useReducer(renderReducer, defaultRenderInfo);

    function renderReducer(state, action) {
        let newState = { ...state, ...action };
        if (action.renderOption !== undefined || action.reset) newState = defaultRenderInfo; // changing render or resetting the same render
        if (action.reset) newState.renderOption = state.renderOption;  // preserving renderOption while resetting
        if (action.renderOption !== undefined) newState.renderOption = action.renderOption; // changing render
        if (newState.renderOption === 'OldestPendingCertificate' && !newState.isPendingCertificateCallDone) {
            getPendingCertificate();
            newState.loading = true;
            newState.isPendingCertificateCallDone = true;
        }
        console.log('action: ', action);
        console.log('new State: ', newState);
        return newState;
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

    // 0x38ec061548842e5901CC53Aa5a6D135412a6f999
    async function connectToContract() {
        setRenderInfo({ 'loading': true });
        try {
            const contract = connect(contractDetails.contractAddress);
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
        setRenderInfo({ 'loading': false });
    }

    async function getCertificateStatus(event) {
        event.preventDefault();
        setRenderInfo({ 'loading': true });
        const serialNumber = event.target.serialNumber.value;
        console.log('serialNumber: ', serialNumber);
        try {
            const status = await contractDetails.contract.getCertificateStatus(serialNumber);
            console.log('status: ', status);
            setRenderInfo({ 'status': correspondingStatus[status] });
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
            const certificate = await contractDetails.contract["getCertificate(uint256)"](serialNumber);
            console.log('certificate: ', certificate);
            setRenderInfo({ 'certificate': certificate });
        }
        catch (err) {
            console.error('error occured while getting certificate: ', err);
        }
        setRenderInfo({ 'loading': false });
    }

    async function getCertificatePEM(event) {
        event.preventDefault();
        setRenderInfo({ 'loading': true });
        const serialNumber = event.target.serialNumber.value;
        console.log('serialNumber: ', serialNumber);
        try {
            const certificate = await contractDetails.contract["getCertificateFile(uint256)"](serialNumber);
            console.log('certificateFile: ', certificate);
            setRenderInfo({ 'certificateFile': certificate });
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
                const subCacontract = await deploy();
                console.log('Contract Address: ', subCacontract.address);
                console.log('Owner: ', await subCacontract.owner());
                console.log('Account : ', accounts[0]);

                let tx = await contractDetails.contract.issuePendingCertificate(event.target.signature.value, subCacontract.address, event.target.subjectKeyIdentifier.value, event.target.certificate.value);
                await tx.wait();

                const tempSubCaCertificate = await contractDetails.contract["getCertificate(uint256)"](renderInfo.certificate[index['miscellaneous']['serialNumber']]);
                tx = await subCacontract.populateCaCertificate(tempSubCaCertificate, event.target.certificate.value);
                await tx.wait();

                tx = await subCacontract.transferOwnership(renderInfo.certificate[index['extensions']['subjectWalletAddress']]);
                await tx.wait();
                console.log('Owner: ', await subCacontract.owner());
            }
            else {
                let tx = await contractDetails.contract.issuePendingCertificate(event.target.signature.value, "", event.target.subjectKeyIdentifier.value, event.target.certificate.value);
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
            case 'getCertificatePEM':
                return (
                    <form onSubmit={getCertificatePEM}>
                        <div className="inputWrapper">
                            <label htmlFor="serialNumber">Serial No. : </label>
                            <input key="getCertificatePEM" type="number" id="serialNumber" value={renderInfo.serialNumber} onChange={(event) => setRenderInfo({ 'serialNumber': event.target.value })} required />
                        </div>
                        <button type="submit">Get Certificate in PEM format</button>
                        {renderInfo.certificateFile !== '' ? <p>Certificate: <br></br>{renderInfo.certificateFile}</p> : null}
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

                                <div className="inputWrapper">
                                    <label htmlFor="subjectKeyIdentifier">Subject Key Identifier: </label>
                                    <input type="text" id="subjectKeyIdentifier" required />
                                </div>

                                <div className="inputWrapper">
                                    <label htmlFor="certificate">Certificate(PEM): </label>
                                    <textarea className="pemInput" type="text" id="certificate" required />
                                </div>
                                <button type="submit">Issue</button>
                                <button onClick={rejectPendingCertificate}>Reject</button>
                            </form>
                        </div>
                    )
                }
                else {
                    return (
                        <React.Fragment>
                            <div>No Pending Cerficates</div>
                            <button onClick={() => setRenderInfo({ 'reset': true })}>Reload</button>
                        </React.Fragment>);
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
                <React.Fragment>
                    {renderInfo.loading ?
                        <div className="loadingWrapper">Loading...</div> :
                        <div className="inputWrapper">
                            <label htmlFor="contractAddress">Contract Address</label>
                            <input type="text" id="contractAddress" value={contractDetails.contractAddress} onChange={(event) => setContractDetails({ ...contractDetails, 'contractAddress': event.target.value })} />
                            <button onClick={connectToContract}>Connect</button>
                        </div>
                    }
                </React.Fragment> :
                <div id="ConnectToContract">
                    <p>Contract Address: {contractDetails.contract.address}</p>
                    <form onChange={(event) => setRenderInfo({ 'renderOption': event.target.value })}>
                        <div className="inputWrapper">
                            <label className="wideLabel" htmlFor="getCertificateStatus">Get Certificate Status</label>
                            <input checked={renderInfo.renderOption === "getCertificateStatus"} type="radio" value="getCertificateStatus" id="getCertificateStatus" name="option" disabled={renderInfo.loading} />
                        </div>
                        <div className="inputWrapper">
                            <label className="wideLabel" htmlFor="getCertificate">Get Certificate</label>
                            <input checked={renderInfo.renderOption === "getCertificate"} type="radio" id="getCertificate" value="getCertificate" name="option" disabled={renderInfo.loading} />
                        </div>
                        <div className="inputWrapper">
                            <label className="wideLabel" htmlFor="getCertificatePEM">Get Certificate (PEM)</label>
                            <input checked={renderInfo.renderOption === "getCertificatePEM"} type="radio" id="getCertificatePEM" value="getCertificatePEM" name="option" disabled={renderInfo.loading} />
                        </div>
                        {contractDetails.isOwner ?
                            <React.Fragment>
                                <div className="inputWrapper">
                                    <label className="wideLabel" htmlFor="OldestPendingCertificate">Get Oldest Pending Certificate</label>
                                    <input checked={renderInfo.renderOption === "OldestPendingCertificate"} type="radio" id="OldestPendingCertificate" value="OldestPendingCertificate" name="option" disabled={renderInfo.loading} />
                                </div>
                                <div className="inputWrapper">
                                    <label className="wideLabel" htmlFor="revokeCertificate">Revoke Certificate</label>
                                    <input checked={renderInfo.renderOption === "revokeCertificate"} type="radio" id="revokeCertificate" value="revokeCertificate" name="option" disabled={renderInfo.loading} />
                                </div>
                            </React.Fragment>
                            : <div className="inputWrapper">
                                <label className="wideLabel" htmlFor="requestCertificate">Request Certificate</label>
                                <input checked={renderInfo.renderOption === "requestCertificate"} type="radio" id="requestCertificate" value="requestCertificate" name="option" disabled={renderInfo.loading} />
                            </div>
                        }
                    </form>
                    {renderSwitch()}
                </div>
            }
        </div>
    );
}

export default ConnectToContractPage;
