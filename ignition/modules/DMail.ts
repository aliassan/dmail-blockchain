import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DMailModule", (m) => {
  const dMail = m.contract("DMail", []);

  return { dMail };
});