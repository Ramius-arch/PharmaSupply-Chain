const fs = require('fs');
const path = require('path');

const contractAddressPath = path.join(__dirname, '..', '..', 'web3', 'contract-address.json');
let contractAddress;
let contractABI;

if (fs.existsSync(contractAddressPath)) {
    const rawData = fs.readFileSync(contractAddressPath);
    const data = JSON.parse(rawData);
    contractAddress = data.address;
    contractABI = data.abi;
} else {
    // Fallback for production PoC (e.g., Render) where Hardhat might reset
    // This is the standard first contract address on a fresh Hardhat node
    contractAddress = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    console.warn(`Blockchain config: contract-address.json not found. Using fallback address: ${contractAddress}`);
    
    // Use the exported ABI from config/abi.json
    try {
        const abiPath = path.join(__dirname, 'abi.json');
        if (fs.existsSync(abiPath)) {
            contractABI = JSON.parse(fs.readFileSync(abiPath));
        } else {
            console.error('Blockchain config: abi.json not found!');
        }
    } catch (e) {
        console.error('Blockchain config: Failed to load fallback ABI:', e.message);
    }
}

module.exports = {
    SUPPLY_CHAIN_CONTRACT_ADDRESS: contractAddress,
    SUPPLY_CHAIN_CONTRACT_ABI: contractABI
};
