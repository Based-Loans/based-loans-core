// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.10;

interface ICEther {
    function mint() external payable;
    function redeem(uint redeemTokens) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
    function borrow(uint borrowAmount) external returns (uint);
    function repayBorrow() external payable;
    function repayBorrowBehalf(address borrower) external payable;
    function liquidateBorrow(address borrower, address cTokenCollateral) external payable;
    function balanceOfUnderlying(address account) external returns (uint);
}
