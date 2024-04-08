import {
  RegisterInsurerInstructionArgs,
  RegisterInsurerInstructionAccounts,
} from "reinsurance-sdk";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const programId = new PublicKey("DajsLYULhHh3SVSDHsCCvnuHD8JeXgVf5mjfnQWpwzix");
async function get_pda_from_seeds(seeds) {
  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId)[0];
}

async function create_insurance(insuranceCreator) {
  const registerInsurerInstructionArgs: RegisterInsurerInstructionArgs = {
    verifyingDocuments:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.newyorker.com%2Fhumor%2Fdaily-shouts%2Fstatement-monkey&psig=AOvVaw0OZEwgW5hdIbwuxQPVuW6B&ust=1712685557415000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJisx4OZs4UDFQAAAAAdAAAAABAE",
  };
  const insurer = await get_pda_from_seeds([
    insuranceCreator.publicKey.toBuffer(),
  ]);
  const registerInsurerInstructionAccounts: RegisterInsurerInstructionAccounts =
    {
      insuranceCreator: insuranceCreator.publicKey,
      insurer: insurer,
      systemProgram: anchor.web3.SystemProgram.programId,
    };
}
