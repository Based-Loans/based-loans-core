import {ethers, deployments, network, getNamedAccounts} from 'hardhat';
const {execute, read} = deployments;
import {expect} from 'chai';
import * as CONFIG from '../config';
import { mineBlock } from './utils';

describe('GovernorAlpha', function () {
  let deployer: any;
  let config: any;

  beforeEach(async () => {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    config = CONFIG[network.name];

    await deployments.fixture();
  })

  it('should deploy Timelock and GovernorAlpha and queueTransaction', async function () {
    expect(await read('Timelock', 'delay')).to.be.equal(config.timelockDelay);
    expect(await read('Timelock', 'admin')).to.be.equal(deployer);
    expect(await read('Timelock', 'pendingAdmin')).to.be.equal(ethers.constants.AddressZero);

    const timelock = await deployments.get('Timelock');
    expect(await read('GovernorAlpha', 'timelock')).to.be.equal(timelock.address);
    expect(await read('GovernorAlpha', 'guardian')).to.be.equal(deployer);
    const blo = await deployments.get('Blo');
    expect(await read('GovernorAlpha', 'comp')).to.be.equal(blo.address);

    const governorAlpha = await deployments.get('GovernorAlpha');
    const iface = new ethers.utils.Interface(timelock.abi);
    const data = iface.encodeFunctionData("setPendingAdmin", [ governorAlpha.address ]);
    const txHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        [ 'address', 'uint256', 'string', 'bytes', 'uint256' ],
        [ timelock.address, 0, '', data, config.timelockPendingAdminETA ]
      )
    )
    expect(await read('Timelock', 'queuedTransactions', txHash)).to.be.true;
  });

  it('should set GovernorAlpha as admin', async function () {
    const timelock = await deployments.get('Timelock');
    const governorAlpha = await deployments.get('GovernorAlpha');
    const iface = new ethers.utils.Interface(timelock.abi);
    const data = iface.encodeFunctionData("setPendingAdmin", [ governorAlpha.address ]);

    await mineBlock(parseInt(config.timelockPendingAdminETA) + 1);

    await execute(
      'Timelock',
      {from: deployer, log: true},
      'executeTransaction',
      timelock.address,
      0,
      '',
      data,
      config.timelockPendingAdminETA
    );
    expect(await read('Timelock', 'pendingAdmin')).to.be.equal(governorAlpha.address);

    await execute(
      'GovernorAlpha',
      {from: deployer, log: true},
      '__acceptAdmin'
    );
    expect(await read('Timelock', 'admin')).to.be.equal(governorAlpha.address);
  });
});
