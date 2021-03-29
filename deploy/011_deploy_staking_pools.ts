import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];

  const BLOETHPool = config.stakingConfig.BLOETHPool;
  const BLOWBTCPool = config.stakingConfig.BLOWBTCPool;

  const pools = [BLOETHPool, BLOWBTCPool];

  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];
    if (pool) {
      // If reward token address is not set but BLO token is deployed,
      // set blo token as reward token.
      if (!pool.rewardTokenAddress) {
        try {
          pool.rewardTokenAddress = (await deployments.get('Comp')).address;
        } catch (err) {
          console.log('BLO token contract is not found...');
        } 
      }

      if (pool.rewardTokenAddress) {
        const poolName = `BasedReward.${pool.name}`;
        const BasedReward = await deploy(poolName, {
          contract: "BasedReward",
          from: deployer,
          log: true,
        });

        const poolConfig = [
          pool.stakingTokenAddress,
          pool.rewardTokenAddress,
          pool.duration,
          pool.rewardAmount,
          pool.startTime,
          pool.fairDistribution,
        ];

        await execute(
          poolName,
          {from: deployer, log: true},
          'initialize',
          poolConfig
        );
      }
    }
  }
};

export default func;
func.tags = ['staking'];
