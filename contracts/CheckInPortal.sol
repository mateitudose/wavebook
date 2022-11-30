// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract CheckInPortal {
    uint256 totalCheckIns;

    constructor() {
        console.log("Check-in contract launched!");
    }

    function checkIn() public {
        totalCheckIns += 1;
        console.log("%s has checked-in!", msg.sender);
    }

    function getTotalCheckIns() public view returns (uint256) {
        console.log("We have %d total check-ins!", totalCheckIns);
        return totalCheckIns;
    }
}
