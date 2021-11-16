// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Owned.sol';
import './IFaucet.sol';

contract Faucet is Owned, IFaucet {
uint public numOfFunders;
mapping(address=>bool) private funders;
mapping(uint=>address) private lutFunders;

receive() external payable{}

modifier limitWithdraw(uint amount){
    require(amount <= 1000000000000000000, 'Cannot withdraw more than 0.1 ETH' );
    _;
}

function transferOwnership(address newOwner) external onlyOwner{
    owner = newOwner;
}

function addFunds() external override payable{
    address funder = msg.sender;

    if(!funders[funder]){
        funders[funder] = true;
        lutFunders[numOfFunders] = funder;
        numOfFunders++;
    }
}

function withdrawFunds(uint amount) external override limitWithdraw(amount) {
    payable(msg.sender).transfer(amount);
}

function getFunderAt(uint index) external view returns(address){
    return lutFunders[index];
}

function getAllFunders() external view returns( address[] memory){
    address[] memory _funders = new address[](numOfFunders);

    for(uint i = 0; i < numOfFunders; i++){
        _funders[i] = lutFunders[i];
    }

    return _funders;
}
}