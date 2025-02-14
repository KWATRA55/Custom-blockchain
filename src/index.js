const Blockchain = require('./blockchain');
const Wallet = require('./wallet');
const Transaction = require('./transaction');
const Mempool = require('./mempool');

const blockchain = new Blockchain();
const mempool = new Mempool();
const wallet1 = new Wallet();
const wallet2 = new Wallet();

// Create a transaction
const transaction = new Transaction(wallet1.publicKey, wallet2.publicKey, 10);
transaction.signTransaction(wallet1);

// Add transaction to mempool
mempool.addTransaction(transaction);

// Mine a block with transactions from the mempool
const block = blockchain.addBlock(mempool.transactions);

// Add mining reward transaction
const miningRewardTransaction = Transaction.rewardTransaction(wallet1);
blockchain.addBlock([miningRewardTransaction]);

// Clear the mempool
mempool.clear();

// Log the blockchain
console.log(JSON.stringify(blockchain, null, 2));

// Log wallet balances
console.log('Wallet 1 Balance:', Blockchain.calculateBalance(wallet1, blockchain.chain));
console.log('Wallet 2 Balance:', Blockchain.calculateBalance(wallet2, blockchain.chain));