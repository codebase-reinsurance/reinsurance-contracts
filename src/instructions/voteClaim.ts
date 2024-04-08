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
 * @category VoteClaim
 * @category generated
 */
export type VoteClaimInstructionArgs = {
  voteAmount: beet.bignum
  voteDirection: boolean
}
/**
 * @category Instructions
 * @category VoteClaim
 * @category generated
 */
export const voteClaimStruct = new beet.BeetArgsStruct<
  VoteClaimInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['voteAmount', beet.u64],
    ['voteDirection', beet.bool],
  ],
  'VoteClaimInstructionArgs'
)
/**
 * Accounts required by the _voteClaim_ instruction
 *
 * @property [_writable_, **signer**] voter
 * @property [_writable_] claim
 * @property [_writable_] voterTokenAccount
 * @property [_writable_] claimTokenAccount
 * @property [_writable_] claimVoteAccount
 * @property [] usdcMint
 * @property [] associatedTokenProgram
 * @category Instructions
 * @category VoteClaim
 * @category generated
 */
export type VoteClaimInstructionAccounts = {
  voter: web3.PublicKey
  claim: web3.PublicKey
  voterTokenAccount: web3.PublicKey
  claimTokenAccount: web3.PublicKey
  claimVoteAccount: web3.PublicKey
  usdcMint: web3.PublicKey
  associatedTokenProgram: web3.PublicKey
  tokenProgram?: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const voteClaimInstructionDiscriminator = [
  119, 71, 176, 255, 239, 225, 251, 107,
]

/**
 * Creates a _VoteClaim_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category VoteClaim
 * @category generated
 */
export function createVoteClaimInstruction(
  accounts: VoteClaimInstructionAccounts,
  args: VoteClaimInstructionArgs,
  programId = new web3.PublicKey('DajsLYULhHh3SVSDHsCCvnuHD8JeXgVf5mjfnQWpwzix')
) {
  const [data] = voteClaimStruct.serialize({
    instructionDiscriminator: voteClaimInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.voter,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.claim,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.voterTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.claimTokenAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.claimVoteAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.usdcMint,
      isWritable: false,
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
