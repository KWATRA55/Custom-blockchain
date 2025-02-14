const { ec: EC } = require('elliptic');
const { v1: uuidV1 } = require('uuid');
const SHA256 = require('crypto-js/sha256');
const config = require('./config'); // Import config

const ec = new EC('secp256k1');

class Wallet {
  constructor() {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
    this.balance = config.STARTING_BALANCE; // Use config
  }

  sign(data) {
    const hash = SHA256(JSON.stringify(data)).toString();
    const signature = this.keyPair.sign(hash);
    return signature.toDER('hex');
  }

  static verifySignature(publicKey, signature, data) {
    const key = ec.keyFromPublic(publicKey, 'hex');
    const hash = SHA256(JSON.stringify(data)).toString();
    return key.verify(hash, signature);
  }
}

module.exports = Wallet;