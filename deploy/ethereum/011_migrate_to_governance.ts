import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  // update admin on Unitroller
  // update admin on all markets
  // update admin on all models
};
export default func;
func.tags = ['migrate_to_gov']
func.dependencies = ['protocol', 'gov']
