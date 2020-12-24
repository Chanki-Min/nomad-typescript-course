import * as CryptoJS from "crypto-js";
import { preProcessFile } from "typescript";

class Block {
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string => {
    return CryptoJS.SHA256(
      `${index}${previousHash}${timestamp}${data}`
    ).toString();
  };

  static vailidateSturcuture = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "20202020", "", "hello", 123456);

let blockchain: [Block] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimestamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimestamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimestamp
  );
  return newBlock;
};

const getHashForBlock = (aBlock: Block) => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

const addDataToChain = (data): void => {
  const newBlock = createNewBlock(data);
  getBlockchain().push(newBlock);
  return;
};

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.vailidateSturcuture(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
      return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
      return false;
  } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
      return false;
  } else {
      return true;
  }
};

addDataToChain("hi")
console.log(getBlockchain());
console.log(isBlockValid(getBlockchain()[1], getBlockchain()[0]));
