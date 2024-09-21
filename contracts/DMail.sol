// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract DMail is EIP712, ReentrancyGuard {

    struct Claim {
        address to;
        string phrase;
        uint256 amount;
        address from;
    }

    bytes32 constant CLAIM_TYPEHASH = 
        keccak256(
            "Claim(address to,string phrase,uint256 amount,address from)"
        );

    mapping(bytes32 => bool) sigs;
   
    constructor() EIP712("DMailContract", "1") {}

    function claimHash (Claim calldata _claim) private pure returns( bytes32 ) {
        return keccak256(abi.encode(
            CLAIM_TYPEHASH,
            _claim.to,
            keccak256(bytes(_claim.phrase)),
            _claim.amount,
            _claim.from
        ));
    }

    //error UnauthorizedAccess(address, string, uint256, address);
    error UnauthorizedAccess(address);

    function claim( 
        Claim calldata _claim, 
        uint8 v, bytes32 r, bytes32 s
    ) nonReentrant external {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            _domainSeparatorV4(),
            claimHash(_claim)
        ));

        require(sigs[digest] == false, "Signature expired");

        address signer = ecrecover(digest, v, r, s);

        //require(signer == _claim.from, "Unauthorized access (wrong signer)");
        if (signer != _claim.from) {
            //revert UnauthorizedAccess(_claim.to, _claim.phrase, _claim.amount, _claim.from);
            revert UnauthorizedAccess(signer);
        }

        require(msg.sender == _claim.to, "Unauthorized access (wrong sender)");

        sigs[digest] = true;

        payable(msg.sender).transfer(_claim.amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable { }
}
