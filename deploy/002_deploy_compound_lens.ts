import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const compoundLens = await deploy("CompoundLens", {
    from: deployer,
    log: true
  });
};
export default func;
func.tags = ['lens', 'app'];
