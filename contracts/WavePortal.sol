// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    constructor() {
        console.log("Check-in contract launched!");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has checked-in!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total check-ins!", totalWaves);
        return totalWaves;
    }
}
