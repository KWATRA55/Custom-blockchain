const Block = require('./block');
const Transaction = require('./transaction');
const Wallet = require('./wallet');
const config = require('./config');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);
    return block;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (block.lastHash !== lastBlock.hash) return false;
      if (block.hash !== Block.hash(block.timestamp, block.lastHash, block.data, block.nonce, block.difficulty)) return false;
    }

    return true;
  }

  static calculateBalance(wallet, chain) {
    let balance = config.STARTING_BALANCE;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      for (let transaction of block.data) {
        if (transaction.sender === wallet.publicKey) {
          balance -= transaction.amount;
        }
        if (transaction.recipient === wallet.publicKey) {
          balance += transaction.amount;
        }
      }
    }

    return balance;
  }
}

module.exports = Blockchain;