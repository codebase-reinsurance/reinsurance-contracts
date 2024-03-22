use crate::{
    constant::MONTH,
    error::InsuranceEnumError,
    event::ProposalSent,
    state::{ReInsuranceProposal, LP},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct AcceptInsuranceProposal<'info> {
    pub notifier: Signer<'info>,
    pub lp: Account<'info, LP>,
    #[account(mut,constraint=proposal.lp_owner==lp.lp_creator)]
    pub proposal: Account<'info, ReInsuranceProposal>,
}

pub fn handler(ctx: Context<AcceptInsuranceProposal>) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let lp = &ctx.accounts.lp;
    let current_time = Clock::get()?.unix_timestamp;

    require!(
        current_time - proposal.proposal_vote_start >= MONTH,
        InsuranceEnumError::VotingOnInsuranceProposalOngoing
    );

    require!(
        proposal.proposal_vote * 2 >= lp.total_assets,
        InsuranceEnumError::VoteOnInsuranceProposalUnSuccessful
    );
    proposal.proposal_sent = true;

    emit!(ProposalSent {
        proposal: proposal.key()
    });

    Ok(())
}
