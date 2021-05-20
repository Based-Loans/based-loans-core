import {ethers, deployments, getNamedAccounts, network} from 'hardhat';
const {execute, read, deploy} = deployments;
import {expect} from 'chai';

describe('UniswapAnchoredView', function () {
  let uniswapAnchoredView: any;
  let Unitroller: any;
  let OAHighJumpModel: any;
  let deployer: string;


  beforeEach(async function () {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;

    await deployments.fixture(['protocol', 'ethMarket', 'bMarkets']);
    uniswapAnchoredView = new ethers.Contract(
      (await deployments.get('UniswapAnchoredView')).address,
      (await deployments.get('UniswapAnchoredView')).abi,
      await ethers.provider.getSigner(deployer)
    );
    Unitroller = await deployments.get('Unitroller');
    OAHighJumpModel = await deployments.get('OAHighJumpModel');
  });

  it('should have ETH price', async function () {
    const ethPrice = await read('UniswapAnchoredView', 'price', 'ETH');
    expect(ethPrice.toString()).to.be.equal('1706864922');

    const bETH = await deployments.get('CEther');
    const ethPriceView = await read('UniswapAnchoredView', 'getUnderlyingPriceView', bETH.address);
    expect(ethPriceView.toString()).to.be.equal('1706864922000000000000');
  });

  it('should have USDC price', async function () {
    const usdcPrice = await read('UniswapAnchoredView', 'price', 'USDC');
    expect(usdcPrice.toString()).to.be.equal('1000000');

    const bUSDC = await deployments.get('CErc20Immutable.bUSDC');
    const usdcPriceView = await read('UniswapAnchoredView', 'getUnderlyingPriceView', bUSDC.address);
    expect(usdcPriceView.toString()).to.be.equal('1000000000000000000000000000000');
  });

  it('should have WBTC price', async function () {
    const wbtcPrice = await read('UniswapAnchoredView', 'price', 'WBTC');
    expect(wbtcPrice.toString()).to.be.equal('18012844583');

    const bWBTC = await deployments.get('CErc20Immutable.bWBTC');
    const wbtcPriceView = await read('UniswapAnchoredView', 'getUnderlyingPriceView', bWBTC.address);
    expect(wbtcPriceView.toString()).to.be.equal('180128445830000000000000000000000');
  });

  describe('configs', function () {
    let bTokenConfig;
    let cErc20Immutable;

    beforeEach(async function () {
      bTokenConfig = { // Basedv1.5
        tokenConfig: {
          cToken: '#',
          underlying: '0x68A118Ef45063051Eac49c7e647CE5Ace48a68a5',
          symbolHash: '0x167423ecf42ee0f504f57e8bc7a8b39b9880f69bab00ddbe6347e7034f1ba180',
          baseUnit: (10**18).toString(),
          priceSource: 2,
          fixedPrice: 0,
          uniswapMarket: '0x55111baD5bC368A2cb9ecc9FBC923296BeDb3b89',
          isUniswapReversed: false
        },
        initialExchangeRateMantissa: '200000000000000000000000000',
        name: 'Based Loans Based',
        symbol: 'bBased',
        decimals: 18,
        reserveFactorMantissa: '300000000000000000',
        collateralFactorMantissa: '0',
        borrowCaps: '0'
      }

      cErc20Immutable = await deploy("CErc20Immutable.Based", {
        contract: "CErc20Immutable",
        from: deployer,
        log: true,
        args: [
          bTokenConfig.tokenConfig.underlying,
          Unitroller.address,
          OAHighJumpModel.address,
          bTokenConfig.initialExchangeRateMantissa,
          bTokenConfig.name,
          bTokenConfig.symbol,
          bTokenConfig.decimals,
          deployer
        ]
      });
    })

    it('should return 0 if token config does not exist', async function () {
      expect(await read('UniswapAnchoredView', 'numTokens')).to.be.equal(3);

      function requireZeroConfig(tokenConfig) {
        expect(tokenConfig.cToken).to.be.equal(ethers.constants.AddressZero);
        expect(tokenConfig.underlying).to.be.equal(ethers.constants.AddressZero);
        expect(tokenConfig.symbolHash).to.be.equal(ethers.constants.HashZero);
        expect(tokenConfig.baseUnit).to.be.equal(0);
        expect(tokenConfig.priceSource).to.be.equal(0);
        expect(tokenConfig.fixedPrice).to.be.equal(0);
        expect(tokenConfig.uniswapMarket).to.be.equal(ethers.constants.AddressZero);
        expect(tokenConfig.isUniswapReversed).to.be.equal(false);
      }
      let tokenConfig = await read('UniswapAnchoredView', 'tokens', 1234);
      requireZeroConfig(tokenConfig);

      tokenConfig = await read('UniswapAnchoredView', 'getTokenConfig', 0);
      requireZeroConfig(tokenConfig);

      await expect(uniswapAnchoredView.getTokenConfig(1234)).to.be.revertedWith('token config not found');
      await expect(uniswapAnchoredView.getTokenConfigBySymbol('NOT_EXISTS')).to.be.revertedWith('token config not found');
      await expect(uniswapAnchoredView.getTokenConfigBySymbolHash('0x167423ecf42ee00000dead000008b39b9880f69bab00ddbe6347e7034f1ba180')).to.be.revertedWith('token config not found');
      await expect(uniswapAnchoredView.getTokenConfigByCToken(cErc20Immutable.address)).to.be.revertedWith('token config not found');
      await expect(uniswapAnchoredView.getTokenConfigByUnderlying('0x00000000000000000000000000000000000dead2')).to.be.revertedWith('token config not found');
    });

    it('addTokens()', async function () {
      bTokenConfig.tokenConfig.cToken = cErc20Immutable.address;
      let tokenConfigs = [bTokenConfig.tokenConfig];
      let numTokensBefore = await read('UniswapAnchoredView', 'numTokens');

      await execute(
        'UniswapAnchoredView',
        {from: deployer, log: true},
        'addTokens',
        tokenConfigs
      );
      let numTokensAfter = await read('UniswapAnchoredView', 'numTokens');
      expect(numTokensAfter).to.be.equal(numTokensBefore.add(1));
      let oldObservations = await read('UniswapAnchoredView', 'oldObservations', bTokenConfig.tokenConfig.symbolHash);
      expect(oldObservations.timestamp).to.be.not.equal(0);
      expect(oldObservations.acc).to.be.not.equal(0);
      let newObservations = await read('UniswapAnchoredView', 'newObservations', bTokenConfig.tokenConfig.symbolHash);
      expect(newObservations.timestamp).to.be.not.equal(0);
      expect(newObservations.acc).to.be.not.equal(0);

      function checkConfig(tokenConfig) {
        expect(tokenConfig.cToken).to.be.equal(cErc20Immutable.address);
        expect(tokenConfig.underlying).to.be.equal(bTokenConfig.tokenConfig.underlying);
        expect(tokenConfig.symbolHash).to.be.equal(bTokenConfig.tokenConfig.symbolHash);
        expect(tokenConfig.uniswapMarket).to.be.equal(bTokenConfig.tokenConfig.uniswapMarket);
        expect(tokenConfig.priceSource).to.be.equal(bTokenConfig.tokenConfig.priceSource);
      }

      let tokenConfig = await read('UniswapAnchoredView', 'tokens', numTokensBefore.add(1));
      checkConfig(tokenConfig);

      tokenConfig = await read('UniswapAnchoredView', 'getTokenConfig', numTokensBefore.add(1));
      checkConfig(tokenConfig);

      tokenConfig = await read('UniswapAnchoredView', 'getTokenConfigBySymbol', '$BASED');
      checkConfig(tokenConfig);

      tokenConfig = await read('UniswapAnchoredView', 'getTokenConfigBySymbolHash', bTokenConfig.tokenConfig.symbolHash);
      checkConfig(tokenConfig);

      tokenConfig = await read('UniswapAnchoredView', 'getTokenConfigByCToken', cErc20Immutable.address);
      checkConfig(tokenConfig);

      tokenConfig = await read('UniswapAnchoredView', 'getTokenConfigByUnderlying', bTokenConfig.tokenConfig.underlying);
      checkConfig(tokenConfig);
    })
  })

  it('move price on uniswap and confirm new price on oracle');
});
