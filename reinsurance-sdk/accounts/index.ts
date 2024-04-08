export * from "./Claim";
export * from "./ClaimVoteAccount";
export * from "./Insurance";
export * from "./Insurer";
export * from "./LP";
export * from "./PremiumVault";
export * from "./ReInsuranceProposal";
export * from "./ReInsuranceVoteAccount";
export * from "./StrategyAccount";
export * from "./StrategyVoteAccount";

import { Insurer } from "./Insurer";
import { Insurance } from "./Insurance";
import { LP } from "./LP";
import { ReInsuranceProposal } from "./ReInsuranceProposal";
import { ReInsuranceVoteAccount } from "./ReInsuranceVoteAccount";
import { PremiumVault } from "./PremiumVault";
import { StrategyAccount } from "./StrategyAccount";
import { StrategyVoteAccount } from "./StrategyVoteAccount";
import { Claim } from "./Claim";
import { ClaimVoteAccount } from "./ClaimVoteAccount";

export const accountProviders = {
  Insurer,
  Insurance,
  LP,
  ReInsuranceProposal,
  ReInsuranceVoteAccount,
  PremiumVault,
  StrategyAccount,
  StrategyVoteAccount,
  Claim,
  ClaimVoteAccount,
};
