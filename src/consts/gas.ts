// Worst case plus 10%: fresh recipient, first message on the lane, first mint on the chain.
export const JOCX_BURN_LZ_RECEIVE_GAS_LIMIT = 90546; // 82,314 gas used plus 10%
export const JOCX_SEND_LZ_RECEIVE_GAS_LIMIT = 105448; // 94,449 gas used; old mint limit kept (same lzReceive path as mint)
export const JOCX_MINT_LZ_RECEIVE_GAS_LIMIT = 105448; // 94,449 gas used; old 105,448 kept (old measurement was 95,862)

export const OFTX_BURN_LZ_RECEIVE_GAS_LIMIT = 130908; // 119,007 gas used plus 10%
export const OFTX_BURN_LZ_COMPOSE_GAS_LIMIT = 82496; // 71,525 gas used; old 82,496 kept (~15% margin)
export const OFTX_SEND_LZ_RECEIVE_GAS_LIMIT = 98364; // 89,421 gas used plus 10%

export const USDA_MINT_LZ_RECEIVE_GAS_LIMIT = 200000;
export const USDA_SEND_LZ_RECEIVE_GAS_LIMIT = 200000;

export const TREASURY_MINT_LZ_RECEIVE_GAS_LIMIT = 200000;
export const TREASURY_MINT_LZ_COMPOSE_GAS_LIMIT = 500000;

export const OFTA_BURN_LZ_RECEIVE_GAS_LIMIT = 200000;
export const OFTA_BURN_LZ_COMPOSE_GAS_LIMIT = 500000;
