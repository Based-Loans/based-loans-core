import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const _ceth = (await deployments.get('CEther')).address;
  const _weth = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  const _router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const _factory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  const _comptrollerAddress = (await deployments.get('Unitroller')).address;

  await deploy("Liquidator", {
    from: deployer,
    log: true,
    args: [_ceth, _weth, _router, _factory, _comptrollerAddress]
  })
};
export default func;
func.tags = ['liquidator'];
func.dependencies = ['ethMarket', 'comptroller']
