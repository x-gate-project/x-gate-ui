---
"@x-gate-project/x-gate-ui": patch
---

Fix tx history explorer links: testnet x-gate scan links no longer include an extra `/testnet` path, and same-chain transactions open the explorer of the chain they were sent on instead of always Etherscan (#124).
