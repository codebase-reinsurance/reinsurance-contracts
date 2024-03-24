use anchor_lang::error_code;

#[error_code]
pub enum InsuranceEnumError {
    // 6000
    #[msg("Can not create insurance that exists for less than 1 month")]
    InsuranceExpiryTooClose,

    // 6001
    #[msg("Can not send reinsurance proposal on expired insurance")]
    InsuranceExpired,

    // 6002
    #[msg("Insurance already re-insured")]
    InsuranceReinsuredAlready,

    // 6003
    #[msg("Reinsurance can not be called off unless premium more than week late")]
    CanNotCallOffReinsurance,

    // 6004
    #[msg("Specified metadta outside accepted range")]
    OutsideValidRange,

    // 6005
    #[msg("LP can not fulfill under-collaterisation constraints")]
    CanNotFullFillUnderCollateralizationDemands,

    // 6006
    #[msg("Not enough voting power")]
    InsufficientVotingPower,

    // 6007
    #[msg("Voting on strategy closed!")]
    VotingOnStrategyClosed,

    // 6008
    #[msg("Not enought votes to accept")]
    NotEnoughVotes,

    // 6009
    #[msg("Can not refund before voting closes")]
    RefundDeclined,

    // 6010
    #[msg("Can not raise claim greater than coverage amount")]
    ClaimTooHigh,

    // 6011
    #[msg("Claim voting closes after 1 month")]
    ClaimVotingClosed,

    // 6012
    #[msg("Can not release decision before voting closes")]
    DecisionNotYetReleased,

    // 6013
    #[msg("Sadly your claim vote did not win!")]
    ClaimVoteDidNotWin,

    // 6014
    #[msg("Incorrect Reward entered")]
    IncorrectRewardAmount,

    // 6015
    #[msg("Strategy can not use fund higher than allocated")]
    StrategyAllocationTooHigh,

    // 6016
    #[msg("Stream date not yet reached")]
    StreamMaturationNotYetReached,

    // 6017
    #[msg("All strategy streams already payed")]
    StrategyStreamsEnded,

    // 6018
    #[msg("Strategy blocked due to security reasons")]
    StrategyBlocked,

    // 6019
    #[msg("Voting on insurance proposal ended")]
    VoteInsuranceProposalEnded,

    // 6020
    #[msg("Voting on insurance proposal has not ended yet")]
    VotingOnInsuranceProposalOngoing,

    // 6021
    #[msg("Voting did not accept this insurance proposal")]
    VoteOnInsuranceProposalUnSuccessful,

    // 6022
    #[msg("Incorrect metadata account sent")]
    IncorrectMetadataAccount,

    // 6023
    #[msg("Can not reinsure insurance beyond pool lifecycle")]
    PoolLifecycleExceeded,

    // 6024
    #[msg("Can not have lifecycle end in past")]
    LifeCycleCanNotEndInPast,

    // 6025
    #[msg("Pool not closed yet")]
    CanNotRefundBeforePoolClose,

    // 6026
    #[msg("Security refund calc incorrect")]
    SecurityRefundAmountEnteredIncorrect,

    // 6027
    #[msg("Can not transfer before lp close")]
    CanNotTransferToSecurityVaultBeforeLPClose,
}
