const VotingEvent = artifacts.require('VotingEvent');
const truffleAssert = require('truffle-assertions');

contract('Testing VotingEvent that allow change', (accounts) => {
    let voteEvent;
    let validSig;
    let voter = accounts[1];
    const ownerPKey = '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';
    beforeEach(async () => {
        voteEvent = await VotingEvent.new(["A", "B"], "0x0000000000000000000000000000000000000000",
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
        await truffleAssert.reverts(VotingEvent.new(["A", "B"], "0x0000000000000000000000000000000000000000",
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
    })

})

//contract('Testing OrderBook',
//
//    it("token address stored", async () => {
//        const actualTokenAddress = await orderBook.tokenAddress();
//        assert.equal(actualTokenAddress, tradeToken.address);
//    })
//
//    it("submitting an order with valid signature", async () => {
//        await orderBook.submitOrder(maker, 1, web3.utils.toWei("0.1", "ether"), 0, validSig.signature,
//            {value: web3.utils.toWei("0.1", "ether"), from: taker});
//        const balance = await orderBook.receivedBalances(maker);
//        assert.equal(balance, web3.utils.toWei("0.1", "ether"), "balance not stored in receivedBalances");
//        const tokenBalance = await tradeToken.balanceOf(taker);
//        assert.equal(tokenBalance, 1, "token did not transfer to taker");
//    });
//
//    it("submitting an order with incorrect fund", async () => {
//        await truffleAssert.reverts(orderBook.submitOrder(maker, 1, web3.utils.toWei("0.1", "ether"), 0,
//            validSig.signature, {value: web3.utils.toWei("0.2", "ether"), from: taker}),
//            "Incorrect fund for executing the order");
//    });
//
//    it("submitting an order with used nonce", async () => {
//        await orderBook.submitOrder(maker, 1, web3.utils.toWei("0.1", "ether"), 0, validSig.signature,
//            {value: web3.utils.toWei("0.1", "ether"), from: taker});
//        await truffleAssert.reverts(orderBook.submitOrder(maker, 1, web3.utils.toWei("0.1", "ether"), 0,
//            validSig.signature, {value: web3.utils.toWei("0.1", "ether"), from: taker}),
//            "nonce is already used");
//    });
//
//    it("submitting an order with invalid signature ", async () => {
//        await truffleAssert.reverts(orderBook.submitOrder(maker, 2, web3.utils.toWei("0.1", "ether"), 0,
//            validSig.signature, {value: web3.utils.toWei("0.2", "ether"), from: taker}),
//            "Invalid signature");
//    });
//
//    it("signature with a wrong length", async () => {
//        // Slice the last 2 character to make it 1 less byte that required
//        let editedSig = validSig.signature.slice(0, -2);
//        await truffleAssert.reverts(orderBook.submitOrder(maker, 1, web3.utils.toWei("0.1", "ether"), 0,
//            editedSig, {value: web3.utils.toWei("0.1", "ether"), from: taker}),
//            "Signature has incorrect length");
//    });
//
//    it("fail token transfer", async () => {
//        let anotherOrderBook = await OrderBook.new(tradeToken.address);
//        await truffleAssert.reverts(anotherOrderBook.submitOrder(maker, 1, web3.utils.toWei("0.1", "ether"), 0,
//            validSig.signature, {value: web3.utils.toWei("0.1", "ether"), from: taker}),
//            "failed settlement on token transfer");
//    })
//
//    it("withdraw when no fund received", async () => {
//        await truffleAssert.reverts(orderBook.withdraw({from: taker}), "no received fund");
//    });
//
//    it("withdraw received fund", async () => {
//        await orderBook.submitOrder(maker, 1, web3.utils.toWei("0.1", "ether"), 0, validSig.signature,
//            {value: web3.utils.toWei("0.1", "ether"), from: taker});
//        const balanceBeforeWithdraw = await web3.eth.getBalance(maker);
////        console.log(balanceBeforeWithdraw);
//        const tx = await orderBook.withdraw({from: maker});
//        const trx = await web3.eth.getTransaction(tx.tx);
////        console.log(trx.gasPrice);
////        console.log(tx.receipt.gasUsed);
//        const fee = web3.utils.toBN(trx.gasPrice).mul(web3.utils.toBN(tx.receipt.gasUsed));
//        const expectedBalance = web3.utils.toBN(balanceBeforeWithdraw).add(web3.utils.toBN(web3.utils.toWei("0.1", "ether"))).sub(web3.utils.toBN(fee));
//        const balanceAfterWithdraw = await web3.eth.getBalance(maker);
//        assert.equal(expectedBalance, balanceAfterWithdraw, "balance after withdraw does not match");
//    })
//
//});