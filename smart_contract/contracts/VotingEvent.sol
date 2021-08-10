// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract VotingEvent {
  address owner;
  uint256 public prize;
  string[] public candidates;
  mapping(string => uint) public voteStatus;
  mapping(uint => string) private votes;
  IERC20 token;
  address tokenAddress;
  uint public votedCount;
  uint public numberVotes;
  mapping(uint => bool) usedVote;
  mapping(address => uint256) earnedBalance;
  bool allowChange;

  event Vote(uint nonce, string choice);

  event ExternalCall(address targetAddress, string functionName, bool success, bytes result);

  constructor(string[] memory _candidates, address _token, uint _prize, uint _numberVotes, bool _allowChange) payable {
    owner = msg.sender;
    tokenAddress = _token;
    numberVotes = _numberVotes;
    candidates = _candidates;
    if (_token == address(0)) {
      require(msg.value == (_prize * _numberVotes), 'Wrong amount of ETH given');
    } else {
      // TODO: Check if the given token address is ERC20 compliant

      token = IERC20(_token);
      token.transferFrom(msg.sender, address(this), _prize);
    }
    prize = _prize;
    allowChange = _allowChange;
  }

  function vote(string memory choice, uint nonce, bytes memory signature) external {
    bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, nonce)));
    address signer = recoverSigner(message, signature);
    require(signer == owner, "Invalid signature");
    if (allowChange && usedVote[nonce]) {
      voteStatus[votes[nonce]] -= 1;
      usedVote[nonce] = false;
      votedCount -= 1;
      earnedBalance[msg.sender] -= prize;
    }
    require(!usedVote[nonce], 'This vote is already finalized');
    usedVote[nonce] = true;
    votes[nonce] = choice;
    voteStatus[choice] += 1;
    votedCount += 1;
    require(votedCount <= numberVotes, "Should not have more vote that number of votes");

    emit Vote(nonce, choice);

    // Send prize to voter
    if (tokenAddress == address(0)) {
      earnedBalance[msg.sender] += prize;
    } else {
      token.transfer(msg.sender, prize);
    }
  }

  function end() external {
    require(msg.sender == owner, "Only the organizer can end the event");
    if (tokenAddress != address(0)){
      (bool success, bytes memory result) = tokenAddress.call(abi.encodeWithSignature("transfer(address,uint256)", owner, token.balanceOf(address(this))));
      require(success);
      emit ExternalCall(tokenAddress, "transfer", success, result);
    }
    selfdestruct(payable(owner));
  }

  function withdraw() external {
    require(tokenAddress == address(0), 'Prize is not in ETH');
    uint256 reward = earnedBalance[msg.sender];
    earnedBalance[msg.sender] = 0;
    payable(msg.sender).transfer(reward);
  }

  // Builds a prefixed hash to mimic the behavior of eth_sign.
  function prefixed(bytes32 hash) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
  }

  function recoverSigner(bytes32 hash, bytes memory sig) internal pure returns (address) {
    require(sig.length == 65, "Signature has incorrect length");

    bytes32 r;
    bytes32 s;
    uint8 v;

    // Divide the signature in r, s and v with inline assembly
    assembly {
    // first 32 bytes, after the length prefix
      r := mload(add(sig, 32))
    // second 32 bytes
      s := mload(add(sig, 64))
    // final byte (first byte of the next 32 bytes)
      v := byte(0, mload(add(sig, 96)))
    }

    return ecrecover(hash, v, r, s);
  }
}
