import {ethers, deployments, getNamedAccounts, network} from 'hardhat';
const {execute, read} = deployments;
import {expect} from 'chai';
import {getEthersContract, impersonateTransferFrom, getErc20Contract} from './utils';
import {WBTC_ADDRESS, WBTC_WHALE, USDC_ADDRESS, USDC_WHALE} from './utils';
import UniswapV2Router02 from './abi/UniswapV2Router02.json';


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

  beforeEach('deployments', async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    user1 = namedAccounts.user1;
    liquidator = namedAccounts.liquidator;

    wbtc = await getErc20Contract(user1, WBTC_ADDRESS);
    usdc = await getErc20Contract(user1, USDC_ADDRESS);
    await deployments.fixture(['app']);
    bWBTC = await getEthersContract('CErc20Immutable.bWBTC', user1);
    bUSDC = await getEthersContract('CErc20Immutable.bUSDC', user1);

    comptroller = new ethers.Contract(
      (await deployments.get('Unitroller')).address,
      (await deployments.get('Comptroller')).abi,
      await ethers.provider.getSigner(user1)
    );

    oracle = await getEthersContract('UniswapAnchoredView', user1);
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
    });

    it('getCash()', async function () {
      expect(await bUSDC.getCash()).to.be.equal(USDCMarketLiquidity);
    })

    describe('with WBTC deposit', async function () {
      const mintAmountWBTC = ethers.utils.parseUnits('1', 8);

      beforeEach('deposit WBTC', async function () {
        await impersonateTransferFrom(wbtc.address, WBTC_WHALE, user1, mintAmountWBTC);
        await wbtc.approve(bWBTC.address, mintAmountWBTC);
        await bWBTC.mint(mintAmountWBTC);
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
        const borrowAmountUSDC = ethers.utils.parseUnits('10000', 6);

        beforeEach('enterMarket() with WBTC & borrow() USDC', async function () {
          await comptroller.enterMarkets([bWBTC.address]);
          await bUSDC.borrow(borrowAmountUSDC);
        })

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

        it('liquidateBorrow()', async function () {
          // get WBTC collateral
          const WBTCBal = await bWBTC.callStatic.balanceOfUnderlying(user1, {gasLimit: 500000});
          // get BTC price
          const WBTCPrice = await oracle.price('WBTC');
          // get collateralFactor
          const WBTCMarket = await comptroller.markets(bWBTC.address);
          const dollarValueCollateralWBTC = WBTCBal.mul(WBTCMarket.collateralFactorMantissa).div(expScale).mul(WBTCPrice).div(1000000);

          const borrowBalance = await bUSDC.borrowBalanceStored(user1);
          // bring USDC to 8 decimals
          const dollarValueBorrowUSDC = borrowBalance.mul(100);
          // expect WBTC collateral * collateralFactor >= USDC borrow amount
          expect(dollarValueCollateralWBTC).to.be.above(dollarValueBorrowUSDC);

          // secure an amount for liquidiator
          await impersonateTransferFrom(wbtc.address, WBTC_WHALE, liquidator, mintAmountWBTC);

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

          expect(await oracle.price('WBTC')).to.be.equal('37657764783');
          // time travel forward 15 min
          await network.provider.send("evm_increaseTime", [15*60])
          await oracle.getUnderlyingPrice(bWBTC.address, {gasLimit: 500000});
          expect(await oracle.price('WBTC')).to.be.below('19099000000');

          // get WBTC collateral
          const WBTCBalAfter = await bWBTC.callStatic.balanceOfUnderlying(user1, {gasLimit: 500000});
          // get BTC price
          const WBTCPriceAfter = await oracle.price('WBTC');
          // get collateralFactor
          const WBTCMarketAfter = await comptroller.markets(bWBTC.address);
          const dollarValueCollateralWBTCAfter = WBTCBalAfter.mul(WBTCMarketAfter.collateralFactorMantissa).div(expScale).mul(WBTCPriceAfter).div(1000000);
          const borrowBalanceAfter = await bUSDC.borrowBalanceStored(user1);
          // bring USDC to 8 decimals
          const dollarValueBorrowUSDCAfter = borrowBalanceAfter.mul(100);
          // expect WBTC collateral * collateralFactor >= USDC borrow amount
          expect(dollarValueCollateralWBTCAfter).to.be.below(dollarValueBorrowUSDCAfter);

          // TODO: liquidateBorrow
          expect(await wbtc.balanceOf(liquidator)).to.be.equal(mintAmountWBTC);
          const liquidatorSigner = ethers.provider.getSigner(liquidator);
          await wbtc.connect(liquidatorSigner).approve(bWBTC.address, mintAmountWBTC);
          let tx = await bWBTC.connect(liquidatorSigner).liquidateBorrow(user1, mintAmountWBTC, bUSDC.address);
          const all = await deployments.all();
          for (const [key, value] of Object.entries(all)) {
            console.log(`${key}: ${value.address}`);
          }
          console.log();
          console.log(tx)
          // await expect(
          //   bWBTC.connect(liquidatorSigner).liquidateBorrow(user1, mintAmountWBTC, bUSDC.address)
          // ).to.emit(bWBTC, 'LiquidateBorrow').withArgs(
          //   liquidator,
          //   user1,
          //   mintAmountWBTC,
          //   bUSDC.address,
          //   1
          // )
        });
      })
    })
  })
});
