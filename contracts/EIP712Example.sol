// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// EIP712 domain separator
struct EIP712Domain {
    string name;
    string version;
    uint256 chainId;
    address verifyingContract;
    bytes32 salt;
}

// Example message struct
struct ExampleMessage {
    string message;
    uint256 value;
    address from;
    address to;
}

contract EIP712Example {
    // EIP712 domain separator hash
    bytes32 private DOMAIN_SEPARATOR;
    bytes32 private constant SALT = "pseudo-text";
    mapping(bytes32 => bool) sigs;

    // EIP712 domain separator setup
    constructor() {
        DOMAIN_SEPARATOR = hashDomain(EIP712Domain({
            name: "EIP712Example",
            version: "1",
            chainId: block.chainid,
            verifyingContract: address(this),
            salt: SALT
        }));
    }

    event AddressVerified(address indexed _from);

    error VerifyFail(uint256 chainId, address verifyingContract, bytes32 salt);

    // Hashes the EIP712 domain separator struct
    function hashDomain(EIP712Domain memory domain) private pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract,bytes32 salt)"),
            keccak256(bytes(domain.name)),
            keccak256(bytes(domain.version)),
            domain.chainId,
            domain.verifyingContract,
            domain.salt
        ));
    }

    // Hashes an EIP712 message struct
    function hashMessage(ExampleMessage memory message) private pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256(bytes("ExampleMessage(string message,uint256 value,address from,address to)")),
            keccak256(bytes(message.message)),
            message.value,
            message.from,
            message.to
        ));
    }

    // Verifies an EIP712 message signature
    function verifyMessage(ExampleMessage memory message, uint8 v, bytes32 r, bytes32 s) public {//view {//returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hashMessage(message)
        ));

        require(!sigs[digest], "Signature not valid");

        require(address(this).balance > 0, "Amount exceeds contract balance");

        address recoveredAddress = ecrecover(digest, v, r, s);

        if (recoveredAddress != message.from) {
            revert VerifyFail(block.chainid, address(this), SALT);
        }

        sigs[digest] = true;

        payable(message.to).transfer(message.value);

        emit AddressVerified(recoveredAddress);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}