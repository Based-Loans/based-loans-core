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


describe('CErc20Immutable', function () {
  const expScale = ethers.utils.parseUnits('1', 18);
  const ZERO = ethers.utils.parseUnits('0', 0);

  let deployer: string;
  let wbtc: any;
  let usdc: any;
  let bWBTC: any;
  let bUSDC: any;
  let comptroller: any;
  let oracle: any;
  let user1: any;
  let liquidator: any;
  let liquidatorContract: any;

  beforeEach('deployments', async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    user1 = namedAccounts.user1;
    liquidator = namedAccounts.liquidator;

    wbtc = await getErc20Contract(user1, WBTC_ADDRESS);
    usdc = await getErc20Contract(user1, USDC_ADDRESS);
    await deployments.fixture(['protocol', 'blo', 'rewards', 'ethMarket', 'bMarkets']);

    bWBTC = await getEthersContract('CErc20Immutable.bWBTC', user1);
    bUSDC = await getEthersContract('CErc20Immutable.bUSDC', user1);

    comptroller = new ethers.Contract(
      (await deployments.get('Unitroller')).address,
      (await deployments.get('Comptroller')).abi,
      await ethers.provider.getSigner(user1)
    );

    oracle = await getEthersContract('UniswapAnchoredView', user1);

    liquidatorContract = await getEthersContract('Liquidator', liquidator);
  });

  it('should have admin', async function () {
    expect(await read('CErc20Immutable.bWBTC', 'admin')).to.be.equal(deployer);
  });

  it('should mint cTokens', async function () {
    const mintAmount = ethers.utils.parseUnits('1', 8);

    await impersonateTransferFrom(wbtc.address, WBTC_WHALE, user1, mintAmount);
    expect(await wbtc.balanceOf(user1)).to.be.equal(mintAmount);

    // approve market to take token
    await wbtc.approve(bWBTC.address, mintAmount);
    expect(await wbtc.allowance(user1, bWBTC.address)).to.be.equal(mintAmount);

    // call mint
    await bWBTC.mint(mintAmount);

    // check balances
    const cTokenAmount = mintAmount.mul(expScale).mul(expScale).div('20000000000000000').div(expScale);
    expect(await bWBTC.balanceOf(user1)).to.be.equal(cTokenAmount);
    expect(await wbtc.balanceOf(bWBTC.address)).to.be.equal(mintAmount);
    expect(await bWBTC.getCash()).to.be.equal(mintAmount);
  })

  describe('with USDC cash', async function () {
    const USDCMarketLiquidity = ethers.utils.parseUnits('1000000', 6);

    beforeEach('deposit USDC', async function () {
      await impersonateTransferFrom(usdc.address, USDC_WHALE, deployer, USDCMarketLiquidity);
      // approve market to take token
      let deployerSigner = await ethers.provider.getSigner(deployer);
      await usdc.connect(deployerSigner).approve(bUSDC.address, USDCMarketLiquidity);
      // call mint
      await bUSDC.connect(deployerSigner).mint(USDCMarketLiquidity);
      await comptroller.connect(deployerSigner).enterMarkets([bUSDC.address]);
    });

    it('getCash()', async function () {
      expect(await bUSDC.getCash()).to.be.equal(USDCMarketLiquidity);
    })

    describe('with WBTC deposit', async function () {
      const mintAmountWBTC = ethers.utils.parseUnits('1', 8);
      let mintBlock;

      beforeEach('deposit WBTC', async function () {
        await impersonateTransferFrom(wbtc.address, WBTC_WHALE, user1, mintAmountWBTC);
        await wbtc.approve(bWBTC.address, mintAmountWBTC);
        let tx = await bWBTC.mint(mintAmountWBTC);
        tx = await tx.wait();
        mintBlock = tx.blockNumber;
      })

      it('fails to borrow() USDC if not enterMarket()', async function () {
        expect(await usdc.balanceOf(user1)).to.be.equal(0);

        const usdcCash = await bUSDC.getCash();
        const borrowAmount = ethers.utils.parseUnits('10000', 6);

        await expect(bUSDC.borrow(borrowAmount)).to.emit(bUSDC, 'Failure')
          .withArgs(3, 14, 4);

        expect(await usdc.balanceOf(user1)).to.be.equal(0);
        expect(await bUSDC.getCash()).to.be.equal(usdcCash);
      });

      it('enterMarket() with WBTC & borrow() USDC', async function () {
        const borrowAmount = ethers.utils.parseUnits('10000', 6);

        // get WBTC collateral
        const WBTCBal = await bWBTC.callStatic.balanceOfUnderlying(user1, {gasLimit: 500000});
        // get BTC price
        const WBTCPrice = await oracle.price('WBTC');
        // get collateralFactor
        const WBTCMarket = await comptroller.markets(bWBTC.address);
        const dollarValueCollateralWBTC = WBTCBal.mul(WBTCMarket.collateralFactorMantissa).div(expScale).mul(WBTCPrice).div(1000000);
        // bring USDC to 8 decimals
        const dollarValueBorrowUSDC = borrowAmount.mul(100);
        // expect WBTC collateral * collateralFactor >= USDC borrow amount
        expect(dollarValueCollateralWBTC).to.be.above(dollarValueBorrowUSDC);

        await comptroller.enterMarkets([bWBTC.address]);
        expect(await comptroller.checkMembership(user1, bWBTC.address)).to.be.true;
        expect(await usdc.balanceOf(user1)).to.be.equal(0);

        const usdcCash = await bUSDC.getCash();
        expect(usdcCash).to.be.equal(USDCMarketLiquidity);

        await bUSDC.borrow(borrowAmount);

        expect(await usdc.balanceOf(user1)).to.be.equal(borrowAmount);
        expect(await bUSDC.getCash()).to.be.equal(usdcCash.sub(borrowAmount));
      });

      describe('with WBTC deposit and USDC borrowed', async function () {
        let startingBlockNumber;
        const borrowAmountUSDC = ethers.utils.parseUnits('10000', 6);

        beforeEach('enterMarket() with WBTC & borrow() USDC', async function () {
          await comptroller.enterMarkets([bWBTC.address]);
          let tx = await bUSDC.borrow(borrowAmountUSDC);
          tx = await tx.wait()
          startingBlockNumber = tx.blockNumber;
        })

        it('should be able to handle 50 markets in refreshCompSpeeds()', async function () {
          let deployerSigner = await ethers.provider.getSigner(deployer);
          await comptroller.connect(deployerSigner)._setCompRate(ethers.utils.parseUnits('1', 16))
          let markets = await comptroller.getAllMarkets();
          await comptroller.connect(deployerSigner)._addCompMarkets(markets);

          let tx = await comptroller.refreshCompSpeeds();
          tx = await tx.wait();

          let expectedNumberOfMarkets = ethers.BigNumber.from(100);
          let multiplier = expectedNumberOfMarkets.div(markets.length);
          let blockGasLimit = 8000000;
          let gasExpectedFor50Markets = tx.gasUsed.mul(multiplier);
          console.log('gasExpectedFor50Markets', gasExpectedFor50Markets.toString())
          expect(gasExpectedFor50Markets).to.be.lt(blockGasLimit)
        })

        describe('rewards', async function () {

          beforeEach(async function () {
            await comptroller.refreshCompSpeeds();
            if(!CONFIG[network.name].marketsConfig.bUSDC.isComped) {
              this.skip();
            }
          })

          it('should have compSpeeds', async function () {
            expect(await read('Blo', 'balanceOf', comptroller.address)).to.be.equal(0);
            expect(await comptroller.compRate()).to.not.equal(0);
            expect(await comptroller.compSpeeds(bUSDC.address)).to.be.equal(await comptroller.compRate());
            expect(await comptroller.compSpeeds(bWBTC.address)).to.be.equal(0);
          })

          it('should earn BLO rewards', async function () {
            expect(await read('Blo', 'balanceOf', user1)).to.be.equal(0);
            expect(await read('Blo', 'balanceOf', deployer)).to.be.equal(ethers.utils.parseUnits('100000000', 18));

            await comptroller['claimComp(address)'](user1);
            await comptroller['claimComp(address)'](deployer);

            let blockNumber = await ethers.provider.getBlockNumber();
            let compAccrued = await comptroller.compAccrued(user1);
            const compRate = await comptroller.compRate();
            expect(compAccrued).to.be.equal(compRate.mul(blockNumber - startingBlockNumber - 2).sub(1));
            expect(await read('Blo', 'balanceOf', user1)).to.be.equal(0);

            compAccrued = await comptroller.compAccrued(deployer);
            const deployerCompAccured = compRate.mul(blockNumber - startingBlockNumber - 1);
            expect(compAccrued).to.be.equal(deployerCompAccured);

            await bUSDC.borrow(ethers.utils.parseUnits('1', '6'));

            compAccrued = await comptroller.compAccrued(user1);
            blockNumber = await ethers.provider.getBlockNumber();
            expect(compAccrued).to.be.equal(compRate.mul(blockNumber - startingBlockNumber - 1).sub(2));
            compAccrued = await comptroller.compAccrued(deployer);
            expect(compAccrued).to.be.equal(deployerCompAccured);
            expect(await read('Blo', 'balanceOf', deployer)).to.be.equal(ethers.utils.parseUnits('100000000', 18));
          })

          describe('with BLO available', async function () {
            let refreshBlock;

            beforeEach('send BLO token', async function () {
              // send BLO for rewards
              await execute(
                'Blo',
                {from: deployer, log: false},
                'transfer',
                (await deployments.get('Unitroller')).address,
                ethers.utils.parseUnits('1000', 18)
              );
              let tx = await comptroller.refreshCompSpeeds();
              tx = await tx.wait();
              refreshBlock = tx.blockNumber;
            })

            it('should collect BLO rewards', async function () {
              expect(await read('Blo', 'balanceOf', user1)).to.be.equal(0);
              const deployerBloBal = ethers.utils.parseUnits('99999000', 18);
              expect(await read('Blo', 'balanceOf', deployer)).to.be.equal(deployerBloBal);

              let user1Tx = await comptroller['claimComp(address)'](user1);
              let deployerTx = await comptroller['claimComp(address)'](deployer);

              let blockNumber = await ethers.provider.getBlockNumber();
              let compAccrued = await comptroller.compAccrued(user1);
              const compRate = await comptroller.compRate();
              expect(compAccrued).to.be.equal(0);
              const user1BloBal = compRate.mul(user1Tx.blockNumber - startingBlockNumber - 1).sub(1);
              expect(await read('Blo', 'balanceOf', user1)).to.be.equal(user1BloBal);

              compAccrued = await comptroller.compAccrued(deployer);
              expect(compAccrued).to.be.equal(0);
              const deployerCompAccured = compRate.mul(blockNumber - startingBlockNumber - 1);
              expect(await read('Blo', 'balanceOf', deployer))
                .to.be.equal(deployerBloBal.add(deployerCompAccured));

              await bUSDC.borrow(ethers.utils.parseUnits('1', '6'));

              compAccrued = await comptroller.compAccrued(user1);
              let blockDelta = await ethers.provider.getBlockNumber() - user1Tx.blockNumber
              expect(compAccrued).to.be.equal(0);
              expect(
                (await read('Blo', 'balanceOf', user1)).div(1000000000)
              ).to.be.equal(
                user1BloBal.add(compRate.mul(blockDelta)).div(1000000000)
              );

              expect(await read('Blo', 'balanceOf', deployer)).to.be.equal(deployerBloBal.add(deployerCompAccured));
            })
          })
        });

        it('repay()', async function () {
          const borrowBalance = await bUSDC.borrowBalanceStored(user1);
          expect(borrowBalance).to.be.at.least(borrowAmountUSDC);

          // get extra USDC for interest
          await impersonateTransferFrom(usdc.address, USDC_WHALE, user1, borrowBalance);

          await usdc.approve(bUSDC.address, ethers.constants.MaxUint256);
          // MaxUint256 == repay everything
          await bUSDC.repayBorrow(ethers.constants.MaxUint256);
          expect(await bUSDC.borrowBalanceStored(user1)).to.be.equal(0);

          expect(await wbtc.balanceOf(user1)).to.be.equal(0);
          await bWBTC.redeem(await bWBTC.balanceOf(user1));
          expect(await wbtc.balanceOf(user1)).to.be.at.least(mintAmountWBTC);
          expect(await bWBTC.balanceOf(user1)).to.be.equal(0);
        });

        describe('setup liquidation', function () {
          beforeEach(async function () {

          })

          it('liquidateBorrow()', async function () {
            // getAccountLiquidity
            let liquidity = await comptroller.callStatic.getAccountLiquidity(user1);
            expect(liquidity[0]).to.be.equal(0);
            expect(liquidity[1]).to.be.equal('5063105913200000000000');
            expect(liquidity[2]).to.be.equal(0);

            // get WBTC
            const wbtcWhales = [
              WBTC_WHALE,
              '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
              '0x875abe6f1e2aba07bed4a3234d8555a0d7656d12',
              '0x291ee987e70e279cfbf39f48b36bba328d12646d',
              '0x6262998ced04146fa42253a5c0af90ca02dfd2a3'
            ]

            for (let index = 0; index < wbtcWhales.length; index++) {
              let whaleBal = await wbtc.balanceOf(wbtcWhales[index]);
              await impersonateTransferFrom(wbtc.address, wbtcWhales[index], user1, whaleBal);
            }

            const uniswapRouter = new ethers.Contract(
              '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
              UniswapV2Router02,
              await ethers.provider.getSigner(user1)
            );

            // drop WBTC price
            await wbtc.approve(uniswapRouter.address, await wbtc.balanceOf(user1))
            await uniswapRouter.swapExactTokensForTokens(
              await wbtc.balanceOf(user1),
              1,
              [wbtc.address, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
              user1,
              16169839000
            );
            expect(await wbtc.balanceOf(user1)).to.be.equal(0);

            // update price in oracle
            expect(await oracle.price('WBTC')).to.be.equal('37657764783');
            // time travel forward 15 min
            await network.provider.send("evm_increaseTime", [15*60])
            await oracle.getUnderlyingPrice(bWBTC.address, {gasLimit: 500000});
            expect(await oracle.price('WBTC')).to.be.below('19099000000');

            // confirm user1 is under
            liquidity = await comptroller.callStatic.getAccountLiquidity(user1);
            expect(liquidity[0]).to.be.equal(0);
            expect(liquidity[1]).to.be.equal(0);
            expect(liquidity[2]).to.be.above('2520000000000000000000');

            // secure an amount for liquidiator
            await impersonateTransferFrom(usdc.address, USDC_WHALE, liquidator, borrowAmountUSDC);

            expect(await wbtc.balanceOf(liquidator)).to.be.equal(0);
            expect(await bWBTC.balanceOf(liquidator)).to.be.equal(0);

            // liquidiate
            const liquidatorSigner = ethers.provider.getSigner(liquidator);
            let closeFactorMantissa = await comptroller.closeFactorMantissa();
            let closeAmount = borrowAmountUSDC.mul(closeFactorMantissa).div(ethers.constants.WeiPerEther);
            await usdc.connect(liquidatorSigner).approve(bUSDC.address, closeAmount);
            await expect(
              bUSDC.connect(liquidatorSigner).liquidateBorrow(user1, closeAmount, bWBTC.address)
            ).to.emit(bUSDC, 'LiquidateBorrow')


            // check liquidiator profits, dollar value of BTC should be 125% of paid loan
            let liquidationIncentiveMantissa = await comptroller.liquidationIncentiveMantissa();
            const WBTCBalAfter = await bWBTC.callStatic.balanceOfUnderlying(liquidator, {gasLimit: 500000});
            const BTCPrice = await oracle.price('WBTC');
            // remove 8 decimals from BTCPrice and 2 decimals to match 6 decimals of USDC
            // also div by 1e4 to remove potential precison errrors
            expect(WBTCBalAfter.mul(BTCPrice).div(1e6).div(1e2).div(1e3)).to.be.equal(
              closeAmount.mul(liquidationIncentiveMantissa).div(ethers.constants.WeiPerEther).div(1e3).sub(1)
            );

            expect(await wbtc.balanceOf(liquidator)).to.be.equal(0);
            expect(await bWBTC.balanceOf(liquidator)).to.be.above('3000000000');
            await bWBTC.connect(liquidatorSigner).redeem(await bWBTC.balanceOf(liquidator));
            expect(await wbtc.balanceOf(liquidator)).to.be.above('60000000');
          });
        })

      })
    })
  })
});
