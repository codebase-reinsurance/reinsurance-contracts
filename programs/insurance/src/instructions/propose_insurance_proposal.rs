use crate::{
    error::InsuranceEnumError,
    event::ReInsuranceProposalProposed,
    state::{Insurance, ReInsuranceProposal, LP},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct SendInsuranceProposal<'info> {
    #[account(mut)]
    pub proposal_proposer: Signer<'info>,
    pub lp: Account<'info, LP>,
    #[account(
        seeds = [
            insurance.insurer.as_ref(),
            insurance.insurance_id.as_bytes()
        ],
        bump=insurance.bump
    )]
    pub insurance: Account<'info, Insurance>,
    #[account(
        init_if_needed,
        payer = proposal_proposer,
        space = 8 + ReInsuranceProposal::INIT_SPACE,
        seeds = [
            lp.key().as_ref(),
            insurance.key().as_ref()
        ],
        bump
    )]
    pub proposal: Account<'info, ReInsuranceProposal>,
    #[account(
        seeds = [
            b"i_am_in_love",
            b"withacriminl",
            lp.key().as_ref()
        ],
        bump
    )]
    pub tokenised_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = proposal_proposer,
        associated_token::mint = tokenised_mint,
        associated_token::authority = proposal,
    )]
    pub proposal_token_account: Account<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<SendInsuranceProposal>,
    proposed_commision: u64,
    proposed_undercollaterization: u64,
    proposal_docs: String,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;
    let lp = &ctx.accounts.lp;
    let insurance = &ctx.accounts.insurance;
    let proposal_proposer = &mut ctx.accounts.proposal_proposer;
    let current_time = Clock::get()?.unix_timestamp;

    require!(
        insurance.expiry > current_time,
        InsuranceEnumError::InsuranceExpired
    );
    require!(
        !insurance.reinsured,
        InsuranceEnumError::InsuranceReinsuredAlready
    );

    proposal.bump = ctx.bumps.proposal;
    proposal.lp_owner = lp.lp_creator;
    proposal.proposed_commision = proposed_commision;
    proposal.proposed_undercollaterization = proposed_undercollaterization;
    proposal.insurance = insurance.key();
    proposal.proposal_docs = proposal_docs.clone();
    proposal.proposal_accepted = false;
    proposal.proposal_sent = false;
    proposal.proposal_vote = 0;
    proposal.proposal_vote_start = current_time;

    emit!(ReInsuranceProposalProposed {
        lp: lp.key(),
        proposer: proposal_proposer.key(),
        proposed_commision: proposed_commision,
        proposed_undercollaterization: proposed_undercollaterization,
        insurance: insurance.key(),
        proposal_docs: proposal_docs
    });

    Ok(())
}
