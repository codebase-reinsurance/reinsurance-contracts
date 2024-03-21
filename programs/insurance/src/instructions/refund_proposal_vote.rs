use crate::{
    constant::MONTH,
    error::InsuranceEnumError,
    event::ProposalVoteRefunded,
    state::{Insurance, ReInsuranceProposal, ReInsuranceVoteAccount, LP},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    mint::USDC,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
pub struct RefundProposalVote<'info> {
    pub voter: Signer<'info>,
    #[account(
        associated_token::mint = tokenised_mint,
        associated_token::authority = voter,
    )]
    pub voter_token_account: Account<'info, TokenAccount>,
    #[account(
        seeds = [
            lp.lp_creator.as_ref()
        ],
        bump=lp.bump
    )]
    pub lp: Account<'info, LP>,
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
        mut,
        seeds = [
            b"vote",
            proposal.key().as_ref(),
            voter.key().as_ref()
        ],
        bump=vote_proposal_account.bump
    )]
    pub vote_proposal_account: Account<'info, ReInsuranceVoteAccount>,
    #[account(
        mut,
        associated_token::mint = tokenised_mint,
        associated_token::authority = vote_proposal_account,
    )]
    pub vote_proposal_token_account: Account<'info, TokenAccount>,
    #[account(
        seeds = [
            insurance.insurer.as_ref(),
            insurance.insurance_id.as_bytes()
        ],
        bump=insurance.bump
    )]
    pub insurance: Account<'info, Insurance>,
    #[account(
        seeds = [
            lp.key().as_ref(),
            insurance.key().as_ref()
        ],
        bump=proposal.bump
    )]
    pub proposal: Account<'info, ReInsuranceProposal>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RefundProposalVote>) -> Result<()> {
    let proposal = &ctx.accounts.proposal;
    let token_program = &ctx.accounts.token_program;
    let voter_token_account = &ctx.accounts.voter_token_account;
    let vote_proposal_account = &mut ctx.accounts.vote_proposal_account;
    let vote_proposal_token_account = &mut ctx.accounts.vote_proposal_token_account;
    let voter = &ctx.accounts.voter;
    let current_time = Clock::get()?.unix_timestamp;

    require!(
        current_time - proposal.proposal_vote_start >= MONTH,
        InsuranceEnumError::VotingOnInsuranceProposalOngoing
    );

    let proposal_binding = proposal.key();
    let voter_binding = voter.key();
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"vote",
        proposal_binding.as_ref(),
        voter_binding.as_ref(),
        &[vote_proposal_account.bump],
    ]];

    transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: vote_proposal_token_account.to_account_info(),
                to: voter_token_account.to_account_info(),
                authority: vote_proposal_account.to_account_info(),
            },
            signer_seeds,
        ),
        vote_proposal_token_account.amount,
    )?;

    emit!(ProposalVoteRefunded {
        voter: voter.key(),
        proposal: proposal.key()
    });

    Ok(())
}
