use crate::{
    error::InsuranceEnumError,
    event::SecurityTransferred,
    state::{PremiumVault, ReInsuranceProposal, LP},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    mint::USDC,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
pub struct TransferToSecurity<'info> {
    pub transferrer: Signer<'info>,
    pub lp: Account<'info, LP>,
    #[account(
        constraint = proposal.lp_owner == lp.lp_creator
    )]
    pub proposal: Account<'info, ReInsuranceProposal>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = lp
    )]
    pub lp_usdc_account: Account<'info, TokenAccount>,
    #[account(
        constraint = premium_vault.reinsurance == proposal.key()
    )]
    pub premium_vault: Account<'info, PremiumVault>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = premium_vault
    )]
    pub premium_vault_token_account: Account<'info, TokenAccount>,
    // #[account(address=USDC)]
    pub usdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<TransferToSecurity>) -> Result<()> {
    let premium_vault_token_account = &mut ctx.accounts.premium_vault_token_account;
    let lp = &ctx.accounts.lp;
    let proposal = &ctx.accounts.proposal;
    let premium_vault = &ctx.accounts.premium_vault;
    let lp_usdc_account = &ctx.accounts.lp_usdc_account;
    let token_program = &ctx.accounts.token_program;
    let current_time = Clock::get()?.unix_timestamp;
    require!(
        lp.pool_lifecycle <= current_time,
        InsuranceEnumError::CanNotTransferToSecurityVaultBeforeLPClose
    );

    let binding = proposal.key();
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"premium",
        proposal.insurance.as_ref(),
        binding.as_ref(),
        &[premium_vault.bump],
    ]];

    transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: premium_vault_token_account.to_account_info(),
                to: lp_usdc_account.to_account_info(),
                authority: premium_vault.to_account_info(),
            },
            signer_seeds,
        ),
        premium_vault_token_account.amount,
    )?;

    emit!(SecurityTransferred {
        premium_vault: premium_vault.key(),
        lp_usdc_account: lp_usdc_account.key()
    });

    Ok(())
}
