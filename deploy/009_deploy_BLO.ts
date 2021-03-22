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

  await deploy("Comp", {
    from: deployer,
    log: true,
    args: [deployer]
  })

  const compAddress = (await deployments.get('Comp')).address

  if((await comptroller.getCompAddress()) != compAddress) {
    let tx = await comptroller._setCompAddress(compAddress)
    tx = await tx.wait()
    console.log(`executing Comptroller._setCompAddress (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCompAddress (compAddress: ${compAddress})`)
  }

  const comptrollerCompBalance = CONFIG[hre.network.name].comptrollerCompBalance
  if (comptrollerCompBalance > 0) {
    await execute(
      'Comp',
      {from: deployer, log: true},
      'transfer',
      comptroller.address,
      comptrollerCompBalance
    );
  } else {
    console.log(`skipping Comp.transfer to comptroller (comptrollerCompBalance: ${comptrollerCompBalance})`)
  }

  const compRate = CONFIG[hre.network.name].compRate
  if (compRate > 0) {
    let tx = await comptroller._setCompRate(compRate)
    tx = await tx.wait()
    console.log(`executing Comptroller._setCompRate (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCompRate (compRate: ${compRate})`)
  }

  const owner = CONFIG[hre.network.name].accThatGetsAllInitialBLO
  if (owner != deployer) {
    await execute(
      'Comp',
      {from: deployer, log: true},
      'transfer',
      owner,
      await read('Comp', 'balanceOf', deployer)
    );
  } else {
    console.log(`skipping Comp.transfer to owner (owner: ${owner}, deployer: ${deployer})`)
  }


};
export default func;
func.tags = ['comp'];
