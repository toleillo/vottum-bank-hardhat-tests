const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("PrivateBank", function () {
  let bank;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    const Bank = await ethers.getContractFactory("PrivateBank");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    bank = await Bank.deploy();
  });

  describe("deposit", function () {
    it("allows a user to deposit Ether and updates their balance", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await bank.connect(addr1).deposit({ value: depositAmount });

      const balance = await bank.getUserBalance(addr1.address);
      expect(balance).to.equal(depositAmount);
    });
  });

  describe("withdraw", function () {
    it("allows a user to withdraw Ether after depositing", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await bank.connect(addr1).deposit({ value: depositAmount });
      await bank.connect(addr1).withdraw();

      const balance = await bank.getUserBalance(addr1.address);
      expect(balance).to.equal(0);
    });

    it("reverts if a user tries to withdraw without sufficient balance", async function () {
      await expect(bank.connect(addr1).withdraw()).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("getBalance", function () {
    it("returns the total contract balance", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await bank.connect(addr1).deposit({ value: depositAmount });
      await bank.connect(addr2).deposit({ value: depositAmount });

      const totalBalance = await bank.getBalance();
      expect(totalBalance).to.equal(ethers.parseEther("2.0"));
    });
  });
});
