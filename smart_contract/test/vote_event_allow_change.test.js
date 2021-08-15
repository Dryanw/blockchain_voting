const VotingEvent = artifacts.require('VotingEvent');
const truffleAssert = require('truffle-assertions');

contract('Testing VotingEvent', (accounts) => {
    let voteEvent;
    let validSig;
    let voter = accounts[1];
    const ownerPKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
    beforeEach(async () => {
        voteEvent = await VotingEvent.new("0x0000000000000000000000000000000000000000",
                                          web3.utils.toWei("0.01", "ether"), 10, true,
                                          {value: web3.utils.toWei("0.1", "ether")});
        web3.eth.accounts.wallet.add(ownerPKey);
        assert.equal(web3.eth.accounts.wallet[0].address, accounts[0], "wrong private key being used");
        let nonce = 0;
        const message = await web3.utils.soliditySha3(
            {t: "address", v: voter},
            {t: "uint256", v: 0}
        );
        validSig = web3.eth.accounts.sign(message, ownerPKey).signature;
    });

    it("test constructor with wrong ETH", async () => {
        await truffleAssert.reverts(VotingEvent.new("0x0000000000000000000000000000000000000000",
                                    web3.utils.toWei("0.01", "ether"), 10, true,
                                    {value: web3.utils.toWei("0.05", "ether")}), "Wrong amount of ETH given");
    });

    it("test vote with valid signature", async () => {
        await voteEvent.vote("A", 0, validSig, {from: voter});
        a_count = await voteEvent.voteStatus("A");
        assert.equal(a_count, 1, "the vote count of A should be 1");
    });

    it("test vote with invalid signature", async () => {
        await truffleAssert.reverts(voteEvent.vote("A", 0, validSig, {from: accounts[2]}), "Invalid signature");
    });

    it("test change vote", async () => {
        await voteEvent.vote("A", 0, validSig, {from: voter});
        await voteEvent.vote("B", 0, validSig, {from: voter});
        a_count = await voteEvent.voteStatus("A");
        b_count = await voteEvent.voteStatus("B");
        votedCount = await voteEvent.votedCount();
        assert.equal(a_count, 0, "the vote count of A should be 0");
        assert.equal(b_count, 1, "the vote count of B should be 1");
        assert.equal(votedCount, 1, "should only count once for this vote");
    });

    it("test change vote when not allowed", async () => {
        voteEvent = await VotingEvent.new("0x0000000000000000000000000000000000000000",
                                          web3.utils.toWei("0.01", "ether"), 10, false,
                                          {value: web3.utils.toWei("0.1", "ether")});
        await voteEvent.vote("A", 0, validSig, {from: voter});
        await truffleAssert.reverts(voteEvent.vote("A", 0, validSig, {from: voter}), "This vote is already finalized");
        a_count = await voteEvent.voteStatus("A");
        b_count = await voteEvent.voteStatus("B");
        votedCount = await voteEvent.votedCount();
        assert.equal(a_count, 1, "the vote count of A should be 1");
        assert.equal(b_count, 0, "the vote count of B should be 0");
        assert.equal(votedCount, 1, "should only count once for this vote");
    })
});
