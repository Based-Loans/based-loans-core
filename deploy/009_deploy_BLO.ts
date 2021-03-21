import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const comptroller = new hre.ethers.Contract(
    (await deployments.get('Unitroller')).address,
    (await deployments.get('Comptroller')).abi,
    await hre.ethers.provider.getSigner(deployer)
  );

  const owner = CONFIG[hre.network.name].accThatGetsAllInitialBLO

  await deploy("Comp", {
    from: deployer,
    log: true,
    args: [owner]
  })

  const compAddress = (await deployments.get('Comp')).address

  if((await comptroller.getCompAddress()) != compAddress) {
    let tx = await comptroller._setCompAddress(compAddress)
    tx = await tx.wait()
    console.log(`executing Comptroller._setCompAddress (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCompAddress (compAddress: ${compAddress})`)
  }
};
export default func;
func.tags = ['comp'];
