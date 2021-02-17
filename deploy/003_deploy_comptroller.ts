import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const unitroller = await deploy("Unitroller", {
    from: deployer,
    log: true
  });

  const comptroller = await deploy("Comptroller", {
    from: deployer,
    log: true
  });

  if((await read('Unitroller', 'comptrollerImplementation')) != comptroller.address) {
    await execute(
      'Unitroller',
      {from: deployer, log: true},
      '_setPendingImplementation',
      comptroller.address
    );

    await execute(
      'Comptroller',
      {from: deployer, log: true},
      '_become',
      unitroller.address
    );
  }


};
export default func;
func.tags = ['comptroller'];
