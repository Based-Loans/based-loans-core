import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const config = CONFIG[hre.network.name];

  const comptroller = new hre.ethers.Contract(
    (await deployments.get('Unitroller')).address,
    (await deployments.get('Comptroller')).abi,
    await hre.ethers.provider.getSigner(deployer)
  );

  const tokenConfigs = [
    config.marketsConfig.bUSDC,
    config.marketsConfig.bWBTC
  ];

  for (let i = 0; i < tokenConfigs.length; i++) {
    let bToken = tokenConfigs[i];
    bToken.artifact = "CErc20Immutable." + bToken.symbol;

    const modelAddress = (await deployments.get(bToken.model)).address;

    const cErc20Immutable = await deploy(bToken.artifact, {
      contract: "CErc20Immutable",
      from: deployer,
      log: true,
      args: [
        bToken.tokenConfig.underlying,
        comptroller.address,
        modelAddress,
        bToken.initialExchangeRateMantissa,
        bToken.name,
        bToken.symbol,
        bToken.decimals,
        deployer
      ]
    });
    bToken.cToken = cErc20Immutable.address;

    let tokenConfig = bToken.tokenConfig;
    tokenConfig.cToken = bToken.cToken;

    const observation = await read('UniswapAnchoredView', 'newObservations', tokenConfig.symbolHash);
    if (observation.timestamp.toString() == '0') {
      await execute(
        'UniswapAnchoredView',
        {from: deployer, log: true},
        'addTokens',
        [tokenConfig]
      );
    } else {
      console.log(`skipping UniswapAnchoredView.addTokens (newObservations[symbolHash]: ${observation.timestamp.toString()})`)
    }

    if((await read(bToken.artifact, 'reserveFactorMantissa')).toString() != bToken.reserveFactorMantissa) {
      await execute(
        bToken.artifact,
        {from: deployer, log: true},
        '_setReserveFactor',
        bToken.reserveFactorMantissa
      );
    } else {
      console.log(`skipping ${bToken.artifact}._setReserveFactor (reserveFactorMantissa (${bToken.symbol}): ${(await read(bToken.artifact, 'reserveFactorMantissa')).toString()})`)
    }

    if(!(await comptroller.markets(bToken.cToken)).isListed) {
      let tx = await comptroller._supportMarket(bToken.cToken);
      tx = await tx.wait()
      console.log(`executing Comptroller._supportMarket (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
    } else {
      console.log(
        `skipping Comptroller._supportMarket (isListed (${bToken.symbol}): ${(await comptroller.markets(bToken.cToken)).isListed})`)
    }

    console.log(bToken.cToken)
    if(
      (await comptroller.markets(bToken.cToken)).collateralFactorMantissa.toString()
      != bToken.collateralFactorMantissa
    ) {
      let tx = await comptroller._setCollateralFactor(bToken.cToken, bToken.collateralFactorMantissa, {gasLimit: 2000000});
      tx = await tx.wait()
      console.log(`executing Comptroller._setCollateralFactor (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
    } else {
      console.log(`skipping Comptroller._setCollateralFactor (collateralFactorMantissa (${bToken.symbol}): ${(await comptroller.markets(bToken.cToken)).collateralFactorMantissa.toString()})`)
    }

    if(
      (await comptroller.borrowCaps(bToken.cToken)).toString()
      != bToken.borrowCaps
    ) {
      let tx = await comptroller._setMarketBorrowCaps(bToken.borrowCaps);
      tx = await tx.wait()
      console.log(tx.events[0].args, `executing Comptroller._setMarketBorrowCaps (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
    } else {
      console.log(`skipping Comptroller._setMarketBorrowCaps (borrowCaps (${bToken.symbol}): ${(await comptroller.borrowCaps(bToken.cToken)).toString()})`)
    }

    if((await comptroller.markets(bToken.cToken)).isComped != bToken.isComped) {
      let tx = await comptroller._addCompMarkets([bToken.cToken]);
      tx = await tx.wait()
      console.log(`executing Comptroller._addCompMarkets (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
    } else {
      console.log(`skipping Comptroller._addCompMarkets (isComped (${bToken.symbol}): ${(await comptroller.markets(bToken.cToken)).isComped})`)
    }
  }
};
export default func;
func.tags = ['bMarkets'];
func.dependencies = ['protocol', 'ethMarket']
