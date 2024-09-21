import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import { EIP712Example } from '../typechain-types'

describe("EIP712 Contract", function () {
    let eip712Example: EIP712Example, from: SignerWithAddress, to: SignerWithAddress, addr2: SignerWithAddress;

    let withdrawer: SignerWithAddress;
    let imposter: SignerWithAddress;
    const DOMAIN_NAME = "DMailContract";
    const DOMAIN_VERSION = "1";
    let chainId: bigint;
    let verifyingContract: string;
    let domain: {
      name: "EIP712Example",
      version: "1",
      chainId: bigint,
      verifyingContract: string,
      salt: "0x70736575646f2d74657874000000000000000000000000000000000000000000"
    }
    let types: {
      [key: string]: Array<{name: string, type: string}>
    }
  
    beforeEach(async function () {
      [from, to, addr2] = await ethers.getSigners();
  
      const EIP712Example = await ethers.getContractFactory("EIP712Example");
      eip712Example = await EIP712Example.deploy();
    });
  
    it("should allow the owner to receive ETH", async function () {
      const depositAmount = ethers.parseEther("1");
  
      await from.sendTransaction({
        to: eip712Example.getAddress(),
        value: depositAmount,
      });
  
      const balance = await eip712Example.getBalance();
      expect(balance).to.equal(depositAmount);
    });

    describe('Then I can sign for a user to claim from the mail contract', async () => {
        beforeEach(async () => {
          const depositAmount = ethers.parseEther("1");
  
          await from.sendTransaction({
            to: eip712Example.getAddress(),
            value: depositAmount,
          });
      
          const balance = await eip712Example.getBalance();
          expect(balance).to.equal(depositAmount)

          domain = {
            name: "EIP712Example",
            version: "1",
            chainId: (await ethers.provider.getNetwork()).chainId,
            verifyingContract: await eip712Example.getAddress(),
            //salt: "0x70736575646f2d72616e646f6d2076616c756500000000000000000000000000"
            salt: "0x70736575646f2d74657874000000000000000000000000000000000000000000"
          };

          types = {
            ExampleMessage: [
              { name: 'message', type: "string" },
              { name: 'value', type: 'uint256' },
              { name: 'from', type: 'address' },
              { name: 'to', type: 'address' }
            ]
          };

          //const balance = await dMail.getBalance()
          //console.log('\tcontract balance: ', balance)
        })
        it('should verify', async () => {
          const exampleMessage = {
            message: "hello world!", // TransactionsPerPeriod
            value: ethers.parseEther("0.01"),
            from: from.address,
            to: to.address
          };



          console.log('domain.chainId: ', domain.chainId)
          console.log('domain.verifyingContract.: ', domain.verifyingContract)
          console.log('domain.salt: ', domain.salt)

          const signature = await from.signTypedData(domain, types, exampleMessage);
          const { v, r, s } = ethers.Signature.from(signature);
          //const amount = ethers.parseEther('0.01');
          const _from = ethers.verifyTypedData(domain, types, exampleMessage, signature)
          console.log("from: ", _from)
          const tx = await eip712Example.connect(to).verifyMessage(exampleMessage, v, r, s);

          expect(tx).to.emit(eip712Example, 'AddressVerified').withArgs(from.address)
          // Try to exceed the transaction limit
          //expect(tx).to.changeEtherBalance(dMail, amount)
          //expect(tx).to.emit(expenseAccountProxy, 'NewWithdrawl').withArgs(withdrawer.address, 1)
        })
    })
})