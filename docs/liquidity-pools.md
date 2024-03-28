# Liquidity Pools

Liquidity Pools are the reinsurers of the contracts. Anybody who creates a Liquidity provider will be the de facto "owner" of the liquidity pool over the public network but do keep in mind as most powers are distributed by voting later on, being an owner does not give much control over the pool by itself. It merely stamps one as its initial creator.

To create a pool, one would need to have a Solana wallet, a proposed token name, and a symbol URI for the token as well as a token metadata link in the form that metaplex requires to make a metadata account. It furthermore requires to send an ideal pool size and pool lifecycle.&#x20;

The ideal pool size is the amount of tokens initially minted and represents the ideal size of the pool in USDT/USDC. These minted tokens are kept in a security vault and can be exchanged for an equivalent amount in USDT/USDC over the contract by any individual with a Solana wallet.&#x20;

Pool lifecycle represents the time for which the pool will be alive after the current time in seconds. For example, a pool that expires in 360 days will have a Pool lifecycle of 360\*24\*60\*60=31104000. The pool can not reinsure insurance beyond its expiry date. At the end of the Pool lifecycle, all profits and losses will be realized and token owners will be able to exchange tokens for USDC/USDT. The price at which the transaction occurs will be based on the profits/losses realized by the pool over its lifetime.
