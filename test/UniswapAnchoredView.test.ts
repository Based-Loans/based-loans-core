import {ethers, deployments, getNamedAccounts} from 'hardhat';
const {execute, read} = deployments;
import {expect} from 'chai';

describe('UniswapAnchoredView', function () {
  let uniswapAnchoredView: any;
  let deployer: string;


  beforeEach(async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;

    await deployments.fixture();
    uniswapAnchoredView = await deployments.get('UniswapAnchoredView');
  });

  it('should have ETH price', async function () {
    const ethPrice = await read('UniswapAnchoredView', 'price', 'ETH');

    expect(ethPrice.toString()).to.be.equal('1707061296');
  });

  it('should have USDC price', async function () {
    const usdcPrice = await read('UniswapAnchoredView', 'price', 'USDC');

    expect(usdcPrice.toString()).to.be.equal('1000000');
  });

  it('should have WBTC price', async function () {
    const wbtcPrice = await read('UniswapAnchoredView', 'price', 'WBTC');

    expect(wbtcPrice.toString()).to.be.equal('37657764783');
  });
});
