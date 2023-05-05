import './InfoEntry.css'
import React, { useEffect, useReducer, useState } from 'react';

// type: root, user, view
function InfoEntryPage({ type, handleSubmit, viewFormValues }) {
    const preDefinedValues = {
        'root': ['Blockchain Root CA', 'Root CA', 'TRZ', 'TN', 'IN', 'Blockchain Root CA', 'Root CA', 'TRZ', 'TN', 'IN', '1681161711', '1781161711', '', '', '', '', 'Elliptic Curve', '256', '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEsEZJNX3MoIKV6wGhDlDAim6tEzNY\nEHFiXE4Bj3P6E4ByLyhAXBQceh8nWkNV++pR2QJthp1MOU5MjSgDZwP/+Q==\n-----END PUBLIC KEY-----\n', '', '0', '', '', '', 'true', '0', '', '', 'Sepolia', '', '', '', ''],
        'sub': ['Blockchain Sub CA', 'Sub CA', 'TRZ', 'TN', 'IN', '', '', '', '', '', '1681161711', '1781161711', '', '', '', '', 'Elliptic Curve', '256', '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyr22bAfzCodGYy0IdJ4GRxsPpCpC\nU77ryZ2s7G1lU82RC2Cdla8l5kTBqNOv6BWBuvB719D0XYR8AgZYFiMrTA==\n-----END PUBLIC KEY-----\n', '', '', '', '', '', 'true', '0', '', '', 'Sepolia', '', '', '', ''],
        'user': ['Blockchain User 1', 'User', 'TRZ', 'TN', 'IN', '', '', '', '', '', '1681161711', '1781161711', '', '', '', '', 'Elliptic Curve', '256', '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEjDJKkm4hyupJ5TMqvxNQSvrCchaW\nR4V1F8WyChIQOSC4vE3gTWGk9byfs+mkGI+2CsN9iIRJbkchdvBS6qlu6Q==\n-----END PUBLIC KEY-----\n', '', '', '', '', '', 'false', '0', '', '', 'Sepolia', '', '', '', ''],
        'reject': ['Blockchain User 2', 'User', 'TRZ', 'TN', 'IN', '', '', '', '', '', '1681161711', '1781161711', '', '', '', '', 'Elliptic Curve', '256', '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEavg9X1BhphAtCg5phZirIyuDcmbk\n8K2nLxaSLndq3f1mjGGIW0NIxbNPOrK3pfzPqgQoZFkDZznSHbam+Sd0IA==\n-----END PUBLIC KEY-----\n', '', '', '', '', '', 'false', '0', '', '', 'Sepolia', '', '', '', '']
    }

    const keys = ["SubjectCommonName", "SubjectOrganization", "SubjectLocality", "SubjectState", "SubjectCountry", "IssuerCommonName", "IssuerOrganization", "IssuerLocality", "IssuerState", "IssuerCountry", "ValidityNotBefore", "ValidityNotAfter", "DnsNames", "IpAddresses", "EmailAddresses", "URIs", "PublicKeyAlgorithm", "PublicKeySize", "PublicKeyValue", "Version", "SerialNumber", "SignatureAlgorithm", "SHA1", "SHA256", "IsCA", "PathLengthConstraint", "SubjectWalletAddress", "IssuerContractAddress", "BlockchainName", "ContractAddress", "SubjectKeyIdentifier", "AuthorityKeyIdentifier", "Signature"];
    const labels = ["Common Name: ", "Organization: ", "Locality: ", "State: ", "Country: ", "CommonName: ", "Organization: ", "Locality: ", "State: ", "Country: ", "Not Before: ", "Not After: ", "DNS Names: ", "IP Addresses: ", "Email Addresses: ", "URIs: ", "PublicKey Algorithm: ", "PublicKey Size: ", "PublicKey Value(PEM): ", "Version: ", "Serial Number: ", "Signature Algorithm: ", "SHA1: ", "SHA256: ", "Is CA: ", "Path Length Constraint: ", "Subject Address: ", "Issuer Address: ", "Blockchain Name: ", "CA Address: ", "Subject Key Identifier: ", "Authority Key Identifier: ", "Signature: "];

    function formReducer(state, action) {
        if (action.view) return viewFormValues;
        const { index, value, copy } = action;
        if (copy) return preDefinedValues[copy];
        const newState = [...state];
        newState[index] = value;
        if (type === 'root' && index <= 4) newState[index + 5] = value;
        return newState;
    }

    const [formValues, dispatchFormValues] = useReducer(formReducer, ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
    const [pem, setPem] = useState('');

    function submit(event) {
        event.preventDefault();
        if (type === 'root') return handleSubmit(formValues, pem);
        handleSubmit(formValues);
    }

    useEffect(() => {
        if (type === 'view') {
            dispatchFormValues({ 'view': true });
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div id="infoEntry">
            <form onSubmit={submit}>

                <div className="formHeading">Subject</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[0]}>{labels[0]}</label>
                    <input type="text" id={keys[0]} value={formValues[0]} onChange={(event) => dispatchFormValues({ 'index': 0, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[1]}>{labels[1]}</label>
                    <input type="text" id={keys[1]} value={formValues[1]} onChange={(event) => dispatchFormValues({ 'index': 1, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[2]}>{labels[2]}</label>
                    <input type="text" id={keys[2]} value={formValues[2]} onChange={(event) => dispatchFormValues({ 'index': 2, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>


                <div className="inputWrapper">
                    <label htmlFor={keys[3]}>{labels[3]}</label>
                    <input type="text" id={keys[3]} value={formValues[3]} onChange={(event) => dispatchFormValues({ 'index': 3, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[4]}>{labels[4]}</label>
                    <input type="text" id={keys[4]} value={formValues[4]} onChange={(event) => dispatchFormValues({ 'index': 4, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                {type === 'root' ? (
                    <React.Fragment>
                        <div className="formHeading">Issuer</div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[5]}>{labels[5]}</label>
                            <input type="text" id={keys[5]} value={formValues[5]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[6]}>{labels[6]}</label>
                            <input type="text" id={keys[6]} value={formValues[6]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[7]}>{labels[7]}</label>
                            <input type="text" id={keys[7]} value={formValues[7]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[8]}>{labels[8]}</label>
                            <input type="text" id={keys[8]} value={formValues[8]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[9]}>{labels[9]}</label>
                            <input type="text" id={keys[9]} value={formValues[9]} disabled />
                        </div>
                    </React.Fragment>
                ) : null
                }

                <div className="formHeading">Validity</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[10]}>{labels[10]}</label>
                    <input type="text" id={keys[10]} value={formValues[10]} onChange={(event) => dispatchFormValues({ 'index': 10, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[11]}>{labels[11]}</label>
                    <input type="text" id={keys[11]} value={formValues[11]} onChange={(event) => dispatchFormValues({ 'index': 11, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="formHeading">Alternative Names</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[12]}>{labels[12]}</label>
                    <input type="text" id={keys[12]} value={formValues[12]} onChange={(event) => dispatchFormValues({ 'index': 12, 'value': event.target.value })} disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[13]}>{labels[13]}</label>
                    <input type="text" id={keys[13]} value={formValues[13]} onChange={(event) => dispatchFormValues({ 'index': 13, 'value': event.target.value })} disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[14]}>{labels[14]}</label>
                    <input type="text" id={keys[14]} value={formValues[14]} onChange={(event) => dispatchFormValues({ 'index': 14, 'value': event.target.value })} disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[15]}>{labels[15]}</label>
                    <input type="text" id={keys[15]} value={formValues[15]} onChange={(event) => dispatchFormValues({ 'index': 15, 'value': event.target.value })} disabled={type === 'view'} />
                </div>

                <div className="formHeading">PublicKey</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[16]}>{labels[16]}</label>
                    <input type="text" id={keys[16]} value={formValues[16]} onChange={(event) => dispatchFormValues({ 'index': 16, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[17]}>{labels[17]}</label>
                    <input type="text" id={keys[17]} value={formValues[17]} onChange={(event) => dispatchFormValues({ 'index': 17, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[18]}>{labels[18]}</label>
                    <textarea className="pemInput" type="text" id={keys[18]} value={formValues[18]} onChange={(event) => dispatchFormValues({ 'index': 18, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="formHeading">Basic Constraint</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[24]}>{labels[24]}</label>
                    <input type="text" id={keys[24]} value={formValues[24]} onChange={(event) => dispatchFormValues({ 'index': 24, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[25]}>{labels[25]}</label>
                    <input type="text" id={keys[25]} value={formValues[25]} onChange={(event) => dispatchFormValues({ 'index': 25, 'value': event.target.value })} required disabled={type === 'view'} />
                </div>

                {type === 'root' ?
                    <React.Fragment>
                        <div className="formHeading">Other Details</div>
                        <div className="inputWrapper">
                            <label htmlFor={keys[30]}>{labels[30]}</label>
                            <input type="text" id={keys[30]} value={formValues[30]} onChange={(event) => dispatchFormValues({ 'index': 30, 'value': event.target.value })} required />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor={keys[32]}>{labels[32]}</label>
                            <input type="text" id={keys[32]} value={formValues[32]} onChange={(event) => dispatchFormValues({ 'index': 32, 'value': event.target.value })} required />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor='pem'>Certificate File(PEM): </label>
                            <textarea className="pemInput" type="text" id='pem' value={pem} onChange={(event) => setPem(event.target.value)} required />
                        </div>
                    </React.Fragment>
                    : null
                }

                {type !== 'view' ?
                    <button type="submit">Submit</button> :
                    <React.Fragment>
                        <div className="formHeading">miscellaneous</div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[20]}>{labels[20]}</label>
                            <input type="text" id={keys[20]} value={formValues[20]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[26]}>{labels[26]}</label>
                            <input type="text" id={keys[26]} value={formValues[26]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[27]}>{labels[27]}</label>
                            <input type="text" id={keys[27]} value={formValues[27]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[29]}>{labels[29]}</label>
                            <input type="text" id={keys[29]} value={formValues[29]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[30]}>{labels[30]}</label>
                            <input type="text" id={keys[30]} value={formValues[30]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[31]}>{labels[31]}</label>
                            <input type="text" id={keys[31]} value={formValues[31]} disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[32]}>{labels[32]}</label>
                            <input type="text" id={keys[32]} value={formValues[32]} disabled />
                        </div>
                    </React.Fragment>
                }
            </form>
            {type !== 'view' ?
                <div id="preDefinedButtons">
                    <button onClick={() => dispatchFormValues({ 'copy': 'root' })}>Fill Root CA Values</button>
                    <button onClick={() => dispatchFormValues({ 'copy': 'sub' })}>Fill Sub CA Values</button>
                    <button onClick={() => dispatchFormValues({ 'copy': 'user' })}>Fill User Values</button>
                    <button onClick={() => dispatchFormValues({ 'copy': 'reject' })}>Fill Reject User Values</button>
                </ div> : null}
        </div>
    );
}

export default InfoEntryPage;