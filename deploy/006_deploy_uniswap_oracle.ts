import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];
  const HQLAModel = await deployments.get('HQLAModel');

  const bETH = await deployments.get('CEther');
  const bUSDC = await deployments.get('CErc20Immutable.bUSDC');
  const bWBTC = await deployments.get('CErc20Immutable.bWBTC');

  let bEthConfig = config.marketsConfig.bETH.tokenConfig;
  bEthConfig.cToken = bETH.address;
  let bUsdcConfig = config.marketsConfig.bUSDC.tokenConfig;
  bUsdcConfig.cToken = bUSDC.address;
  let bWBtcConfig = config.marketsConfig.bWBTC.tokenConfig;
  bWBtcConfig.cToken = bWBTC.address;

  let tokenList = [bEthConfig, bUsdcConfig, bWBtcConfig];
  let tokenConfigs = [];

  const uniswapOracle = await deploy("UniswapAnchoredView", {
    from: deployer,
    log: true,
    args: [config.anchorPeriod]
  });

  for (let index = 0; index < tokenList.length; index++) {
    let i = await read('UniswapAnchoredView', 'cTokenIndex', tokenList[index].cToken);
    if (i == 0) {
      let token = await read('UniswapAnchoredView', 'tokens', i);
      if (token.cToken != tokenList[index].cToken) {
        tokenConfigs.push(tokenList[index]);
      }
    }
  }

  if (tokenConfigs.length > 0) {
    await execute(
      'UniswapAnchoredView',
      {from: deployer, log: true},
      'addTokens',
      tokenConfigs
    );
  }
};
export default func;
func.tags = ['uniswapOracle', 'app'];
