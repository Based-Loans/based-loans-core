import { ethers, getNamedAccounts, deployments, network } from 'hardhat';
import { BigNumber, Signer } from 'ethers';
import { expect } from 'chai';
import { getCurrentTime, setNextBlockTime, impersonateTransferFrom, mineBlock,
  MBBASED_ADDRESS, COMP_ADDRESS, MBBASED_WHALE, COMP_WHALE,
  getEthersContract, getErc20Contract, getBlockTime } from './utils';
import * as CONFIG from '../config';


describe.skip("BasedRewards", function () {
    let deployer: any, deployerSigner: any;
    let user1: any, user1Signer: any;
    let user2: any, user2Signer: any;

    let basedRewardsMbBased: any;
    let basedRewardsComp: any;
    let blo: any
    let mbbased: any
    let comp: any

    let mbBasedPoolConfig: any;
    let compPoolConfig: any;
    const mintAmountMbBased = ethers.utils.parseUnits('100', 18);

    before(async () => {
      const namedAccounts = await getNamedAccounts();
      deployer = namedAccounts.deployer;
      deployerSigner = await ethers.provider.getSigner(deployer);
      user1 = namedAccounts.user1;
      user1Signer = await ethers.provider.getSigner(user1);
      user2 = namedAccounts.user2;
      user2Signer = await ethers.provider.getSigner(user2);

      mbbased = await getErc20Contract(user1.address, MBBASED_ADDRESS);
      comp = await getErc20Contract(user1.address, COMP_ADDRESS);

      mbBasedPoolConfig = CONFIG[network.name].tokenDistribution.mbBased;
      compPoolConfig = CONFIG[network.name].tokenDistribution.comp;

      // set static time
      await mineBlock(1618517600);
    })

    beforeEach(async () => {
      await deployments.fixture(['token_distro']);
      basedRewardsMbBased = await getEthersContract('BasedRewards.mbBased', user1);
      basedRewardsComp = await getEthersContract('BasedRewards.comp', user1);
      blo = await getEthersContract('Blo', deployer);
      await blo.transfer(basedRewardsMbBased.address, mbBasedPoolConfig.rewardAmount);
      await blo.transfer(basedRewardsComp.address, compPoolConfig.rewardAmount);

      // get mbbased
      await impersonateTransferFrom(mbbased.address, MBBASED_WHALE, user1, mintAmountMbBased);
      await mbbased.connect(user1Signer).approve(basedRewardsMbBased.address, mintAmountMbBased);
      await impersonateTransferFrom(mbbased.address, MBBASED_WHALE, user2, mintAmountMbBased.mul(3));
      await mbbased.connect(user2Signer).approve(basedRewardsMbBased.address, mintAmountMbBased.mul(3));
    });

    describe("constructor", () => {
        it('should set correct paramters for BasedRewards.mbBased', async () => {
          const pool = basedRewardsMbBased;
          const poolConfig = mbBasedPoolConfig;

          expect(await pool.b()).to.be.be.equal(mbbased.address);
          expect(await pool.blo()).to.be.be.equal(blo.address);
          expect(await pool.duration()).to.be.equal(poolConfig.duration);
          expect(await pool.initreward()).to.be.equal(poolConfig.rewardAmount);
          expect(await pool.starttime()).to.be.equal(poolConfig.startTime);
          const reward = ethers.BigNumber.from(poolConfig.rewardAmount);
          expect(await pool.rewardRate()).to.be.equal(reward.div(poolConfig.duration));
          const startTime = ethers.BigNumber.from(poolConfig.startTime);
          expect(await pool.periodFinish()).to.be.equal(startTime.add(poolConfig.duration));
        });

        it('should set correct paramters for BasedRewards.comp', async () => {
          const pool = basedRewardsComp;
          const poolConfig = compPoolConfig;

          expect(await pool.b()).to.be.be.equal(comp.address);
          expect(await pool.blo()).to.be.be.equal(blo.address);
          expect(await pool.duration()).to.be.equal(poolConfig.duration);
          expect(await pool.initreward()).to.be.equal(poolConfig.rewardAmount);
          expect(await pool.starttime()).to.be.equal(poolConfig.startTime);
          const reward = ethers.BigNumber.from(poolConfig.rewardAmount);
          expect(await pool.rewardRate()).to.be.equal(reward.div(poolConfig.duration));
          const startTime = ethers.BigNumber.from(poolConfig.startTime);
          expect(await pool.periodFinish()).to.be.equal(startTime.add(poolConfig.duration));
        });
    });

    describe('stake', () => {
      it('should allow staking before starting time', async () => {
        const starttime = await basedRewardsMbBased.starttime();
        await mineBlock(starttime.sub(1000).toNumber());

        expect(await mbbased.balanceOf(user1)).to.be.equal(mintAmountMbBased);
        expect(await mbbased.allowance(user1, basedRewardsMbBased.address)).to.be.equal(mintAmountMbBased);

        await expect(basedRewardsMbBased.connect(user1Signer).stake(mintAmountMbBased))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user1, mintAmountMbBased);
        expect(await basedRewardsMbBased.rewardPerTokenStored()).to.be.equal(0);
        expect(await basedRewardsMbBased.totalRewards()).to.be.equal(0);
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        expect(await basedRewardsMbBased.balanceOf(user1)).to.be.equal(mintAmountMbBased);

        await mineBlock(starttime.sub(500).toNumber());
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        await mineBlock(starttime.sub(100).toNumber());
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        await mineBlock(starttime.add(100).toNumber());
        expect(await basedRewardsMbBased.earned(user1)).to.not.equal(0);
      });

      it('should now allow staking zero amount', async () => {
        await expect(basedRewardsMbBased.connect(user1Signer).stake(0))
            .to.be.revertedWith('Cannot stake 0');
      });

      it('should succeed staking', async function () {
        await expect(basedRewardsMbBased.connect(user1Signer).stake(mintAmountMbBased))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user1, mintAmountMbBased);
        await expect(basedRewardsMbBased.connect(user2Signer).stake(mintAmountMbBased.mul(3)))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user2, mintAmountMbBased.mul(3));

        const periodFinish = await basedRewardsMbBased.periodFinish();
        await mineBlock(periodFinish.add(1).toNumber());

        expect(await basedRewardsMbBased.rewardPerTokenStored()).to.be.equal(0);
        expect(await basedRewardsMbBased.totalRewards()).to.be.equal(0);

        const reward = ethers.BigNumber.from(mbBasedPoolConfig.rewardAmount);
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal('8749999999999999999999900');
        expect(await basedRewardsMbBased.earned(user2)).to.be.equal(
          (await basedRewardsMbBased.earned(user1)).mul(3)
        );

        expect(await basedRewardsMbBased.balanceOf(user1)).to.be.equal(mintAmountMbBased);
        expect(await basedRewardsMbBased.balanceOf(user2)).to.be.equal(mintAmountMbBased.mul(3));
        expect(await basedRewardsMbBased.totalSupply()).to.be.equal(mintAmountMbBased.mul(4));
      })
    });

    describe("withdraw", () => {
      beforeEach(async() => {
        await expect(basedRewardsMbBased.connect(user1Signer).stake(mintAmountMbBased))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user1, mintAmountMbBased);
        await expect(basedRewardsMbBased.connect(user2Signer).stake(mintAmountMbBased.mul(3)))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user2, mintAmountMbBased.mul(3));
      });

      it('should allow withdrawing before starting time', async () => {
        await expect(basedRewardsMbBased.connect(user1Signer).withdraw(mintAmountMbBased))
          .to.emit(basedRewardsMbBased, 'Withdrawn').withArgs(user1, mintAmountMbBased);
        await expect(basedRewardsMbBased.connect(user2Signer).withdraw(mintAmountMbBased.mul(3)))
          .to.emit(basedRewardsMbBased, 'Withdrawn').withArgs(user2, mintAmountMbBased.mul(3));
      });

      it('should now allow withdrawing zero amount', async () => {
        await expect(basedRewardsMbBased.connect(user1Signer).withdraw(0))
          .to.be.revertedWith('Cannot withdraw 0');
      });

      it('should now allow withdrawing more than staked amount', async () => {
        await expect(basedRewardsMbBased.connect(user1Signer).withdraw(mintAmountMbBased.add(1)))
          .to.be.reverted;
      })

      it('should succeed withdrawal', async () => {
        await expect(basedRewardsMbBased.connect(user1Signer).withdraw(mintAmountMbBased))
          .to.emit(basedRewardsMbBased, 'Withdrawn').withArgs(user1, mintAmountMbBased);

        expect(await basedRewardsMbBased.rewardPerTokenStored()).to.be.equal(0);
        expect(await basedRewardsMbBased.totalRewards()).to.be.equal(0);

        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        expect(await basedRewardsMbBased.earned(user2)).to.be.equal(0);

        expect(await basedRewardsMbBased.balanceOf(user1)).to.be.equal(0);
        expect(await basedRewardsMbBased.balanceOf(user2)).to.be.equal(mintAmountMbBased.mul(3));
        expect(await basedRewardsMbBased.totalSupply()).to.be.equal(mintAmountMbBased.mul(3));

        await expect(basedRewardsMbBased.connect(user2Signer).withdraw(mintAmountMbBased.mul(3)))
          .to.emit(basedRewardsMbBased, 'Withdrawn').withArgs(user2, mintAmountMbBased.mul(3));

        expect(await basedRewardsMbBased.rewardPerTokenStored()).to.be.equal(0);
        expect(await basedRewardsMbBased.totalRewards()).to.be.equal(0);

        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        expect(await basedRewardsMbBased.earned(user2)).to.be.equal(0);

        expect(await basedRewardsMbBased.balanceOf(user1)).to.be.equal(0);
        expect(await basedRewardsMbBased.balanceOf(user2)).to.be.equal(0);
        expect(await basedRewardsMbBased.totalSupply()).to.be.equal(0);
      });
    });

    describe('getReward', () => {
      beforeEach(async() => {
        await expect(basedRewardsMbBased.connect(user1Signer).stake(mintAmountMbBased))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user1, mintAmountMbBased);
        await expect(basedRewardsMbBased.connect(user2Signer).stake(mintAmountMbBased.mul(3)))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user2, mintAmountMbBased.mul(3));
      });

      it('should not allow claiming before start time', async () => {
          await expect(basedRewardsMbBased.connect(user1Signer).getReward())
              .to.be.revertedWith('Not started');
      });

      it('claiming does nothing if reward is zero', async () => {
        // move time to the start time + 1 sec
        const starttime = await basedRewardsMbBased.starttime();
        await mineBlock(starttime.add(1).toNumber());

        expect(await basedRewardsMbBased.earned(deployer)).to.be.equal(0);
        const bal = await blo.balanceOf(deployer);
        await basedRewardsMbBased.connect(deployerSigner).getReward();
        expect(await blo.balanceOf(deployer)).to.be.equal(bal);
      });

      it('should succeed claiming', async () => {
        let tx;
        // move time to start time + 1 sec
        const starttime = await basedRewardsMbBased.starttime();
        await mineBlock(starttime.add(1).toNumber());
        // earnings = rewardRate * timeDiff * balance / totalSupply
        let rewardRate = await basedRewardsMbBased.rewardRate();
        let balance = await basedRewardsMbBased.balanceOf(user1);
        let totalSupply = await basedRewardsMbBased.totalSupply();
        // div(100).mul(100) to achieve the same precision loss as solidity
        let earningsAfter1SecUser1 = rewardRate.mul(balance).div(totalSupply).div(100).mul(100);

        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(earningsAfter1SecUser1);
        expect(await blo.balanceOf(user1)).to.be.equal(0);
        expect(await blo.balanceOf(basedRewardsMbBased.address)).to.be.equal(mbBasedPoolConfig.rewardAmount);
        tx = await basedRewardsMbBased.connect(user1Signer).getReward();
        let blockTimestamp1 = ethers.BigNumber.from(await getBlockTime(tx.blockNumber));
        let timeDiff = blockTimestamp1.sub(starttime);
        let startGetRewardsUser1 = rewardRate.mul(balance).mul(timeDiff).div(totalSupply).div(100).mul(100);
        expect(await blo.balanceOf(user1)).to.be.equal(startGetRewardsUser1);
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        let rewardAmount = ethers.BigNumber.from(mbBasedPoolConfig.rewardAmount);
        expect(await blo.balanceOf(basedRewardsMbBased.address)).to.be.equal(rewardAmount.sub(startGetRewardsUser1));

        // move time half way
        let halfwayTimestamp = starttime.add(parseInt(mbBasedPoolConfig.duration) / 2);
        await mineBlock(halfwayTimestamp.toNumber());
        timeDiff = halfwayTimestamp.sub(blockTimestamp1);

        rewardRate = await basedRewardsMbBased.rewardRate();
        balance = await basedRewardsMbBased.balanceOf(user1);
        totalSupply = await basedRewardsMbBased.totalSupply();
        // div(100).mul(100) to achieve the same precision loss as solidity
        let earnedHalfwayUser1 = rewardRate.mul(balance).mul(timeDiff).div(totalSupply).div(100).mul(100);
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(earnedHalfwayUser1);
        let bloBalanceBefore = await blo.balanceOf(user1);
        tx = await basedRewardsMbBased.connect(user1Signer).getReward();
        let blockTimestamp2 = ethers.BigNumber.from(await getBlockTime(tx.blockNumber));
        timeDiff = blockTimestamp2.sub(blockTimestamp1);
        let halfwayGetRewardsUser1 = rewardRate.mul(balance).mul(timeDiff).div(totalSupply).div(100).mul(100);
        expect(await blo.balanceOf(user1)).to.be.equal(bloBalanceBefore.add(halfwayGetRewardsUser1));
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        expect(await blo.balanceOf(basedRewardsMbBased.address)).to.be.equal(
          rewardAmount.sub(startGetRewardsUser1).sub(halfwayGetRewardsUser1)
        );

        // move time to the end
        const periodFinish = await basedRewardsMbBased.periodFinish();
        await mineBlock(periodFinish.add(1).toNumber());
        timeDiff = periodFinish.sub(blockTimestamp2);

        rewardRate = await basedRewardsMbBased.rewardRate();
        balance = await basedRewardsMbBased.balanceOf(user1);
        totalSupply = await basedRewardsMbBased.totalSupply();
        // div(100).mul(100) to achieve the same precision loss as solidity
        let earnedTheEndUser1 = rewardRate.mul(balance).mul(timeDiff).div(totalSupply).div(100).mul(100);
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(earnedTheEndUser1);
        bloBalanceBefore = await blo.balanceOf(user1);
        tx = await basedRewardsMbBased.connect(user1Signer).getReward();
        let blockTimestamp3 = ethers.BigNumber.from(await getBlockTime(tx.blockNumber));
        let endGetRewardsUser1 = rewardRate.mul(balance).mul(timeDiff).div(totalSupply).div(100).mul(100);
        expect(await blo.balanceOf(user1)).to.be.equal(bloBalanceBefore.add(endGetRewardsUser1));
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        expect(await blo.balanceOf(basedRewardsMbBased.address)).to.be.equal(
          rewardAmount.sub(startGetRewardsUser1).sub(halfwayGetRewardsUser1).sub(endGetRewardsUser1)
        );
        await expect(basedRewardsMbBased.connect(user1Signer).withdraw(mintAmountMbBased))
          .to.emit(basedRewardsMbBased, 'Withdrawn').withArgs(user1, mintAmountMbBased);

        // user 2
        balance = await basedRewardsMbBased.balanceOf(user2);
        let rewardPerTokenStored = await basedRewardsMbBased.rewardPerTokenStored();
        let earnedTheEndUser2 = rewardPerTokenStored.mul(balance).div(ethers.constants.WeiPerEther);
        expect(await basedRewardsMbBased.earned(user2)).to.be.equal(earnedTheEndUser2);
        expect(await blo.balanceOf(user2)).to.be.equal(0);
        tx = await basedRewardsMbBased.connect(user2Signer).getReward();
        expect(await blo.balanceOf(user2)).to.be.equal(earnedTheEndUser2);
        expect(await basedRewardsMbBased.earned(user2)).to.be.equal(0);
        expect(await blo.balanceOf(basedRewardsMbBased.address)).to.be.equal(
          rewardAmount.sub(startGetRewardsUser1).sub(halfwayGetRewardsUser1).sub(endGetRewardsUser1).sub(earnedTheEndUser2)
        );
      });
    })

    describe('exit', () => {
      beforeEach(async() => {
        await expect(basedRewardsMbBased.connect(user1Signer).stake(mintAmountMbBased))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user1, mintAmountMbBased);
        await expect(basedRewardsMbBased.connect(user2Signer).stake(mintAmountMbBased.mul(3)))
          .to.emit(basedRewardsMbBased, 'Staked').withArgs(user2, mintAmountMbBased.mul(3));
      });

      it('should allow exit', async () => {
        // move time half way
        const starttime = await basedRewardsMbBased.starttime();
        let halfwayTimestamp = starttime.add(parseInt(mbBasedPoolConfig.duration) / 2);
        await mineBlock(halfwayTimestamp.toNumber());
        let timeDiff = halfwayTimestamp.sub(starttime);

        let rewardRate = await basedRewardsMbBased.rewardRate();
        let balance = await basedRewardsMbBased.balanceOf(user1);
        let totalSupply = await basedRewardsMbBased.totalSupply();
        // div(100).mul(100) to achieve the same precision loss as solidity
        let earnedHalfwayUser1 = rewardRate.mul(balance).mul(timeDiff).div(totalSupply).div(100).mul(100);
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(earnedHalfwayUser1);
        expect(await mbbased.balanceOf(user1)).to.be.equal(0);
        expect(await blo.balanceOf(user1)).to.be.equal(0);

        let tx = await basedRewardsMbBased.connect(user1Signer).exit();
        let blockTimestamp1 = ethers.BigNumber.from(await getBlockTime(tx.blockNumber));
        timeDiff = blockTimestamp1.sub(starttime);
        let halfwayGetRewardsUser1 = rewardRate.mul(balance).mul(timeDiff).div(totalSupply).div(100).mul(100);
        expect(await blo.balanceOf(user1)).to.be.equal(halfwayGetRewardsUser1);
        expect(await mbbased.balanceOf(user1)).to.be.equal(mintAmountMbBased);
        expect(await basedRewardsMbBased.earned(user1)).to.be.equal(0);
        let rewardAmount = ethers.BigNumber.from(mbBasedPoolConfig.rewardAmount);
        expect(await blo.balanceOf(basedRewardsMbBased.address)).to.be.equal(
          rewardAmount.sub(halfwayGetRewardsUser1)
        );
      });
    })
})
