// SPDX-License-Identifier: https://github.com/lendroidproject/protocol.2.0/blob/master/LICENSE.md
pragma solidity 0.6.12;

import "./MockERC20.sol";

contract MockBLO is MockERC20 {
    // solhint-disable-next-line func-visibility
    constructor () public MockERC20("Mock BLO", "MockBLO") {}// solhint-disable-line no-empty-blocks
}