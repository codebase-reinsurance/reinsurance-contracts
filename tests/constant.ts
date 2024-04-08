import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@saberhq/solana-contrib";

const insurerDescription: string =
  "https://en.aap.eu/chimpanzee-facts-and-figures/";
const insuranceId: string = "1";
const coverage: BN = new BN(1);
const premium: BN = new BN(1);
const minimumCommission: BN = new BN(0);
const deductible: BN = new BN(1);
const insuranceMetadataLink: string =
  "https://en.aap.eu/chimpanzee-facts-and-figures/";
const proposedCommision: BN = new BN(2);
const proposeduUndercollaterization: BN = new BN(10);
const proposalMetadataLink: string =
  "https://en.aap.eu/chimpanzee-facts-and-figures/";
const securityAmount: BN = new BN(9000);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const premiumMultiplier: BN = new BN(1);
const idealSize: BN = new BN(10000);
const tokenName = "Hi!";
const tokenimage = "BRR";
const tokenMetadata =
  "https://en.wikipedia.org/wiki/File:Bonnet_macaque_(Macaca_radiata)_Photograph_By_Shantanu_Kuveskar.jpg";
const mintAmount: number = 200000;
const strategyId: string = "1";
const streamPayment: BN = new BN(1);
const streamEvery: BN = new BN(10000);
const numberOfStreams: BN = new BN(1);
const strategyProgram: PublicKey = new PublicKey(
  "5xFECAW3QY9nwfFSHhLAatHKZxcLv1ZtrMJEMs18rFik"
);
const claimId: string = "1";
const proposalId: string = "1";
const claimAmount: BN = new BN(1);
const claimMetadataLink: string =
  "https://en.wikipedia.org/wiki/File:Bonnet_macaque_(Macaca_radiata)_Photograph_By_Shantanu_Kuveskar.jpg";
const poolLifecycle = new BN(10368000);

export {
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
  securityAmount,
  TOKEN_METADATA_PROGRAM_ID,
  premiumMultiplier,
  idealSize,
  tokenName,
  tokenMetadata,
  tokenimage,
  mintAmount,
  strategyId,
  streamPayment,
  streamEvery,
  numberOfStreams,
  strategyProgram,
  claimId,
  claimAmount,
  claimMetadataLink,
  poolLifecycle,
  proposalId,
};
