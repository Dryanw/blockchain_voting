`VotingEvent.sol`

| Function Name | Function Visibility | Function Mutability | Modifiers | Parameters | Action - Notes |
| --- | --- | --- | --- | --- | --- |
| constructor | public | N/A | payable | address _token <br> uint _prize <br> uint _numberVotes <br> bool _allowChange | - Set the reward for participating <br> - Declare the total number of votes - Declare if the votes can be changed |
| vote | external | N/A | N/A | string memory choice <br> uint nonce <br> bytes memory signature | - Use the signature signed by the event organizer to vote <br> - Change the vote if permitted <br> - Transfer token/ETH to msg.sender as reward |
| end | external | N/A | N/A | | - Only the organizer can call this function <br> - Declare the end of the voting event |
| withdraw | external | N/A | N/A | | - Withdraw the reward from participating |
| prefixed | internal | pure | N/A | bytes32 hash | - Builds a prefixed hash to mimic the behavior of eth_sign |
| recoverSigner | internal | pure | N/A | bytes32 hash <br> bytes memory sig | - Recover the signer of the message from the given hash and signature |
