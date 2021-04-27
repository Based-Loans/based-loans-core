import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const comptroller = new hre.ethers.Contract(
    (await deployments.get('Unitroller')).address,
    (await deployments.get('Comptroller')).abi,
    await hre.ethers.provider.getSigner(deployer)
  );

  // TODO: what is reward token on other chains?
  const bloAddress = (await deployments.get('Blo')).address

  if((await comptroller.getCompAddress()) != bloAddress) {
    let tx = await comptroller._setCompAddress(bloAddress)
    tx = await tx.wait()
    console.log(`executing Comptroller._setCompAddress (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCompAddress (bloAddress: ${bloAddress})`)
  }

  const compRate = CONFIG[hre.network.name].compRate
  if (compRate > 0 && (await comptroller.compRate()) != compRate) {
    let tx = await comptroller._setCompRate(compRate, {gasLimit: 700000})
    tx = await tx.wait()
    console.log(`executing Comptroller._setCompRate (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCompRate (compRate: ${compRate})`)
  }
};
export default func;
func.tags = ['rewards']
func.dependencies = ['protocol', 'blo']
