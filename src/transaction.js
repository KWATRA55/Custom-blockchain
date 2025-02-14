const SHA256 = require('crypto-js/sha256');
const { v1: uuidV1 } = require('uuid');
const Wallet = require('./wallet');
const config = require('./config');

class Transaction {
  constructor(sender, recipient, amount) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
    this.id = uuidV1();
    this.signature = null;
  }

  signTransaction(wallet) {
    if (wallet.publicKey !== this.sender) {
      throw new Error('You cannot sign transactions for other wallets!');
    }
    this.signature = wallet.sign(this.calculateHash());
  }

  calculateHash() {
    return SHA256(this.sender + this.recipient + this.amount).toString();
  }

  static isValid(transaction) {
    return Wallet.verifySignature(
      transaction.sender,
      transaction.signature,
      SHA256(transaction.sender + transaction.recipient + transaction.amount).toString()
    );
  }

  static rewardTransaction(minerWallet) {
    return new Transaction(null, minerWallet.publicKey, config.MINING_REWARD);
  }
}

module.exports = Transaction;