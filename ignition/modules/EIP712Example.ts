import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EIP712ExampleModule", (m) => {
  const eip712Example = m.contract("EIP712Example", []);

  return { eip712Example };
});