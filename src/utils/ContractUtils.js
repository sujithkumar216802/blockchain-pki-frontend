import { ethers } from 'ethers';
import pkiJson from '../contracts/PKI.json';

async function deploy() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const abi = pkiJson['abi'];
    const bytecode = pkiJson['bytecode'];
    const PKI = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await PKI.deploy();
    await contract.deployed();
    return contract
}

function connect(contractAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const abi = pkiJson['abi'];
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
}

export { deploy, connect }