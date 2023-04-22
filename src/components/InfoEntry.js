import './InfoEntry.css'
import React, { useReducer } from 'react';

function InfoEntryPage({type, handleSubmit}) {

    // eslint-disable-next-line
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

    const preDefinedValues = {
        'root': ['Blockchain Root CA', 'Root CA', 'TRZ', 'TN', 'IN', 'Blockchain Root CA', 'Root CA', 'TRZ', 'TN', 'IN', '1681161711', '1781161711', '', '', '', '', 'Elliptic Curve', '256', '3056301006072a8648ce3d020106052b8104000a034200046f3982dceaaabf05c2f9edc8c2e605d8a6e4d82d98dec331691180e0293ec34752fcf59134e2dced21b9db9ab3ab1da2d9c89cc6a8faa5e81baaddba7c97dfc0', '3', '0', 'sha256WithRSAEncryption', 'sha1', 'sha256', 'true', '0', '', '', 'Sepolia', '', '5e024eb8c9cfca99bae22262cea1ceeb372e2998', 'AuthorityKeyIdentifier', 'Signature'],
        'sub': ['Blockchain Sub CA', 'Sub CA', 'TRZ', 'TN', 'IN', '', '', '', '', '', '1681161711', '1781161711', '', '', '', '', 'Elliptic Curve', '256', '3056301006072a8648ce3d020106052b8104000a034200040e441fed3b0292395af0f029fa906f6c80d1d9bde83f1dd520172a1645a3917911ec98035032fd153794cc9bc145d69739c02cfd8e5dc6cc3049a8a627ace070', '3', '', 'sha256WithRSAEncryption', 'sha1', 'sha256', 'true', '0', '', '', 'Sepolia', '', '930e9bc9c271792780f01e1f6979671a07f57b47', 'AuthorityKeyIdentifier', 'Signature'],
        'user': ['Blockchain User 1', 'User', 'TRZ', 'TN', 'IN', '', '', '', '', '', '1681161711', '1781161711', '', '', '', '', 'Elliptic Curve', '256', '3056301006072a8648ce3d020106052b8104000a03420004aa21438ad3f2a8c2c8cd169f47e857e5062f7a9f1296e449bfa10f9b868befd1d00ee3427f6e9f5299bc8a6c90c6ea8ab13857c39fbddcb0e2291baf565af3a8', '3', '', 'sha256WithRSAEncryption', 'sha1', 'sha256', 'true', '0', '', '', 'Sepolia', '', '0e83d2bc2a5079bb33b63eb1e2b21c96c888115a', 'AuthorityKeyIdentifier', 'Signature'],
        'reject': ['Blockchain User 2', 'User', 'TRZ', 'TN', 'IN', '', '', '', '', '', '1681161711', '1781161711', '', '', '', '', 'Elliptic Curve', '256', '3056301006072a8648ce3d020106052b8104000a03420004b5357602ecff40af9e195a71992733b6c6407109b1e745a42bc9af412e8e96031d47b5b6e478391dce5f7e895e1502c490792bed2c056ad98793ff7cefbbd00e', '3', '', 'sha256WithRSAEncryption', 'sha1', 'sha256', 'true', '0', '', '', 'Sepolia', '', '24bc5c080b823c4c752bafa9a3230a6b34dc8bfb', 'AuthorityKeyIdentifier', 'Signature']
    }

    const keys = ["SubjectCommonName", "SubjectOrganization", "SubjectLocality", "SubjectState", "SubjectCountry", "IssuerCommonName", "IssuerOrganization", "IssuerLocality", "IssuerState", "IssuerCountry", "ValidityNotBefore", "ValidityNotAfter", "DnsNames", "IpAddresses", "EmailAddresses", "URIs", "PublicKeyAlgorithm", "PublicKeySize", "PublicKeyValue", "Version", "SerialNumber", "SignatureAlgorithm", "SHA1", "SHA256", "IsCA", "PathLengthConstraint", "SubjectAddress", "IssuerAddress", "BlockchainName", "CaAddress", "SubjectKeyIdentifier", "AuthorityKeyIdentifier", "Signature"];
    const labels = ["Common Name: ", "Organization: ", "Locality: ", "State: ", "Country: ", "CommonName: ", "Organization: ", "Locality: ", "State: ", "Country: ", "Not Before: ", "Not After: ", "DNS Names: ", "IP Addresses: ", "Email Addresses: ", "URIs: ", "PublicKey Algorithm: ", "PublicKey Size: ", "PublicKey Value: ", "Version: ", "Serial Number: ", "Signature Algorithm: ", "SHA1: ", "SHA256: ", "Is CA: ", "Path Length Constraint: ", "Subject Address: ", "Issuer Address: ", "Blockchain Name: ", "CA Address: ", "Subject Key Identifier: ", "Authority Key Identifier: ", "Signature: "];

    function formReducer(state, action) {
        const { index, value, copy } = action;
        if (copy) {
            return preDefinedValues[copy];
        }
        const tempState = [...state];
        tempState[index] = value;
        if (type === 'root' && index <= 4) {
            tempState[index + 5] = value;
        }
        return tempState;
    }
    const [formValues, dispatchFormValues] = useReducer(formReducer, ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
    function submit(event) {
        event.preventDefault();
        handleSubmit(formValues)
    }

    return (
        <div className="info-entry">
            <form onSubmit={submit}>

                <div className="formHeading">Subject</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[0]}>{labels[0]}</label>
                    <input type="text" id={keys[0]} value={formValues[0]} onChange={(event) => dispatchFormValues({ 'index': 0, 'value': event.target.value })} required />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[1]}>{labels[1]}</label>
                    <input type="text" id={keys[1]} value={formValues[1]} onChange={(event) => dispatchFormValues({ 'index': 1, 'value': event.target.value })} required />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[2]}>{labels[2]}</label>
                    <input type="text" id={keys[2]} value={formValues[2]} onChange={(event) => dispatchFormValues({ 'index': 2, 'value': event.target.value })} required />
                </div>


                <div className="inputWrapper">
                    <label htmlFor={keys[3]}>{labels[3]}</label>
                    <input type="text" id={keys[3]} value={formValues[3]} onChange={(event) => dispatchFormValues({ 'index': 3, 'value': event.target.value })} required />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[4]}>{labels[4]}</label>
                    <input type="text" id={keys[4]} value={formValues[4]} onChange={(event) => dispatchFormValues({ 'index': 4, 'value': event.target.value })} required />
                </div>

                {type === 'root' ? (
                    <React.Fragment>
                        <div className="formHeading">Issuer</div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[5]}>{labels[5]}</label>
                            <input type="text" id={keys[5]} value={formValues[5]} onChange={(event) => dispatchFormValues({ 'index': 5, 'value': event.target.value })} required disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[6]}>{labels[6]}</label>
                            <input type="text" id={keys[6]} value={formValues[6]} onChange={(event) => dispatchFormValues({ 'index': 6, 'value': event.target.value })} required disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[7]}>{labels[7]}</label>
                            <input type="text" id={keys[7]} value={formValues[7]} onChange={(event) => dispatchFormValues({ 'index': 7, 'value': event.target.value })} required disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[8]}>{labels[8]}</label>
                            <input type="text" id={keys[8]} value={formValues[8]} onChange={(event) => dispatchFormValues({ 'index': 8, 'value': event.target.value })} required disabled />
                        </div>

                        <div className="inputWrapper">
                            <label htmlFor={keys[9]}>{labels[9]}</label>
                            <input type="text" id={keys[9]} value={formValues[9]} onChange={(event) => dispatchFormValues({ 'index': 9, 'value': event.target.value })} required disabled />
                        </div>
                    </React.Fragment>
                ) : null
                }

                <div className="formHeading">Validity</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[10]}>{labels[10]}</label>
                    <input type="text" id={keys[10]} value={formValues[10]} onChange={(event) => dispatchFormValues({ 'index': 10, 'value': event.target.value })} required />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[11]}>{labels[11]}</label>
                    <input type="text" id={keys[11]} value={formValues[11]} onChange={(event) => dispatchFormValues({ 'index': 11, 'value': event.target.value })} required />
                </div>

                <div className="formHeading">Alternative Names</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[12]}>{labels[12]}</label>
                    <input type="text" id={keys[12]} value={formValues[12]} onChange={(event) => dispatchFormValues({ 'index': 12, 'value': event.target.value })} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[13]}>{labels[13]}</label>
                    <input type="text" id={keys[13]} value={formValues[13]} onChange={(event) => dispatchFormValues({ 'index': 13, 'value': event.target.value })} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[14]}>{labels[14]}</label>
                    <input type="text" id={keys[14]} value={formValues[14]} onChange={(event) => dispatchFormValues({ 'index': 14, 'value': event.target.value })} />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[15]}>{labels[15]}</label>
                    <input type="text" id={keys[15]} value={formValues[15]} onChange={(event) => dispatchFormValues({ 'index': 15, 'value': event.target.value })} />
                </div>

                <div className="formHeading">PublicKey</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[16]}>{labels[16]}</label>
                    <input type="text" id={keys[16]} value={formValues[16]} onChange={(event) => dispatchFormValues({ 'index': 16, 'value': event.target.value })} required />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[17]}>{labels[17]}</label>
                    <input type="text" id={keys[17]} value={formValues[17]} onChange={(event) => dispatchFormValues({ 'index': 17, 'value': event.target.value })} required />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[18]}>{labels[18]}</label>
                    <input type="text" id={keys[18]} value={formValues[18]} onChange={(event) => dispatchFormValues({ 'index': 18, 'value': event.target.value })} required />
                </div>

                <div className="formHeading">Basic Constraint</div>

                <div className="inputWrapper">
                    <label htmlFor={keys[24]}>{labels[24]}</label>
                    <input type="text" id={keys[24]} value={formValues[24]} onChange={(event) => dispatchFormValues({ 'index': 24, 'value': event.target.value })} required />
                </div>

                <div className="inputWrapper">
                    <label htmlFor={keys[25]}>{labels[25]}</label>
                    <input type="text" id={keys[25]} value={formValues[25]} onChange={(event) => dispatchFormValues({ 'index': 25, 'value': event.target.value })} required />
                </div>

                <button type="submit">Submit</button>
            </form>
            <button onClick={() => dispatchFormValues({ 'copy': 'root' })}>Fill Root CA Values</button>
            <button onClick={() => dispatchFormValues({ 'copy': 'sub' })}>Fill Sub CA Values</button>
            <button onClick={() => dispatchFormValues({ 'copy': 'user' })}>Fill User Values</button>
            <button onClick={() => dispatchFormValues({ 'copy': 'reject' })}>Fill Reject User Values</button>
        </div>
    );
}

export default InfoEntryPage;