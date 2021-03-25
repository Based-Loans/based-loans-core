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
  const OAHighJumpModel = await deployments.get('OAHighJumpModel');

  // HQLAModel Assets
  const bUSDC = config.marketsConfig.bUSDC;
  const bWBTC = config.marketsConfig.bWBTC;

  const tokenConfigs = [bUSDC, bWBTC];

  for (let i = 0; i < tokenConfigs.length; i++) {
    const bToken = tokenConfigs[i];
    const cErc20Immutable = await deploy("CErc20Immutable." + bToken.symbol, {
      contract: "CErc20Immutable",
      from: deployer,
      log: true,
      args: [
        bToken.tokenConfig.underlying,
        comptroller.address,
        HQLAModel.address,
        bToken.initialExchangeRateMantissa,
        bToken.name,
        bToken.symbol,
        bToken.decimals,
        deployer
      ]
    });
  }
};
export default func;
func.tags = ['ethMarket', 'alpha'];
