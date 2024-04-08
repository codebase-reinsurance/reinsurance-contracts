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
 * @category RefundStrategyVote
 * @category generated
 */
export const refundStrategyVoteStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'RefundStrategyVoteInstructionArgs'
)
/**
 * Accounts required by the _refundStrategyVote_ instruction
 *
 * @property [**signer**] lpTokenOwner
 * @property [_writable_] lp
 * @property [] tokenisedMint
 * @property [_writable_] lpTokenOwnerAccount
 * @property [] proposedStrategy
 * @property [_writable_] proposedStrategyVoteAccount
 * @property [_writable_] voteTokenAccount
 * @property [] associatedTokenProgram
 * @category Instructions
 * @category RefundStrategyVote
 * @category generated
 */
export type RefundStrategyVoteInstructionAccounts = {
  lpTokenOwner: web3.PublicKey
  lp: web3.PublicKey
  tokenisedMint: web3.PublicKey
  lpTokenOwnerAccount: web3.PublicKey
  proposedStrategy: web3.PublicKey
  proposedStrategyVoteAccount: web3.PublicKey
  voteTokenAccount: web3.PublicKey
  associatedTokenProgram: web3.PublicKey
  tokenProgram?: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const refundStrategyVoteInstructionDiscriminator = [
  163, 11, 15, 3, 143, 244, 15, 196,
]

/**
 * Creates a _RefundStrategyVote_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category RefundStrategyVote
 * @category generated
 */
export function createRefundStrategyVoteInstruction(
  accounts: RefundStrategyVoteInstructionAccounts,
  programId = new web3.PublicKey('DajsLYULhHh3SVSDHsCCvnuHD8JeXgVf5mjfnQWpwzix')
) {
  const [data] = refundStrategyVoteStruct.serialize({
    instructionDiscriminator: refundStrategyVoteInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.lpTokenOwner,
      isWritable: false,
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
      pubkey: accounts.lpTokenOwnerAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.proposedStrategy,
      isWritable: false,
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
