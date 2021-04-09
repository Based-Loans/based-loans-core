import {ethers, deployments, getNamedAccounts} from 'hardhat';
const {execute, read} = deployments;
import {expect} from 'chai';

describe('Unitroller', function () {
  let unitroller: any;
  let deployer: string;


  beforeEach(async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;

    await deployments.fixture(['app']);
    unitroller = await deployments.get('Unitroller');
  });

  it('should have admin', async function () {
    expect(await read('Unitroller', 'admin')).to.be.equal(deployer);
  });
});
