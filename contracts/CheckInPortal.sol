// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract CheckInPortal {
    uint256 totalCheckIns;
    uint256 private seed;

    event NewCheckIn(address indexed from, uint256 timestamp);

    struct CheckIn {
        address person;
        uint256 timestamp;
    }

    CheckIn[] checkInsList;

    mapping(address => uint256) public lastCheckedInAt;

    constructor() payable {
        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Check-in contract launched!");
    }

    function checkIn() public {
        require(lastCheckedInAt[msg.sender] + 15 minutes < block.timestamp,
            "Please wait for 15 minutes before checking in again!");
        lastCheckedInAt[msg.sender] = block.timestamp;
        totalCheckIns += 1;
        checkInsList.push(CheckIn(msg.sender, block.timestamp));
        console.log("%s has checked-in!", msg.sender);
        // 50% chance of winning
        if (seed < 50) {
            console.log("%s won a prize!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance,
                "You can't withdraw more funds than the contract has!");
            (bool success,) = (msg.sender).call{value : prizeAmount}("");
            require(success, "Failed to send prize.");
            seed = (block.timestamp + block.difficulty) % 100;
        }
        emit NewCheckIn(msg.sender, block.timestamp);
    }

    function getCheckInsList() public view returns (CheckIn[] memory){
        return checkInsList;
    }

    function getTotalCheckIns() public view returns (uint256) {
        console.log("We have %d total check-ins!", totalCheckIns);
        return totalCheckIns;
    }
}
