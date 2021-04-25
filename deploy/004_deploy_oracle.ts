import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];

  const uniswapOracle = await deploy("UniswapAnchoredView", {
    from: deployer,
    log: true,
    args: [config.anchorPeriod]
  });
};
export default func;
func.tags = ['oracle', 'protocol'];
