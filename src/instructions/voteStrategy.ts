/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category VoteStrategy
 * @category generated
 */
export type VoteStrategyInstructionArgs = {
  voteAmount: beet.bignum
}
/**
 * @category Instructions
 * @category VoteStrategy
 * @category generated
 */
export const voteStrategyStruct = new beet.BeetArgsStruct<
  VoteStrategyInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['voteAmount', beet.u64],
  ],
  'VoteStrategyInstructionArgs'
)
/**
 * Accounts required by the _voteStrategy_ instruction
 *
 * @property [_writable_, **signer**] lpTokenOwner
 * @property [_writable_] lp
 * @property [] tokenisedMint
 * @property [] insurance
 * @property [_writable_] lpTokenOwnerAccount
 * @property [] proposal
 * @property [] premiumVault
 * @property [_writable_] proposedStrategy
 * @property [_writable_] proposedStrategyVoteAccount
 * @property [_writable_] voteTokenAccount
 * @property [] associatedTokenProgram
 * @category Instructions
 * @category VoteStrategy
 * @category generated
 */
export type VoteStrategyInstructionAccounts = {
  lpTokenOwner: web3.PublicKey
  lp: web3.PublicKey
  tokenisedMint: web3.PublicKey
  insurance: web3.PublicKey
  lpTokenOwnerAccount: web3.PublicKey
  proposal: web3.PublicKey
  premiumVault: web3.PublicKey
  proposedStrategy: web3.PublicKey
  proposedStrategyVoteAccount: web3.PublicKey
  voteTokenAccount: web3.PublicKey
  associatedTokenProgram: web3.PublicKey
  tokenProgram?: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const voteStrategyInstructionDiscriminator = [
  206, 184, 154, 230, 42, 91, 198, 163,
]

/**
 * Creates a _VoteStrategy_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category VoteStrategy
 * @category generated
 */
export function createVoteStrategyInstruction(
  accounts: VoteStrategyInstructionAccounts,
  args: VoteStrategyInstructionArgs,
  programId = new web3.PublicKey('DajsLYULhHh3SVSDHsCCvnuHD8JeXgVf5mjfnQWpwzix')
) {
  const [data] = voteStrategyStruct.serialize({
    instructionDiscriminator: voteStrategyInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.lpTokenOwner,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.lp,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenisedMint,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.insurance,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.lpTokenOwnerAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.proposal,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.premiumVault,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.proposedStrategy,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.proposedStrategyVoteAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.voteTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.associatedTokenProgram,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
