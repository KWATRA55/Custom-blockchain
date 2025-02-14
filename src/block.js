const SHA256 = require('crypto-js/sha256');
const config = require('./config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(
      config.GENESIS_DATA.timestamp,
      config.GENESIS_DATA.lastHash,
      config.GENESIS_DATA.hash,
      config.GENESIS_DATA.data,
      config.GENESIS_DATA.nonce,
      config.GENESIS_DATA.difficulty
    );
  }

  static mineBlock(lastBlock, data) {
    const lastHash = lastBlock.hash;
    let hash, timestamp;
    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    const MINE_RATE = 10000; // 10 seconds
    difficulty =
      lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }
}

module.exports = Block;