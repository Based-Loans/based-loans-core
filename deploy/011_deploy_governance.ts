import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];
  const ethers = hre.ethers;

  const timelock = await deploy("Timelock", {
    from: deployer,
    log: true,
    args: [deployer, config.timelockDelay]
  });

  const governorAlpha = await deploy("GovernorAlpha", {
    from: deployer,
    log: true,
    args: [timelock.address, (await deployments.get('Blo')).address, deployer]
  });

  if((await read('Timelock', 'admin')) == deployer) {
    if((await read('Timelock', 'pendingAdmin')) != governorAlpha.address) {
      const iface = new ethers.utils.Interface(timelock.abi);
      const data = iface.encodeFunctionData("setPendingAdmin", [ governorAlpha.address ]);

      const txHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          [ 'address', 'uint256', 'string', 'bytes', 'uint256' ],
          [ timelock.address, 0, '', data, config.timelockPendingAdminETA ]
        )
      )

      if(!(await read('Timelock', 'queuedTransactions', txHash))) {
        await execute(
          'Timelock',
          {from: deployer, log: true, gasLimit: 700000},
          'queueTransaction',
          timelock.address,
          0,
          '',
          data,
          config.timelockPendingAdminETA
        );
      } else {
        console.log(`skipping Timelock.queueTransaction (setPendingAdmin(address), queuedTransactions: ${txHash}, ${(await read('Timelock', 'queuedTransactions', txHash))})`)

        const blockNumber = await ethers.provider.getBlockNumber();
        const block = await ethers.provider.getBlock(blockNumber);
        if (block.timestamp >= config.timelockPendingAdminETA) {
          await execute(
            'Timelock',
            {from: deployer, log: true, gasLimit: 100000},
            'executeTransaction',
            timelock.address,
            0,
            '',
            data,
            config.timelockPendingAdminETA
          );

          await execute(
            'GovernorAlpha',
            {from: deployer, log: true},
            '__acceptAdmin'
          );
        }
      }
    } else {
      console.log(`skipping Timelock.queueTransaction (setPendingAdmin(address), pendingAdmin: ${(await read('Timelock', 'pendingAdmin'))})`)
      console.log(`skipping Timelock.executeTransaction (setPendingAdmin(address), pendingAdmin: ${(await read('Timelock', 'pendingAdmin'))})`)

      await execute(
        'GovernorAlpha',
        {from: deployer, log: true},
        '__acceptAdmin'
      );
    }
  } else {
    console.log(`skipping Timelock.setPendingAdmin() (admin: ${(await read('Timelock', 'admin'))})`)
    console.log(`skipping GovernorAlpha.__acceptAdmin()`)
  }
};
export default func;
func.tags = ['gov']
