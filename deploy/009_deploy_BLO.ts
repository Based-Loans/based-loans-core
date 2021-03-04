import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const wallet = CONFIG[hre.network.name].accThatGetsAllInitialBLO;

  const modelDeployed = await deploy("Comp", {
    from: deployer,
    log: true,
    args: [wallet]
  });
};
export default func;
func.tags = ['comp'];
