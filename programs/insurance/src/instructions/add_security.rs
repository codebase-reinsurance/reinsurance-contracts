use crate::{constant::DEFAULT_MINT_DECIMALS, event::LPAssetAdded, state::LP};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    mint::USDC,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
#[instruction(transfer_amount:u64)]
pub struct AddSecurity<'info> {
    #[account(mut)]
    pub security_addr: Signer<'info>,
    #[account(
        mut,
        seeds = [
            lp.lp_creator.as_ref(),
            b"LP"
        ],
        bump=lp.bump
    )]
    pub lp: Account<'info, LP>,
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = security_addr,
        constraint = security_addr_usdc_acc.amount >= transfer_amount
    )]
    pub security_addr_usdc_acc: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = security_addr,
        associated_token::mint = tokenised_mint,
        associated_token::authority = security_addr,
    )]
    pub security_adder_token_addr: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = security_addr,
        associated_token::mint = usdc_mint,
        associated_token::authority = lp
    )]
    pub lp_usdc_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = tokenised_mint,
        associated_token::authority = lp,
        constraint = security_mint.amount >= transfer_amount
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

pub fn handler(ctx: Context<AddSecurity>, transfer_amount: u64) -> Result<()> {
    let lp = &mut ctx.accounts.lp;
    let security_addr = &mut ctx.accounts.security_addr;
    let security_addr_usdc_acc = &mut ctx.accounts.security_addr_usdc_acc;
    let security_adder_token_addr = &mut ctx.accounts.security_adder_token_addr;
    let lp_usdc_account = &mut ctx.accounts.lp_usdc_account;
    let token_program = &ctx.accounts.token_program;
    let security_mint = &mut ctx.accounts.security_mint;

    let signer_seeds: &[&[&[u8]]] = &[&[lp.lp_creator.as_ref(), b"LP", &[lp.bump]]];

    transfer(
        CpiContext::new(
            token_program.to_account_info(),
            Transfer {
                from: security_addr_usdc_acc.to_account_info(),
                to: lp_usdc_account.to_account_info(),
                authority: security_addr.to_account_info(),
            },
        ),
        transfer_amount,
    )?;

    transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: security_mint.to_account_info(),
                to: security_adder_token_addr.to_account_info(),
                authority: lp.to_account_info(),
            },
            signer_seeds,
        ),
        transfer_amount,
    )?;

    lp.total_assets += transfer_amount;

    emit!(LPAssetAdded {
        lp: lp.key(),
        asset_amount: transfer_amount,
        security_addr: security_addr.key(),
        security_mint: security_mint.key()
    });

    Ok(())
}
