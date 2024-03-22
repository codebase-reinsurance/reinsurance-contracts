use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey;

static IDS: [Pubkey; 1] = [pubkey!("5xFECAW3QY9nwfFSHhLAatHKZxcLv1ZtrMJEMs18rFik")];

#[derive(Clone)]
pub struct StrategyInterface;

impl anchor_lang::Ids for StrategyInterface {
    fn ids() -> &'static [Pubkey] {
        &IDS
    }
}
