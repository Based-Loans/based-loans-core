import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const wallet = CONFIG[hre.network.name].accThatGetsAllInitialBLO;

  // await deploy("GovernorAlpha", {
  //   from: deployer,
  //   log: true,
  //   args: [wallet, wallet, wallet]
  // });
  //
  // await deploy("Timelock", {
  //   from: deployer,
  //   log: true,
  //   args: [wallet, wallet, wallet]
  // });

  // update admin on Unitroller
  // update admin on all markets
  // update admin on all models
};
export default func;
func.tags = ['gov']
