use anchor_lang::prelude::Pubkey;
use anchor_spl::metadata::mpl_token_metadata::ID;

const PREFIX: &str = "metadata";

pub fn find_metadata_account(mint: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(&[PREFIX.as_bytes(), ID.as_ref(), mint.as_ref()], &ID)
}
