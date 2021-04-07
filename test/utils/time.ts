import { ethers } from 'hardhat'

export async function getBlockTime(blockNumber) {
  return (await ethers.provider.getBlock(blockNumber)).timestamp;
}

export async function getCurrentTime() {
  const blockNumber = await ethers.provider.getBlockNumber();
  return await getBlockTime(blockNumber);
}

export async function increaseTime(time) {
  await ethers.provider.send('evm_increaseTime', [time]);
}

export async function setNextBlockTime(time) {
  await ethers.provider.send('evm_setNextBlockTimestamp', [time]);
}

export async function mineBlock(time) {
  await ethers.provider.send('evm_mine', [time]);
}
