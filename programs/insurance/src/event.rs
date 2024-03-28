use anchor_lang::prelude::*;

#[event]
pub struct InsurerRegistered {
    pub insurance_creator: Pubkey,
    pub verifying_documents: String,
    pub insurer: Pubkey,
}

#[event]
pub struct InsuranceCreated {
    pub insurer: Pubkey,
    pub insurance_id: String,
    pub coverage: u64,
    pub premium: u64,
    pub minimum_commission: i64,
    pub deductible: u64,
    pub expiry: i64,
    pub metadata_link: String,
    pub insurance: Pubkey,
}

#[event]
pub struct LPCreated {
    pub lp_creator: Pubkey,
    pub token_name: String,
    pub token_metadata_uri: String,
    pub token_symbol: String,
    pub ideal_size: u64,
    pub pool_lifecycle: i64,
    pub lp: Pubkey,
}

#[event]
pub struct LPAssetAdded {
    pub lp: Pubkey,
    pub asset_amount: u64,
    pub security_mint: Pubkey,
    pub security_addr: Pubkey,
}

#[event]
pub struct ReInsuranceProposalAccepted {
    pub reinsurance: Pubkey,
}

#[event]
pub struct ReInsuranceProposalProposed {
    pub lp: Pubkey,
    pub proposer: Pubkey,
    pub proposed_commision: u64,
    pub proposed_undercollaterization: u64,
    pub insurance: Pubkey,
    pub proposal_docs: String,
    pub proposal: Pubkey,
}

#[event]
pub struct ReInsuranceCalledOff {
    pub reinsurance: Pubkey,
}

#[event]
pub struct PremiumPayed {
    pub reinsurance: Pubkey,
    pub prepayment_time: i64,
    pub premium_vault: Pubkey,
}

#[event]
pub struct ReInsuranceClaimed {
    pub reinsurance: Pubkey,
    pub claim_amount: u64,
}

#[event]
pub struct StrategyProposed {
    pub strategy: Pubkey,
    pub stream_amount: u64,
    pub stream_every: u64,
    pub number_of_streams: u64,
    pub premium_vault: Pubkey,
    pub strategy_id: String,
    pub strategy_program: Pubkey,
}

#[event]
pub struct StrategyVoted {
    pub strategy: Pubkey,
    pub voter: Pubkey,
    pub vote_amount: u64,
    pub proposed_strategy_vote_account: Pubkey,
}

#[event]
pub struct StrategyAccepted {
    pub strategy: Pubkey,
}

#[event]
pub struct StrategyVoteRefunded {
    pub strategy: Pubkey,
    pub refunded_to: Pubkey,
    pub refund_amount: u64,
}

#[event]
pub struct ClaimRaised {
    pub reinsurance: Pubkey,
    pub claim: Pubkey,
    pub claim_amount: u64,
    pub claim_metadata_link: String,
}

#[event]
pub struct ClaimVoted {
    pub claim: Pubkey,
    pub voter: Pubkey,
    pub vote_amount: u64,
    pub claim_vote_account: Pubkey,
}

#[event]
pub struct ClaimDecisionReleased {
    pub claim: Pubkey,
    pub decision: bool,
}

#[event]
pub struct ClaimRewardReleased {
    pub claim: Pubkey,
    pub reward_amount: u64,
}

#[event]
pub struct StrategyExecuted {
    pub strategy: Pubkey,
}

#[event]
pub struct StrategyBlocked {
    pub strategy: Pubkey,
}

#[event]
pub struct InsuranceProposalVoted {
    pub voter: Pubkey,
    pub proposal: Pubkey,
    pub transfer_amount: u64,
    pub vote_proposal_account: Pubkey,
}

#[event]
pub struct ProposalVoteRefunded {
    pub voter: Pubkey,
    pub proposal: Pubkey,
}

#[event]
pub struct ProposalSent {
    pub proposal: Pubkey,
}

#[event]
pub struct SecurityRefunded {
    pub lp: Pubkey,
    pub refund_amount: u64,
    pub security_refund_amount: u64,
}

#[event]
pub struct SecurityTransferred {
    pub premium_vault: Pubkey,
    pub lp_usdc_account: Pubkey,
}
