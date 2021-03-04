import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];
  const comptroller = await deployments.get('Unitroller');
  const HQLAModel = await deployments.get('HQLAModel');

  const args = [
    comptroller.address,
    HQLAModel.address,
    config.marketsConfig.bETH.initialExchangeRateMantissa,
    config.marketsConfig.bETH.name,
    config.marketsConfig.bETH.symbol,
    config.marketsConfig.bETH.decimals,
    deployer
  ]

  const bEther = await deploy("CEther", {
    from: deployer,
    log: true,
    args: args
  });
};
export default func;
func.tags = ['ethMarket'];
