import {ethers, deployments, getNamedAccounts, network} from 'hardhat';
const {execute, read} = deployments;
import {expect} from 'chai';
import {getEthersContract, impersonateTransferFrom, getErc20Contract,
  getCurrentTime, mineBlock} from './utils';
import {WBTC_ADDRESS, WBTC_WHALE, USDC_ADDRESS, USDC_WHALE} from './utils';
import UniswapV2Router02 from './abi/UniswapV2Router02.json';
import UniswapV2Factory from './abi/UniswapV2Factory.json';
import { FACTORY_ADDRESS, INIT_CODE_HASH } from '@uniswap/sdk'
import * as CONFIG from '../config';


describe('CEther', function () {
  const expScale = ethers.utils.parseUnits('1', 18);
  const ZERO = ethers.utils.parseUnits('0', 0);

  let deployer: string;
  let wbtc: any;
  let usdc: any;
  let bEther: any;
  let comptroller: any;
  let oracle: any;
  let user1: any;
  let liquidator: any;

  beforeEach('deployments', async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    user1 = namedAccounts.user1;
    liquidator = namedAccounts.liquidator;

    wbtc = await getErc20Contract(user1, WBTC_ADDRESS);
    usdc = await getErc20Contract(user1, USDC_ADDRESS);
    await deployments.fixture(['protocol', 'blo', 'rewards', 'ethMarket', 'bMarkets']);

    bEther = await getEthersContract('CEther', deployer);

    comptroller = new ethers.Contract(
      (await deployments.get('Unitroller')).address,
      (await deployments.get('Comptroller')).abi,
      await ethers.provider.getSigner(user1)
    );

    oracle = await getEthersContract('UniswapAnchoredView', user1);
  });

  it('should have admin', async function () {
    expect(await read('CEther', 'admin')).to.be.equal(deployer);
  });

  it('should mint cTokens no eth sent', async function () {
    const mintAmount = ethers.utils.parseUnits('1', 18);
    let preBal = await bEther.balanceOf(deployer);
    expect(preBal).to.be.equal(0);

    // call mint
    await bEther.mint({value: mintAmount});

    let preBal2 = await bEther.balanceOf(deployer);
    expect(preBal2).to.be.gt(preBal);

    const signer = await ethers.provider.getSigner(deployer);
    const tx = await signer.sendTransaction({
      to: bEther.address,
      value: mintAmount
    });
    await tx.wait();

    expect(await bEther.balanceOf(deployer)).to.be.equal(preBal2.mul(2));
  })
});
