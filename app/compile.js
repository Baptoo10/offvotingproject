const path = require('path');
const fs = require('fs');
const solc = require("solc");

const votingPath = path.resolve(__dirname , '../contracts' , 'votingcontract.sol');
const source = fs.readFileSync(votingPath, 'utf8');

var input = {
    language: 'Solidity',
    sources: {
        'votingcontract.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const contractName = 'votingcontract'; // Remplacez 'votingcontract' par le nom de votre contrat
const contractOutput = output.contracts['votingcontract.sol'][contractName];

if (!contractOutput) {
    throw new Error(`Le contrat ${contractName} n'a pas été compilé avec succès.`);
}

const Interface = contractOutput.abi;
const bytecode = contractOutput.evm.bytecode.object;

module.exports = {
    Interface,
    bytecode,
};
