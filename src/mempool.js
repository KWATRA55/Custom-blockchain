const Transaction = require('./transaction');

class Mempool {
  constructor() {
    this.transactions = [];
  }

  addTransaction(transaction) {
    if (!Transaction.isValid(transaction)) {
      throw new Error('Invalid transaction');
    }
    this.transactions.push(transaction);
  }

  clear() {
    this.transactions = [];
  }
}

module.exports = Mempool;