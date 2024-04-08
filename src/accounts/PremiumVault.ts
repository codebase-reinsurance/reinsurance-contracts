/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'

/**
 * Arguments used to create {@link PremiumVault}
 * @category Accounts
 * @category generated
 */
export type PremiumVaultArgs = {
  bump: number
  reinsurance: web3.PublicKey
}

export const premiumVaultDiscriminator = [114, 209, 248, 84, 69, 241, 209, 112]
/**
 * Holds the data for the {@link PremiumVault} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class PremiumVault implements PremiumVaultArgs {
  private constructor(
    readonly bump: number,
    readonly reinsurance: web3.PublicKey
  ) {}

  /**
   * Creates a {@link PremiumVault} instance from the provided args.
   */
  static fromArgs(args: PremiumVaultArgs) {
    return new PremiumVault(args.bump, args.reinsurance)
  }

  /**
   * Deserializes the {@link PremiumVault} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [PremiumVault, number] {
    return PremiumVault.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link PremiumVault} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<PremiumVault> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find PremiumVault account at ${address}`)
    }
    return PremiumVault.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'DajsLYULhHh3SVSDHsCCvnuHD8JeXgVf5mjfnQWpwzix'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, premiumVaultBeet)
  }

  /**
   * Deserializes the {@link PremiumVault} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [PremiumVault, number] {
    return premiumVaultBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link PremiumVault} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return premiumVaultBeet.serialize({
      accountDiscriminator: premiumVaultDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link PremiumVault}
   */
  static get byteSize() {
    return premiumVaultBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link PremiumVault} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      PremiumVault.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link PremiumVault} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === PremiumVault.byteSize
  }

  /**
   * Returns a readable version of {@link PremiumVault} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      bump: this.bump,
      reinsurance: this.reinsurance.toBase58(),
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const premiumVaultBeet = new beet.BeetStruct<
  PremiumVault,
  PremiumVaultArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['bump', beet.u8],
    ['reinsurance', beetSolana.publicKey],
  ],
  PremiumVault.fromArgs,
  'PremiumVault'
)
