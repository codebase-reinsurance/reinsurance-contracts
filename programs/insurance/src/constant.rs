use anchor_lang::prelude::{constant, Pubkey};
use solana_program::pubkey;

#[constant]
pub const AUTHORIZED_PUBLIC_KEY: Pubkey = pubkey!("55kBY9yxqSC42boV8PywT2gqGzgLi5MPAtifNRgPNezF");
#[constant]
pub const MINUTE: i64 = 60;
#[constant]
pub const HOUR: i64 = 60 * MINUTE;
#[constant]
pub const DAY: i64 = 24 * HOUR;
#[constant]
pub const WEEK: i64 = 7 * DAY;
#[constant]
pub const TWO_WEEKS: i64 = 5 * MINUTE;
#[constant]
pub const MONTH: i64 = 5 * MINUTE;
#[constant]
pub const DEFAULT_MINT_DECIMALS: u8 = 6;
