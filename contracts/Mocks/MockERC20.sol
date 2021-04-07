// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract MockERC20 is ERC20, Ownable {
    // solhint-disable-next-line func-visibility
    constructor (string memory name, string memory symbol) public ERC20(name, symbol) {}// solhint-disable-line no-empty-blocks

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }
}