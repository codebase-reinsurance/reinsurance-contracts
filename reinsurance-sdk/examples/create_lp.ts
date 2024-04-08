import {
  createRegisterLpInstruction,
  RegisterLpInstructionAccounts,
  RegisterLpInstructionArgs,
} from "reinsurance-sdk";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { PublicKey } from "@solana/web3.js";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const programId = new PublicKey("DajsLYULhHh3SVSDHsCCvnuHD8JeXgVf5mjfnQWpwzix");
async function get_pda_from_seeds(seeds) {
  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId)[0];
}

async function get_metadata_account(mintKeypair) {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
}
// use some existing keypair that you already have on solana for lpCreator
async function createLp(lpCreator) {
  const lp = await get_pda_from_seeds([
    lpCreator.publicKey.toBuffer(),
    Buffer.from("LP"),
  ]);
  const tokenisedMint = await get_pda_from_seeds([
    Buffer.from("i_am_in_love"),
    Buffer.from("withacriminl"),
    lp.toBuffer(),
  ]);

  const securityMint = await getAssociatedTokenAddress(tokenisedMint, lp, true);

  const metadataAddress = await get_metadata_account(tokenisedMint);

  const registerLpInstructionAccounts: RegisterLpInstructionAccounts = {
    lpCreator: lpCreator.publicKey,
    lp: lp,
    tokenisedMint: tokenisedMint,
    securityMint: securityMint,
    metadata: metadataAddress,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  const ideal_size = 10000;
  const poolLifecycle = 60 * 60 * 24 * 365;
  const registerLPInstructionArgs: RegisterLpInstructionArgs = {
    idealSize: new BN(ideal_size),
    poolLifecycle: new BN(poolLifecycle),
    tokenName: "monkey",
    tokenSymbol:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.newyorker.com%2Fhumor%2Fdaily-shouts%2Fstatement-monkey&psig=AOvVaw0OZEwgW5hdIbwuxQPVuW6B&ust=1712685557415000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJisx4OZs4UDFQAAAAAdAAAAABAE",
    tokenMetadataUri:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.newyorker.com%2Fhumor%2Fdaily-shouts%2Fstatement-monkey&psig=AOvVaw0OZEwgW5hdIbwuxQPVuW6B&ust=1712685557415000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJisx4OZs4UDFQAAAAAdAAAAABAE",
  };

  createRegisterLpInstruction(
    registerLpInstructionAccounts,
    registerLPInstructionArgs
  );
}
