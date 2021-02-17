import { task } from "hardhat/config";

const bUSDC = require('../deployments/mainnet/CErc20Immutable.bUSDC.json');
const bETH = require('../deployments/mainnet/CEther.json');
const oracle = require('../deployments/mainnet/UniswapAnchoredView.json');

async function getSigner(hre) {
  const accounts = await hre.ethers.getSigners();
  const ownerSigner = accounts[0];
  const ownerAddress = await ownerSigner.getAddress();
  console.log('ownerAddress', ownerAddress);
  return ownerSigner;
}

const CONTRACTS = {
  bUSDC: {
    name: "CErc20Immutable",
    address: bUSDC.address
  },
  bETH: {
    name: "CEther",
    address: bETH.address
  },
  oracle: {
    name: "oracle",
    address: oracle.address
  }
}

async function execute(args, hre) {
  const ownerSigner = await getSigner(hre);
  const functionArgs = args.args.split(',');
  console.log(`Calling ${CONTRACTS[args.contract].name}.${args.method}(${args.args}) at ${CONTRACTS[args.contract].address}`);

  const contract = await hre.ethers.getContractFactory(CONTRACTS[args.contract].name, ownerSigner);
  const contractInstance = contract.attach(CONTRACTS[args.contract].address);
  const result = await contractInstance[args.method](...functionArgs);
  console.log(`Result: ${result.toString()}`);
}

task('call', 'Call a function on a contract')
  .addParam('contract', 'contract name')
  .addParam('method', 'method name')
  .addOptionalParam('args', 'args array')
  .setAction(async (args, hre) => {
    await execute(args, hre);
  });

export default {
  solidity: "0.5.16",
};
