import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];

  const comptroller = new hre.ethers.Contract(
    (await deployments.get('Unitroller')).address,
    (await deployments.get('Comptroller')).abi,
    await hre.ethers.provider.getSigner(deployer)
  );

  const uniswapAnchoredView = await deployments.get('UniswapAnchoredView');
  if((await comptroller.oracle()) != uniswapAnchoredView.address) {
    let tx = await comptroller._setPriceOracle(uniswapAnchoredView.address);
    tx = await tx.wait()
    console.log(`executing Comptroller._setPriceOracle (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setPriceOracle (oracle: ${(await comptroller.oracle())})`)
  }

  if((await comptroller.closeFactorMantissa()).toString() != config.closeFactorMantissa) {
    let tx = await comptroller._setCloseFactor(config.closeFactorMantissa);
    tx = await tx.wait()
    console.log(`executing Comptroller._setCloseFactor (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCloseFactor (closeFactorMantissa: ${(await comptroller.closeFactorMantissa()).toString()})`)
  }

  if((await comptroller.maxAssets()).toString() != config.maxAssets) {
    let tx = await comptroller._setMaxAssets(config.maxAssets);
    tx = await tx.wait()
    console.log(`executing Comptroller._setMaxAssets (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setMaxAssets (maxAssets: ${(await comptroller.maxAssets()).toString()})`)
  }

  if((await comptroller.liquidationIncentiveMantissa()).toString() != config.liquidationIncentiveMantissa) {
    let tx = await comptroller._setLiquidationIncentive(config.liquidationIncentiveMantissa);
    tx = await tx.wait()
    console.log(`executing Comptroller._setLiquidationIncentive (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setLiquidationIncentive (liquidationIncentiveMantissa: ${(await comptroller.liquidationIncentiveMantissa()).toString()})`)
  }
};
export default func;
func.tags = ['config', 'protocol'];
func.dependencies = ['oracle']
