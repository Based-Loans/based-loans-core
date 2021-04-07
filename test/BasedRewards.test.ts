import { solidity } from "ethereum-waffle";
import * as chai from 'chai';
chai.use(solidity)

import { ethers, network } from 'hardhat';
import { BigNumber, Signer } from 'ethers';
import { expect } from 'chai';
import { getCurrentTime, setNextBlockTime } from './utils';

describe("BasedRewards", function () {
    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    const HEART_BEAT_START_TIME = 1607212800;// 2020-12-06 00:00:00 UTC (UTC +00:00)
    const EPOCH_PERIOD = 28800;

    let signers: any[];
    let deployer: any;
    let tester: any;
    let tester2: any;

    let BasedRewards: any;
    let MockERC20: any;
    let MockBLO: any

    let pool: any;
    let lpToken: any;
    let rewardToken: any;

    let startTime;

    before(async () => {
        signers = await ethers.getSigners();
        deployer = signers[0];
        tester = signers[1];
        tester2 = signers[2];

        BasedRewards = await ethers.getContractFactory("BasedRewards");
        MockERC20 = await ethers.getContractFactory("MockERC20");
        MockBLO = await ethers.getContractFactory("MockBLO");
    })

    beforeEach(async () => {
        lpToken = await MockERC20.deploy("Mock ERC20", "MockERC20");
        await lpToken.deployed();
        rewardToken = await MockBLO.deploy();
        await rewardToken.deployed();
        pool = await BasedRewards.deploy();
        await pool.deployed();
    });

    describe("initialize", () => {
        it ('should only allow deployer to initialize', async () => {
            expect(await pool.deployer()).to.be.equal(deployer.address);
            await expect(pool.connect(tester).initialize(lpToken.address, rewardToken.address, 1000, 1000, 0, false)).to.be.reverted;
        });

        it ('success initialize should set correct paramters', async () => {
            const result = await pool.connect(deployer).initialize(lpToken.address, rewardToken.address, 1000, 1000, 0, false);
            expect(result).to.emit(pool, "RewardAdded").withArgs(1000);

            const blockTimestamp = (await ethers.provider.getBlock(result.blockNumber)).timestamp;

            expect(await pool.b()).to.be.be.equal(lpToken.address);
            expect(await pool.blo()).to.be.be.equal(rewardToken.address);
            expect(await pool.duration()).to.be.equal(1000);
            expect(await pool.initreward()).to.be.equal(1000);
            expect(await pool.starttime()).to.be.equal(0);
            expect(await pool.fairDistribution()).to.be.equal(false);
            expect(await pool.rewardRate()).to.be.equal(1);
            expect(await pool.periodFinish()).to.be.equal(blockTimestamp + 1000);
        });
    });

    describe('stake', () => {
        beforeEach(async() => {
            await rewardToken.mint(pool.address, 1000);
            await lpToken.mint(tester.address, 100);
            await lpToken.connect(tester).approve(pool.address, 100);
            await lpToken.mint(tester2.address, '100');
            await lpToken.connect(tester2).approve(pool.address, 100);

            startTime = (await getCurrentTime()) + 100;
            await pool.initialize(lpToken.address, rewardToken.address, 1000, 1000, startTime, false);
        });

        it('should not allow staking before starting time', async () => {
            await expect(pool.connect(tester).stake(100))
                .to.be.revertedWith('Not started');
        });

        it('should now allow staking zero amount', async () => {
            await setNextBlockTime(startTime + 1);
            await expect(pool.connect(tester).stake(0))
                .to.be.revertedWith('Cannot stake 0');
        });

        it('should succeed staking', async () => {
            await setNextBlockTime(startTime + 1);

            expect(await lpToken.balanceOf(tester.address)).to.be.equal(100);
            expect(await pool.totalSupply()).to.be.equal(0);
            expect(await pool.balanceOf(tester.address)).to.be.equal(0);

            // tester stakes 100 Lp tokens
            await expect(pool.connect(tester).stake(100))
                .to.emit(pool, 'Staked')
                .withArgs(tester.address, 100);
            
            expect(await lpToken.balanceOf(tester.address)).to.be.equal(0);
            expect(await pool.totalSupply()).to.be.equal(100);
            expect(await pool.balanceOf(tester.address)).to.be.equal(100);
        });
    });

    describe("withdraw", () => {
        beforeEach(async() => {
            await rewardToken.mint(pool.address, 1000);
            await lpToken.mint(tester.address, 100);
            await lpToken.connect(tester).approve(pool.address, 100);
            await lpToken.mint(tester2.address, '100');
            await lpToken.connect(tester2).approve(pool.address, 100);

            startTime = (await getCurrentTime()) + 100;
            await pool.initialize(lpToken.address, rewardToken.address, 1000, 1000, startTime, false);
        });
        
        it('should not allow withdrawing before starting time', async () => {
            await expect(pool.connect(tester).withdraw(100))
                .to.be.revertedWith('Not started');
        });

        it('should now allow withdrawing zero amount', async () => {
            await setNextBlockTime(startTime + 1);
            await expect(pool.connect(tester).withdraw(0))
                .to.be.revertedWith('Cannot withdraw 0');
        });

        it('should now allow withdrawing more than staked amount', async () => {
            await setNextBlockTime(startTime + 1);
            // tester stakes 100 Lp tokens
            await expect(pool.connect(tester).stake(100))
                .to.emit(pool, 'Staked')
                .withArgs(tester.address, 100);
            await expect(pool.connect(tester).withdraw(200))
                .to.be.reverted;
        })

        it('should succeed withdrawal', async () => {
            await setNextBlockTime(startTime + 1);
            // tester stakes 100 Lp tokens
            await expect(pool.connect(tester).stake(100))
                .to.emit(pool, 'Staked')
                .withArgs(tester.address, 100);
            
            expect(await lpToken.balanceOf(tester.address)).to.be.equal(0);
            expect(await pool.totalSupply()).to.be.equal(100);
            expect(await pool.balanceOf(tester.address)).to.be.equal(100);

            // tester wtihdraw 100 Lp tokens
            await expect(pool.connect(tester).withdraw(50))
                .to.emit(pool, 'Withdrawn')
                .withArgs(tester.address, 50);
            
            expect(await lpToken.balanceOf(tester.address)).to.be.equal(50);
            expect(await pool.totalSupply()).to.be.equal(50);
            expect(await pool.balanceOf(tester.address)).to.be.equal(50);
        });
    });

    describe('getReward', () => {
        beforeEach(async() => {
            await rewardToken.mint(pool.address, 1000);
            await lpToken.mint(tester.address, 100);
            await lpToken.connect(tester).approve(pool.address, 100);
            await lpToken.mint(tester2.address, '100');
            await lpToken.connect(tester2).approve(pool.address, 100);

            startTime = (await getCurrentTime()) + 100;
            await pool.initialize(lpToken.address, rewardToken.address, 1000, 1000, startTime, false);
        });

        it('should now allow claiming before start time', async () => {
            await expect(pool.connect(tester).getReward())
                .to.be.revertedWith('Not started');
        });

        it('claiming does nothing if reward is zero', async () => {
            await setNextBlockTime(startTime + 1);
            expect(await pool.earned(tester.address)).to.be.equal(0);
            expect(await rewardToken.balanceOf(tester.address)).to.be.equal(0);
            await expect(pool.connect(tester).getReward());
            expect(await rewardToken.balanceOf(tester.address)).to.be.equal(0);
        });

        it('should succeed claiming', async () => {
            expect(await pool.earned(tester.address)).to.be.equal(0);
            expect(await rewardToken.balanceOf(tester.address)).to.be.equal(0);

            await setNextBlockTime(startTime + 1);

            // tester stakes 100 Lp tokens
            await expect(pool.connect(tester).stake(100))
                .to.emit(pool, 'Staked')
                .withArgs(tester.address, 100);

            await setNextBlockTime(startTime + 101);

            await expect(pool.connect(tester).withdraw(100))
                .to.emit(pool, 'Withdrawn')
                .withArgs(tester.address, 100);

            const earned = await pool.earned(tester.address);
            expect(earned).to.be.gt(0);
            await expect(pool.connect(tester).getReward())
                .to.emit(pool, 'RewardPaid')
                .withArgs(tester.address, earned);
            expect(await rewardToken.balanceOf(tester.address)).to.be.equal(earned);
        });
    })

    describe('exit', () => {
        beforeEach(async() => {
            await rewardToken.mint(pool.address, 1000);
            await lpToken.mint(tester.address, 100);
            await lpToken.connect(tester).approve(pool.address, 100);
            await lpToken.mint(tester2.address, '100');
            await lpToken.connect(tester2).approve(pool.address, 100);

            startTime = (await getCurrentTime()) + 100;
            await pool.initialize(lpToken.address, rewardToken.address, 1000, 1000, startTime, false);
        });

        it('should allow emergency withdrawal', async () => {
            await setNextBlockTime(startTime + 1);

            // tester stakes 100 Lp tokens
            await expect(pool.connect(tester).stake(100))
                .to.emit(pool, 'Staked')
                .withArgs(tester.address, 100);

            expect(await lpToken.balanceOf(tester.address)).to.be.equal(0);
            expect(await rewardToken.balanceOf(tester.address)).to.be.equal(0);

            await setNextBlockTime(startTime + 101);

            await expect(pool.connect(tester).exit())
                .to.emit(pool, 'Withdrawn')
                .withArgs(tester.address, 100)
                .to.emit(pool, 'RewardPaid')
                .withArgs(tester.address, 100);

            expect(await lpToken.balanceOf(tester.address)).to.be.equal(100);
            expect(await rewardToken.balanceOf(tester.address)).to.be.equal(100);
        });
    })

    describe('reward calculation', () => {
        beforeEach(async() => {
            await rewardToken.mint(pool.address, 1000);
            await lpToken.mint(tester.address, 100);
            await lpToken.connect(tester).approve(pool.address, 100);
            await lpToken.mint(tester2.address, '100');
            await lpToken.connect(tester2).approve(pool.address, 100);

            startTime = (await getCurrentTime()) + 100;
            await pool.initialize(lpToken.address, rewardToken.address, 1000, 1000, startTime, false);
        });

        it('should calculate correct reward amount', async () => {
            await setNextBlockTime(startTime + 1);

            // tester stakes 100 Lp tokens
            await expect(pool.connect(tester).stake(100))
                .to.emit(pool, 'Staked')
                .withArgs(tester.address, 100);

            await setNextBlockTime(startTime + 101);

            // tester2 stakes 100 Lp tokens, this transaction will trigger recalculation of reward values
            await expect(pool.connect(tester2).stake(100))
                .to.emit(pool, 'Staked')
                .withArgs(tester2.address, 100);

            expect(await pool.earned(tester.address)).to.be.equal(100);
            expect(await pool.lastTimeRewardApplicable()).to.be.equal(startTime + 101);

            await setNextBlockTime(startTime + 201);
            await expect(pool.connect(tester).withdraw(100))
                .to.emit(pool, 'Withdrawn')
                .withArgs(tester.address, 100);
            expect(await pool.earned(tester.address)).to.be.equal(150);
            expect(await pool.earned(tester2.address)).to.be.equal(50);
        });
    })
})