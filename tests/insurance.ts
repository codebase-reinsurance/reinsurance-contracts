import * as anchor from "@coral-xyz/anchor";
import { Insurance } from "../target/types/insurance";
import {
  create_keypair,
  get_pda_from_seeds,
  get_metadata_account,
  calculate_expiry_time,
} from "./helper";
import {
  insurerDescription,
  insuranceId,
  coverage,
  minimumCommission,
  premium,
  deductible,
  insuranceMetadataLink,
  proposedCommision,
  proposeduUndercollaterization,
  proposalMetadataLink,
  mintAmount,
  securityAmount,
  TOKEN_METADATA_PROGRAM_ID,
  premiumMultiplier,
  idealSize,
  tokenName,
  tokenimage,
  tokenMetadata,
} from "./constant";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createMint,
  mintTo,
  transfer,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { rpcConfig } from "./test_config";

describe("insurance", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Insurance as anchor.Program<Insurance>;
  const { web3 } = anchor;
  const {
    provider: { connection },
  } = program;
  let global: any = {};

  it("Create insurer!", async () => {
    const insuranceCreator = await create_keypair();
    const insurer = await get_pda_from_seeds([
      insuranceCreator.publicKey.toBuffer(),
    ]);
    await program.methods
      .registerInsurer(insurerDescription)
      .accounts({
        insuranceCreator: insuranceCreator.publicKey,
        insurer: insurer,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([insuranceCreator])
      .rpc(rpcConfig);

    global.insuranceCreator = insuranceCreator;
    global.insurer = insurer;
  });

  it("Creates a LP!", async () => {
    const lpCreator = await create_keypair();
    const lp = await get_pda_from_seeds([lpCreator.publicKey.toBuffer()]);
    const tokenisedMint = await get_pda_from_seeds([
      Buffer.from("i_am_in_love"),
      Buffer.from("withacriminl"),
      lp.toBuffer(),
    ]);

    const securityMint = await getAssociatedTokenAddress(
      tokenisedMint,
      lp,
      true
    );

    const metadataAddress = await get_metadata_account(tokenisedMint);

    await program.methods
      .registerLp(idealSize, tokenName, tokenimage, tokenMetadata)
      .accounts({
        lpCreator: lpCreator.publicKey,
        lp: lp,
        tokenisedMint: tokenisedMint,
        securityMint: securityMint,
        metadata: metadataAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([lpCreator])
      .rpc(rpcConfig);

    global.lpCreator = lpCreator;
    global.lp = lp;
    global.tokenisedMint = tokenisedMint;
    global.securityMint = securityMint;
  });

  it("Registers an insurance", async () => {
    const insurance = await get_pda_from_seeds([
      global.insuranceCreator.publicKey.toBuffer(),
      Buffer.from(insuranceId),
    ]);

    await program.methods
      .registerInsurance(
        insuranceId,
        coverage,
        premium,
        minimumCommission,
        deductible,
        calculate_expiry_time(),
        insuranceMetadataLink
      )
      .accounts({
        insuranceCreator: global.insuranceCreator.publicKey,
        insurer: global.insurer,
        insurance: insurance,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.insuranceCreator])
      .rpc(rpcConfig);
    global.insurance = insurance;
  });
  it("Proposes an insurance proposal", async () => {
    const proposal = await get_pda_from_seeds([
      global.lp.toBuffer(),
      global.insurance.toBuffer(),
    ]);
    const proposalProposer = await create_keypair();
    const proposalTokenAccount = await getAssociatedTokenAddress(
      global.tokenisedMint,
      proposal,
      true
    );

    await program.methods
      .proposeInsuranceProposal(
        proposedCommision,
        proposeduUndercollaterization,
        proposalMetadataLink
      )
      .accounts({
        proposalProposer: proposalProposer.publicKey,
        lp: global.lp,
        insurance: global.insurance,
        proposal: proposal,
        tokenisedMint: global.tokenisedMint,
        proposalTokenAccount: proposalTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([proposalProposer])
      .rpc(rpcConfig);
    global.proposal = proposal;
  });
  it("Add security", async () => {
    // note: This will not work on pushed contracts
    const mintAddress = await createMint(
      connection,
      global.lpCreator,
      global.lpCreator.publicKey,
      global.lpCreator.publicKey,
      6
    );

    const securityAddr = await create_keypair();
    const securityAddrUSDCAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      securityAddr,
      mintAddress,
      securityAddr.publicKey
    );

    await mintTo(
      connection,
      securityAddr,
      mintAddress,
      securityAddrUSDCAccount.address,
      global.lpCreator,
      securityAmount.toNumber()
    );

    const lpMintAccount = await getAssociatedTokenAddress(
      mintAddress,
      global.lp,
      true
    );

    const securityAdrrTokenAccount = await getAssociatedTokenAddress(
      global.tokenisedMint,
      securityAddr.publicKey,
      true
    );

    await program.methods
      .addSecurity(securityAmount)
      .accounts({
        securityAddr: securityAddr.publicKey,
        securityAddrUsdcAcc: securityAddrUSDCAccount.address,
        securityAdderTokenAddr: securityAdrrTokenAccount,
        securityMint: global.securityMint,
        lp: global.lp,
        tokenisedMint: global.tokenisedMint,
        lpUsdcAccount: lpMintAccount,
        usdcMint: mintAddress,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([securityAddr])
      .rpc(rpcConfig);
    global.mintAddress = mintAddress;
    global.securityAddr = securityAddr;
    global.securityAddrUSDCAccount = securityAddrUSDCAccount;
  });
});
