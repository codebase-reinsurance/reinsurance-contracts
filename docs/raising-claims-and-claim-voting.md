# Raising Claims and claim voting

If an insurer wishes to raise a claim against the reinsurer for the release of security funds to cover some damages, it must first register the claim over the contract. It must send its claim amount, which must always be lower than or equal to the coverage, and a claim metadata link linking to all the resources to substantiate the insurer's claim.

The claim can then be voted upon by anybody with a Solana wallet using USDC. One USDC maps to one claim vote. This voting shall continue for a month, and people can vote for and against the claim motion. After a month, whichever side has more votes shall win the vote. Anybody that votes opposing the side that won shall lose all their vote amount and this amount shall be re-distributed to whoever voted on the winning side.

If the claim is accepted, the insurer can then use it to transfer the claim amount to his account from the LP security vault. This constitutes a loss for the LP and incase the LP can not make up for it by the end of its lifecycle, this will reflect as a loss in stablecoins refunded for the LP token holders.
