// import { ethers } from 'hardhat'
// import { expect } from 'chai'
// import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
// import { DMail } from '../typechain-types'

// describe("DMail Contract", function () {
//     let DMail, dMail: DMail, from: SignerWithAddress, to: SignerWithAddress, addr2: SignerWithAddress;

//     let withdrawer: SignerWithAddress;
//     let imposter: SignerWithAddress;
//     const DOMAIN_NAME = "DMailContract";
//     const DOMAIN_VERSION = "1";
//     let chainId: bigint;
//     let verifyingContract: string;
//     let domain: {
//       name: string,
//       version: string,
//       chainId: bigint,
//       verifyingContract: string
//     }
//     let types: {
//       [key: string]: Array<{name: string, type: string}>
//     }
  
//     beforeEach(async function () {
//       [from, to, addr2] = await ethers.getSigners();
  
//       const DMail = await ethers.getContractFactory("DMail");
//       dMail = await DMail.deploy();
//     });
  
//     it("should allow the owner to receive ETH", async function () {
//       const depositAmount = ethers.parseEther("1");
  
//       await from.sendTransaction({
//         to: dMail.getAddress(),
//         value: depositAmount,
//       });
  
//       const balance = await dMail.getBalance();
//       expect(balance).to.equal(depositAmount);
//     });

//     describe('Then I can sign for a user to claim from the mail contract', async () => {
//         beforeEach(async () => {
//           domain = {
//             name: DOMAIN_NAME,
//             version: DOMAIN_VERSION,
//             chainId,
//             verifyingContract: await dMail.getAddress()
//           };

//           types = {
//               Claim: [
//                   { name: "to", type: "address" },
//                   { name: "phrase", type: "string" },
//                   { name: "amount", type: "uint256" },
//                   { name: "from", type: "address" }
//               ]
//           };

//           const balance = await dMail.getBalance()
//           //console.log('\tcontract balance: ', balance)
//         })
//         it('transactions per period', async () => {
//           const claim = {
//             to: to.address,
//             phrase: "hello world!", // TransactionsPerPeriod
//             amount: ethers.parseEther("0.01"),
//             from: from.address
//           };

//           console.log('claim.to: ', claim.to)
//           console.log('claim.phrase: ', claim.phrase)
//           console.log('claim.amount: ', claim.amount)
//           console.log('claim.from: ', claim.from)

//           const signature = await from.signTypedData(domain, types, claim);
//           const { v, r, s } = ethers.Signature.from(signature);
//           const amount = ethers.parseEther('0.01');
//           const tx = await dMail.connect(to).claim(claim, v, r, s);

//           // Try to exceed the transaction limit
//           expect(tx).to.changeEtherBalance(dMail, amount)
//           //expect(tx).to.emit(expenseAccountProxy, 'NewWithdrawl').withArgs(withdrawer.address, 1)
//         })
//     })
// })