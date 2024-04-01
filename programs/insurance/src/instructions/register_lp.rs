use crate::constant::DEFAULT_MINT_DECIMALS;
use crate::error::InsuranceEnumError;
use crate::helper::find_metadata_account;
use crate::{event::LPCreated, state::LP};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct RegisterLP<'info> {
    #[account(mut)]
    pub lp_creator: Signer<'info>,
    #[account(
        init,
        payer=lp_creator,
        space=8+LP::INIT_SPACE,
        seeds = [
            lp_creator.key().as_ref(),
            b"LP"
        ],
        bump
    )]
    pub lp: Account<'info, LP>,
    #[account(
        init_if_needed,
        payer = lp_creator,
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
    #[account(
        init_if_needed,
        payer = lp_creator,
        associated_token::mint = tokenised_mint,
        associated_token::authority = lp,
    )]
    pub security_mint: Account<'info, TokenAccount>,
    /// CHECK: We're about to create this with Metaplex
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<RegisterLP>,
    ideal_size: u64,
    pool_lifecycle: i64,
    token_name: String,
    token_symbol: String,
    token_metadata_uri: String,
) -> Result<()> {
    let lp_creator = &mut ctx.accounts.lp_creator;
    let lp = &mut ctx.accounts.lp;
    let current_time = Clock::get()?.unix_timestamp;
    let security_mint = &mut ctx.accounts.security_mint;
    let tokenised_mint = &mut ctx.accounts.tokenised_mint;
    let system_program = &ctx.accounts.system_program;
    let metadata = &mut ctx.accounts.metadata;
    let rent = &ctx.accounts.rent;
    let token_program = &ctx.accounts.token_program;
    let lifecycle = current_time + pool_lifecycle;

    require!(
        metadata
            .key()
            .eq(&(find_metadata_account(&tokenised_mint.key()).0)),
        InsuranceEnumError::IncorrectMetadataAccount
    );
    require!(lifecycle > 0, InsuranceEnumError::LifeCycleCanNotEndInPast);

    lp.bump = ctx.bumps.lp;
    lp.lp_creator = lp_creator.key();
    lp.insures = vec![];
    lp.undercollaterization_promised = vec![];
    lp.total_securitized = 0;
    lp.total_assets = 0;
    lp.max_undercollaterization_promised = 0;
    lp.ideal_size = ideal_size;
    lp.pool_lifecycle = lifecycle;

    let binding = lp.key();
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"i_am_in_love",
        b"withacriminl",
        binding.as_ref(),
        &[ctx.bumps.tokenised_mint],
    ]];

    // On-chain token metadata for the mint
    let data_v2 = DataV2 {
        name: token_name.clone(),
        symbol: token_symbol.clone(),
        uri: token_metadata_uri.clone(),
        seller_fee_basis_points: 0,
        creators: None,
        collection: None,
        uses: None,
    };

    let cpi_ctx = CpiContext::new_with_signer(
        tokenised_mint.to_account_info(),
        CreateMetadataAccountsV3 {
            metadata: metadata.to_account_info(),
            mint: tokenised_mint.to_account_info(),
            mint_authority: tokenised_mint.to_account_info(),
            update_authority: tokenised_mint.to_account_info(),
            payer: lp_creator.to_account_info(),
            system_program: system_program.to_account_info(),
            rent: rent.to_account_info(),
        },
        signer_seeds,
    );

    create_metadata_accounts_v3(cpi_ctx, data_v2, true, true, None)?;

    mint_to(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            MintTo {
                mint: tokenised_mint.to_account_info(),
                to: security_mint.to_account_info(),
                authority: tokenised_mint.to_account_info(),
            },
            signer_seeds,
        ),
        ideal_size,
    )?;

    emit!(LPCreated {
        lp_creator: lp_creator.key(),
        token_name: token_name,
        token_metadata_uri: token_metadata_uri,
        token_symbol: token_symbol,
        ideal_size: ideal_size,
        pool_lifecycle: lifecycle,
        lp: lp.key()
    });

    Ok(())
}
