import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import * as CONFIG from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read } = deployments;
  const { deployer } = await getNamedAccounts();

  const models = CONFIG.MAINNET.modelsConfig;

  for (let i = 0; i < models.length; i++) {
    const key = Object.keys(models[i])[0];
    const model = models[i][key];
    // console.log(model,{key}, deployer)

    if (key === 'DAIModel') {
      const args = [
        model.jumpMultiplierPerYear,
        model.kink_,
        model.pot_,
        model.jug_,
        deployer
      ]
      const modelDeployed = await deploy("DAIInterestRateModelV3", {
        from: deployer,
        log: true,
        args: args
      });
    } else {
      const args = [
        model.baseRatePerYear,
        model.multiplierPerYear,
        model.jumpMultiplierPerYear,
        model.kink_,
        deployer
      ]
      const modelDeployed = await deploy(key, {
        contract: "JumpRateModelV2",
        from: deployer,
        log: true,
        args: args
      });
    }
  }
};
export default func;
func.tags = ['models'];
