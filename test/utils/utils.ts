import hre from 'hardhat';
const {ethers, deployments, getNamedAccounts} = hre;
import ERC20 from '@openzeppelin/contracts/build/contracts/ERC20.json';
import {ETH_ADDRESS} from './constants';

export async function getEthersContract(deploymentName:string, deployerAddress:string) {
  let deployer:any;
  const deployment = await deployments.get(deploymentName);
  if (!deployerAddress) {
    const namedAccounts = await getNamedAccounts();
    deployerAddress = namedAccounts.deployer;
  }
  deployer = await ethers.provider.getSigner(deployerAddress);

  return new ethers.Contract(
    deployment.address,
    deployment.abi,
    deployer
  );
}

export async function transferErc20(erc20Address: any, signer: any, to: any, amount: any) {
  signer = await ethers.provider.getSigner(signer);
  const erc20 = new ethers.Contract(erc20Address, ERC20.abi, signer);
  await erc20.transfer(to, amount);
}

export async function impersonateTransferFrom(
  erc20Address: string,
  from: string,
  to: string,
  amount: any
) {
  await ethFaucet(from);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [from]}
  )

  await transferErc20(erc20Address, from, to, amount);

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [from]}
  )
}

export async function getErc20Contract(signer: any, erc20Address: any) {
  signer = await ethers.provider.getSigner(signer);
  return new ethers.Contract(erc20Address, ERC20.abi, signer);
}

export async function approveErc20(signer: any, erc20Address: any, to: any, amount: any) {
  signer = await ethers.provider.getSigner(signer);
  const erc20 = new ethers.Contract(erc20Address, ERC20.abi, signer);
  await erc20.approve(to, amount);
}

export async function balanceOf(erc20Address: any, walletAddress: string) {
  const signer = (await ethers.getSigners())[0];
  if (erc20Address === ETH_ADDRESS) {
    return await ethers.provider.getBalance(walletAddress);
  } else {
    const erc20 = new ethers.Contract(erc20Address, ERC20.abi, signer);
    return await erc20.balanceOf(walletAddress);
  }
}

export async function ethFaucet(walletAddress: string) {
  const namedAccounts = await getNamedAccounts();
  const weth_faucet = namedAccounts.weth_faucet;
  const signer = await ethers.provider.getSigner(weth_faucet);
  const tx = await signer.sendTransaction({
    to: walletAddress,
    value: ethers.utils.parseEther("1.0")
  });
  await tx.wait();
}
