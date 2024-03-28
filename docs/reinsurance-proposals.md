# Reinsurance Proposals

Insurers can register their insurance with all the necessary details such as coverage, premium(charged every two weeks), minimum commission(minimum acceptable commission in premium that insurer demands, set this to zero if you are a codebase insurer), deductible, expiry, and any other optional metadata may also be sent.&#x20;

These insurances can then be bidded upon by the liquidity pools. To set a bid, the liquidity provider must first vote on a proposal internally. The voting on such an internal proposal continues for a month. To vote, a wallet must pledge its tokens to a secure vault until the period of voting ends. The voter would be refunded their tokens after the end of the voting period. This is to prevent double-voting issues. Each token is weighted as one vote. The proposal gets accepted if it has gotten votes equal to or more than half the value of the total assets(USDC, USDT) of the liquidity pool.

Once a proposal is sent, the insurer can decide to accept or not accept it. The insurer may accept any offer they receive on their insurance to reinsure as they place.
