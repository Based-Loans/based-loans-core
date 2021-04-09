import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const comptroller = new hre.ethers.Contract(
    (await deployments.get('Unitroller')).address,
    (await deployments.get('Comptroller')).abi,
    await hre.ethers.provider.getSigner(deployer)
  );

  const bloAddress = (await deployments.get('Blo')).address

  if((await comptroller.getCompAddress()) != bloAddress) {
    let tx = await comptroller._setCompAddress(bloAddress)
    tx = await tx.wait()
    console.log(`executing Comptroller._setCompAddress (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCompAddress (bloAddress: ${bloAddress})`)
  }

  const compRate = CONFIG[hre.network.name].compRate
  if (compRate > 0 && (await comptroller.compRate()) != compRate) {
    let tx = await comptroller._setCompRate(compRate, {gasLimit: 700000})
    tx = await tx.wait()
    console.log(`executing Comptroller._setCompRate (tx: ${tx.transactionHash}) ...: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._setCompRate (compRate: ${compRate})`)
  }

  const bETH = await deployments.get('CEther');
  const bUSDC = await deployments.get('CErc20Immutable.bUSDC');
  const bWBTC = await deployments.get('CErc20Immutable.bWBTC');
  const bBLO = await deployments.get('CErc20Immutable.bBLO');
  const bloMarkets = [bETH.address, bUSDC.address, bWBTC.address, bBLO.address];
  let marketsToBlo = [];

  for (let index = 0; index < bloMarkets.length; index++) {
    let marketData = await comptroller.markets(bloMarkets[index]);
    if (!marketData.isComped) {
      marketsToBlo.push(bloMarkets[index]);
    } else {
      console.log(`skipping market, already Comped (market: ${bloMarkets[index]})`)
    }
  }

  if (marketsToBlo.length > 0) {
    let tx = await comptroller._addCompMarkets(marketsToBlo, {gasLimit: 800000})
    tx = await tx.wait()
    console.log(`executing Comptroller._addCompMarkets (tx: ${tx.transactionHash}) ... markets ${marketsToBlo}: performed with ${tx.gasUsed.toString()} gas`)
  } else {
    console.log(`skipping Comptroller._addCompMarkets (all markets Comped)`)
  }
};
export default func;
func.tags = ['rewards']
func.dependencies = ['app', 'blo']
