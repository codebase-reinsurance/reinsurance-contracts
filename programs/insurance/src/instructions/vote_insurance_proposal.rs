use crate::{
    constant::MONTH,
    error::InsuranceEnumError,
    event::InsuranceProposalVoted,
    state::{Insurance, ReInsuranceProposal, ReInsuranceVoteAccount, LP},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    mint::USDC,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
#[instruction(transfer_amount:u64)]
pub struct VoteInsuranceProposal<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = tokenised_mint,
        associated_token::authority = voter,
        constraint = voter_token_account.amount >= transfer_amount
    )]
    pub voter_token_account: Account<'info, TokenAccount>,
    #[account(
        seeds = [
            lp.lp_creator.as_ref(),
            b"LP"
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
        init_if_needed,
        payer = voter,
        space = 8 + ReInsuranceVoteAccount::INIT_SPACE,
        seeds = [
            b"vote",
            proposal.key().as_ref(),
            voter.key().as_ref()
        ],
        bump
    )]
    pub vote_proposal_account: Account<'info, ReInsuranceVoteAccount>,
    #[account(
        init_if_needed,
        payer = voter,
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
        mut,
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

pub fn handler(ctx: Context<VoteInsuranceProposal>, transfer_amount: u64) -> Result<()> {
    let voter_token_account = &mut ctx.accounts.voter_token_account;
    let vote_proposal_token_account = &mut ctx.accounts.vote_proposal_token_account;
    let vote_proposal_account = &mut ctx.accounts.vote_proposal_account;
    let voter = &mut ctx.accounts.voter;
    let token_program = &ctx.accounts.token_program;
    let proposal = &mut ctx.accounts.proposal;
    let current_time = Clock::get()?.unix_timestamp;

    vote_proposal_account.bump = ctx.bumps.vote_proposal_account;

    require!(
        current_time - proposal.proposal_vote_start < MONTH,
        InsuranceEnumError::VoteInsuranceProposalEnded
    );

    transfer(
        CpiContext::new(
            token_program.to_account_info(),
            Transfer {
                from: voter_token_account.to_account_info(),
                to: vote_proposal_token_account.to_account_info(),
                authority: voter.to_account_info(),
            },
        ),
        transfer_amount,
    )?;

    proposal.proposal_vote += transfer_amount;

    emit!(InsuranceProposalVoted {
        voter: voter.key(),
        proposal: proposal.key(),
        transfer_amount: transfer_amount,
        vote_proposal_account: vote_proposal_account.key()
    });

    Ok(())
}
