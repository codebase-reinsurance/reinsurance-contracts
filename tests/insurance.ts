import * as anchor from "@coral-xyz/anchor";
import { Insurance } from "../target/types/insurance";
import {
  create_keypair,
  get_pda_from_seeds,
  get_metadata_account,
  calculate_expiry_time,
  sleep,
} from "./helper";
import {
  insurerDescription,
  insuranceId,
  coverage,
  minimumCommission,
  premium,
  deductible,
  mintAmount,
  insuranceMetadataLink,
  proposedCommision,
  proposeduUndercollaterization,
  proposalMetadataLink,
  securityAmount,
  TOKEN_METADATA_PROGRAM_ID,
  premiumMultiplier,
  idealSize,
  tokenName,
  tokenimage,
  tokenMetadata,
  strategyId,
  streamPayment,
  streamEvery,
  numberOfStreams,
  strategyProgram,
  claimId,
  proposalId,
  claimAmount,
  claimMetadataLink,
  poolLifecycle,
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
import { assert } from "chai";

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
    const lp = await get_pda_from_seeds([
      lpCreator.publicKey.toBuffer(),
      Buffer.from("LP"),
    ]);
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
      .registerLp(
        idealSize,
        poolLifecycle,
        tokenName,
        tokenimage,
        tokenMetadata
      )
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
      Buffer.from(proposalId)
    ]);
    const proposalProposer = await create_keypair();
    const proposalTokenAccount = await getAssociatedTokenAddress(
      global.tokenisedMint,
      proposal,
      true
    );

    await program.methods
      .proposeInsuranceProposal(
        proposalId,
        proposalMetadataLink,
        proposedCommision,
        proposeduUndercollaterization,
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
      mintAmount
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
    global.securityAdrrTokenAccount = securityAdrrTokenAccount;
  });
  it("Vote on insurance proposal", async () => {
    const voteProposalAccount = await get_pda_from_seeds([
      Buffer.from("vote"),
      global.proposal.toBuffer(),
      global.securityAddr.publicKey.toBuffer(),
    ]);
    const voteProposalTokenAccount = await getAssociatedTokenAddress(
      global.tokenisedMint,
      voteProposalAccount,
      true
    );
    await program.methods
      .voteInsuranceProposal(securityAmount)
      .accounts({
        voter: global.securityAddr.publicKey,
        voterTokenAccount: global.securityAdrrTokenAccount,
        tokenisedMint: global.tokenisedMint,
        voteProposalAccount: voteProposalAccount,
        voteProposalTokenAccount: voteProposalTokenAccount,
        insurance: global.insurance,
        proposal: global.proposal,
        lp: global.lp,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.securityAddr])
      .rpc(rpcConfig);
    global.voteProposalAccount = voteProposalAccount;
    global.voteProposalTokenAccount = voteProposalTokenAccount;
  });
  it("Get insurance proposal vote money back", async () => {
    await sleep(5);
    await program.methods
      .refundProposalVote()
      .accounts({
        voter: global.securityAddr.publicKey,
        voterTokenAccount: global.securityAdrrTokenAccount,
        lp: global.lp,
        insurance: global.insurance,
        proposal: global.proposal,
        tokenisedMint: global.tokenisedMint,
        voteProposalAccount: global.voteProposalAccount,
        voteProposalTokenAccount: global.voteProposalTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.securityAddr])
      .rpc(rpcConfig);
  });
  it("Send insurance Proposal", async () => {
    const notifier = await create_keypair();
    await program.methods
      .acceptProposal()
      .accounts({
        notifier: notifier.publicKey,
        lp: global.lp,
        proposal: global.proposal,
      })
      .signers([notifier])
      .rpc(rpcConfig);
  });
  it("Accept insurance proposal", async () => {
    await program.methods
      .acceptReinsuranceProposal()
      .accounts({
        insuranceCreator: global.insuranceCreator.publicKey,
        insurance: global.insurance,
        lp: global.lp,
        proposal: global.proposal,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.insuranceCreator])
      .rpc(rpcConfig);
  });
  it("Pay premium on insurance", async () => {
    const premiumVault = await get_pda_from_seeds([
      Buffer.from("premium"),
      global.insurance.toBuffer(),
      global.proposal.toBuffer(),
    ]);
    const premiumVaultTokenAccount = await getAssociatedTokenAddress(
      global.mintAddress,
      premiumVault,
      true
    );

    const insuranceCreatorUsdcAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      global.insuranceCreator,
      global.mintAddress,
      global.insuranceCreator.publicKey
    );

    await transfer(
      connection,
      global.insuranceCreator,
      global.securityAddrUSDCAccount.address,
      insuranceCreatorUsdcAccount.address,
      global.securityAddr,
      securityAmount.toNumber()
    );

    await program.methods
      .payPremium(premiumMultiplier)
      .accounts({
        insuranceCreator: global.insuranceCreator.publicKey,
        insurance: global.insurance,
        premiumVault: premiumVault,
        premiumVaultTokenAccount: premiumVaultTokenAccount,
        insuranceCreatorUsdcAccount: insuranceCreatorUsdcAccount.address,
        proposal: global.proposal,
        lp: global.lp,
        usdcMint: global.mintAddress,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.insuranceCreator])
      .rpc(rpcConfig);
    global.premiumVault = premiumVault;
    global.premiumVaultTokenAccount = premiumVaultTokenAccount;
  });
  it("Raise claim", async () => {
    const claim = await get_pda_from_seeds([
      Buffer.from("claim"),
      global.proposal.toBuffer(),
      Buffer.from(claimId),
    ]);
    await program.methods
      .raiseClaim(claimId, claimAmount, claimMetadataLink)
      .accounts({
        insuranceCreator: global.insuranceCreator.publicKey,
        insurance: global.insurance,
        lp: global.lp,
        proposal: global.proposal,
        claim: claim,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.insuranceCreator])
      .rpc(rpcConfig);
    global.claim = claim;
  });
  it("Vote claim", async () => {
    const claimTokenAccount = await getAssociatedTokenAddress(
      global.mintAddress,
      global.claim,
      true
    );

    const claimVoteAccount = await get_pda_from_seeds([
      Buffer.from("vote_account"),
      global.claim.toBuffer(),
      global.securityAddr.publicKey.toBuffer(),
    ]);

    await program.methods
      .voteClaim(securityAmount, true)
      .accounts({
        voter: global.securityAddr.publicKey,
        voterTokenAccount: global.securityAddrUSDCAccount.address,
        claim: global.claim,
        claimTokenAccount: claimTokenAccount,
        claimVoteAccount: claimVoteAccount,
        usdcMint: global.mintAddress,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.securityAddr])
      .rpc(rpcConfig);
    global.claimVoteAccount = claimVoteAccount;
    global.claimTokenAccount = claimTokenAccount;
  });
  it("Make claim decision", async () => {
    await sleep(5);
    const notifier = await create_keypair();
    await program.methods
      .claimDecision()
      .accounts({
        decisionAsker: notifier.publicKey,
        claim: global.claim,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([notifier])
      .rpc(rpcConfig);
  });
  it("Get voting rewards", async () => {
    await program.methods
      .claimVotingReward(securityAmount)
      .accounts({
        voter: global.securityAddr.publicKey,
        claim: global.claim,
        voterTokenAccount: global.securityAddrUSDCAccount.address,
        claimTokenAccount: global.claimTokenAccount,
        claimVoteAccount: global.claimVoteAccount,
        usdcMint: global.mintAddress,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.securityAddr])
      .rpc(rpcConfig);
  });
  it("Propose strategy", async () => {
    const strategyProposer = await create_keypair();
    const proposedStrategy = await get_pda_from_seeds([
      Buffer.from("strategy"),
      Buffer.from(strategyId),
      global.premiumVault.toBuffer(),
    ]);

    await program.methods
      .proposeStrategy(strategyId, streamPayment, streamEvery, numberOfStreams)
      .accounts({
        strategyProposer: strategyProposer.publicKey,
        premiumVault: global.premiumVault,
        strategyProgram: strategyProgram,
        proposedStrategy: proposedStrategy,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([strategyProposer])
      .rpc(rpcConfig);
    global.proposedStrategy = proposedStrategy;
  });
  it("Vote strategy", async () => {
    const voteAccount = await get_pda_from_seeds([
      global.proposedStrategy.toBuffer(),
      global.securityAddr.publicKey.toBuffer(),
    ]);
    const voteTokenAccount = await getAssociatedTokenAddress(
      global.tokenisedMint,
      voteAccount,
      true
    );

    await program.methods
      .voteStrategy(securityAmount)
      .accounts({
        lpTokenOwner: global.securityAddr.publicKey,
        lpTokenOwnerAccount: global.securityAdrrTokenAccount,
        lp: global.lp,
        tokenisedMint: global.tokenisedMint,
        insurance: global.insurance,
        proposal: global.proposal,
        premiumVault: global.premiumVault,
        proposedStrategy: global.proposedStrategy,
        proposedStrategyVoteAccount: voteAccount,
        voteTokenAccount: voteTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.securityAddr])
      .rpc(rpcConfig);
    global.voteAccount = voteAccount;
    global.voteTokenAccount = voteTokenAccount;
  });
  it("Get refund on strategy vote", async () => {
    await sleep(7);
    await program.methods
      .refundStrategyVote()
      .accounts({
        lpTokenOwner: global.securityAddr.publicKey,
        lp: global.lp,
        lpTokenOwnerAccount: global.securityAdrrTokenAccount,
        tokenisedMint: global.tokenisedMint,
        proposedStrategy: global.proposedStrategy,
        proposedStrategyVoteAccount: global.voteAccount,
        voteTokenAccount: global.voteTokenAccount,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([global.securityAddr])
      .rpc(rpcConfig);
  });
  it("Accept strategy", async () => {
    const strategyAcceptor = await create_keypair();
    await program.methods
      .acceptStrategy()
      .accounts({
        strategyAccepter: strategyAcceptor.publicKey,
        lp: global.lp,
        tokenisedMint: global.tokenisedMint,
        insurance: global.insurance,
        proposal: global.proposal,
        premiumVault: global.premiumVault,
        proposedStrategy: global.proposedStrategy,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([strategyAcceptor])
      .rpc(rpcConfig);
  });
  it("Execute strategy", async () => {
    const executor = await create_keypair();
    const executorAccount = await create_keypair();

    await program.methods
      .executeStrategy()
      .accounts({
        executor: executor.publicKey,
        proposal: global.proposal,
        lp: global.lp,
        insurance: global.insurance,
        premiumVault: global.premiumVault,
        premiumVaultTokenAccount: global.premiumVaultTokenAccount,
        proposedStrategy: global.proposedStrategy,
        strategyProgram: strategyProgram,
        executorAccount: executorAccount.publicKey,
        usdcMint: global.mintAddress,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([executor])
      .rpc(rpcConfig);
  });
});
