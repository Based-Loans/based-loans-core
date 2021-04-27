import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const blo = await deployments.get('Blo');

  let name: any, pool: any;
  for ([name, pool] of Object.entries(CONFIG[hre.network.name].tokenDistribution)) {
    await deploy("BasedRewards." + name, {
      contract: "BasedRewards",
      gasLimit: 2000000,
      from: deployer,
      log: true,
      args: [
        pool.stakingTokenAddress,
        blo.address,
        pool.duration,
        pool.rewardAmount,
        pool.startTime
      ]
    });
  }
  console.log('### WARNING ###');
  console.log('>>> fund pools with BLO manually <<<');
  console.log('### WARNING ###');
};
export default func;
func.tags = ['token_distro']
func.dependencies = ['blo']
