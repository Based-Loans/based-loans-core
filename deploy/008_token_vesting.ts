import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const fourYears = 126144000;
  const start = 1618935600;
  const cliff = 0;
  const revocable = false;

  const vestings = [
  ]

  for (let index = 0; index < vestings.length; index++) {
    let vest = vestings[index];
    await deploy("TokenVesting" + index, {
      contract: "TokenVesting",
      from: deployer,
      log: true,
      args: vest
    })
  }
};
export default func;
func.tags = ['vesting'];
