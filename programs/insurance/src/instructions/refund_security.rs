use crate::{
    constant::DEFAULT_MINT_DECIMALS, error::InsuranceEnumError, event::SecurityRefunded, state::LP,
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    mint::USDC,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
#[instruction(refund_amount: u64)]
pub struct RefundSecurity<'info> {
    pub security_addr: Signer<'info>,
    #[account(
        mut,
        seeds = [
            lp.lp_creator.as_ref()
        ],
        bump=lp.bump
    )]
    pub lp: Account<'info, LP>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = security_addr
    )]
    pub security_addr_usdc_acc: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = tokenised_mint,
        associated_token::authority = security_addr,
        constraint = security_adder_token_addr.amount >= refund_amount
    )]
    pub security_adder_token_addr: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = lp
    )]
    pub lp_usdc_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = tokenised_mint,
        associated_token::authority = lp,
    )]
    pub security_mint: Account<'info, TokenAccount>,
    #[account(
        mint::authority = tokenised_mint,
        mint::decimals = DEFAULT_MINT_DECIMALS,
        seeds = [
            b"i_am_in_love",
            b"withacriminl",
            lp.key().as_ref()
        ],
        bump
    )]
    pub tokenised_mint: Account<'info, Mint>,
    // #[account(address=USDC)]
    pub usdc_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<RefundSecurity>,
    refund_amount: u64,
    security_refund_amount: u64,
) -> Result<()> {
    let lp = &ctx.accounts.lp;
    let token_program = &ctx.accounts.token_program;
    let security_mint = &mut ctx.accounts.security_mint;
    let security_adder_token_addr = &mut ctx.accounts.security_adder_token_addr;
    let security_addr = &ctx.accounts.security_addr;
    let tokenised_mint = &ctx.accounts.tokenised_mint;
    let lp_usdc_account = &mut ctx.accounts.lp_usdc_account;
    let security_addr_usdc_acc = &mut ctx.accounts.security_addr_usdc_acc;
    let current_time = Clock::get()?.unix_timestamp;
    let free_floating_tokens = tokenised_mint.supply - security_mint.amount;
    require!(
        security_refund_amount * free_floating_tokens == refund_amount * lp_usdc_account.amount,
        InsuranceEnumError::SecurityRefundAmountEnteredIncorrect
    );
    require!(
        lp.pool_lifecycle <= current_time,
        InsuranceEnumError::CanNotRefundBeforePoolClose
    );

    transfer(
        CpiContext::new(
            token_program.to_account_info(),
            Transfer {
                from: security_adder_token_addr.to_account_info(),
                to: security_mint.to_account_info(),
                authority: security_addr.to_account_info(),
            },
        ),
        refund_amount,
    )?;

    let signer_seeds: &[&[&[u8]]] = &[&[lp.lp_creator.as_ref(), &[lp.bump]]];

    transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: lp_usdc_account.to_account_info(),
                to: security_addr_usdc_acc.to_account_info(),
                authority: lp.to_account_info(),
            },
            signer_seeds,
        ),
        security_refund_amount,
    )?;

    emit!(SecurityRefunded {
        lp: lp.key(),
        refund_amount: refund_amount,
        security_refund_amount: security_refund_amount
    });

    Ok(())
}
