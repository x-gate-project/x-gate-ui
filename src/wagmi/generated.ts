import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

import {
  createReadContract,
  createWriteContract,
  createSimulateContract,
  createWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// noftx
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const noftxAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_lzEndpoint', internalType: 'address', type: 'address' },
      { name: '_delegate', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'InvalidDelegate' },
  { type: 'error', inputs: [], name: 'InvalidEndpointCall' },
  { type: 'error', inputs: [], name: 'InvalidLocalDecimals' },
  {
    type: 'error',
    inputs: [{ name: 'options', internalType: 'bytes', type: 'bytes' }],
    name: 'InvalidOptions',
  },
  { type: 'error', inputs: [], name: 'LzTokenUnavailable' },
  {
    type: 'error',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'NoPeer',
  },
  {
    type: 'error',
    inputs: [{ name: 'msgValue', internalType: 'uint256', type: 'uint256' }],
    name: 'NotEnoughNative',
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'OnlyEndpoint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'OnlyPeer',
  },
  { type: 'error', inputs: [], name: 'OnlySelf' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  {
    type: 'error',
    inputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    name: 'SimulationResult',
  },
  {
    type: 'error',
    inputs: [
      { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SlippageExceeded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_enforcedOptions',
        internalType: 'struct EnforcedOptionParam[]',
        type: 'tuple[]',
        components: [
          { name: 'eid', internalType: 'uint32', type: 'uint32' },
          { name: 'msgType', internalType: 'uint16', type: 'uint16' },
          { name: 'options', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
    ],
    name: 'EnforcedOptionSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'inspector',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MsgInspectorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'srcEid',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'toAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountReceivedLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OFTReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'dstEid',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'fromAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountSentLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountReceivedLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OFTSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32', indexed: false },
      {
        name: 'peer',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'PeerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'preCrimeAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PreCrimeSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SEND',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SEND_AND_CALL',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    name: 'allowInitializePath',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'approvalRequired',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_msgType', internalType: 'uint16', type: 'uint16' },
      { name: '_extraOptions', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'combineOptions',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimalConversionRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endpoint',
    outputs: [
      {
        name: '',
        internalType: 'contract ILayerZeroEndpointV2',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'msgType', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'enforcedOptions',
    outputs: [{ name: 'enforcedOption', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '_sender', internalType: 'address', type: 'address' },
    ],
    name: 'isComposeMsgSender',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'isPeer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'lzReceive',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_packets',
        internalType: 'struct InboundPacket[]',
        type: 'tuple[]',
        components: [
          {
            name: 'origin',
            internalType: 'struct Origin',
            type: 'tuple',
            components: [
              { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
              { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
              { name: 'nonce', internalType: 'uint64', type: 'uint64' },
            ],
          },
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'executor', internalType: 'address', type: 'address' },
          { name: 'message', internalType: 'bytes', type: 'bytes' },
          { name: 'extraData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'lzReceiveAndRevert',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'lzReceiveSimulate',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'msgInspector',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'nextNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oApp',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oAppVersion',
    outputs: [
      { name: 'senderVersion', internalType: 'uint64', type: 'uint64' },
      { name: 'receiverVersion', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oftVersion',
    outputs: [
      { name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' },
      { name: 'version', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'peers',
    outputs: [{ name: 'peer', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'preCrime',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'quoteOFT',
    outputs: [
      {
        name: 'oftLimit',
        internalType: 'struct OFTLimit',
        type: 'tuple',
        components: [
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'maxAmountLD', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'oftFeeDetails',
        internalType: 'struct OFTFeeDetail[]',
        type: 'tuple[]',
        components: [
          { name: 'feeAmountLD', internalType: 'int256', type: 'int256' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
      {
        name: 'oftReceipt',
        internalType: 'struct OFTReceipt',
        type: 'tuple',
        components: [
          { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountReceivedLD',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: '_payInLzToken', internalType: 'bool', type: 'bool' },
    ],
    name: 'quoteSend',
    outputs: [
      {
        name: 'msgFee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: '_fee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_refundAddress', internalType: 'address', type: 'address' },
    ],
    name: 'send',
    outputs: [
      {
        name: 'msgReceipt',
        internalType: 'struct MessagingReceipt',
        type: 'tuple',
        components: [
          { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          {
            name: 'fee',
            internalType: 'struct MessagingFee',
            type: 'tuple',
            components: [
              { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
              { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      {
        name: 'oftReceipt',
        internalType: 'struct OFTReceipt',
        type: 'tuple',
        components: [
          { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountReceivedLD',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_delegate', internalType: 'address', type: 'address' }],
    name: 'setDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_enforcedOptions',
        internalType: 'struct EnforcedOptionParam[]',
        type: 'tuple[]',
        components: [
          { name: 'eid', internalType: 'uint32', type: 'uint32' },
          { name: 'msgType', internalType: 'uint16', type: 'uint16' },
          { name: 'options', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'setEnforcedOptions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_msgInspector', internalType: 'address', type: 'address' },
    ],
    name: 'setMsgInspector',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setPeer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_preCrime', internalType: 'address', type: 'address' }],
    name: 'setPreCrime',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sharedDecimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// noftxAdapter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const noftxAdapterAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_localDecimals', internalType: 'uint8', type: 'uint8' },
      { name: '_lzEndpoint', internalType: 'address', type: 'address' },
      { name: '_delegate', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
      { name: 'revertData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'CreditFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectMessageValue',
  },
  { type: 'error', inputs: [], name: 'InvalidDelegate' },
  { type: 'error', inputs: [], name: 'InvalidEndpointCall' },
  { type: 'error', inputs: [], name: 'InvalidLocalDecimals' },
  {
    type: 'error',
    inputs: [{ name: 'options', internalType: 'bytes', type: 'bytes' }],
    name: 'InvalidOptions',
  },
  { type: 'error', inputs: [], name: 'LzTokenUnavailable' },
  {
    type: 'error',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'NoPeer',
  },
  {
    type: 'error',
    inputs: [{ name: 'msgValue', internalType: 'uint256', type: 'uint256' }],
    name: 'NotEnoughNative',
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'OnlyEndpoint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'OnlyPeer',
  },
  { type: 'error', inputs: [], name: 'OnlySelf' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  {
    type: 'error',
    inputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    name: 'SimulationResult',
  },
  {
    type: 'error',
    inputs: [
      { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SlippageExceeded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_enforcedOptions',
        internalType: 'struct EnforcedOptionParam[]',
        type: 'tuple[]',
        components: [
          { name: 'eid', internalType: 'uint32', type: 'uint32' },
          { name: 'msgType', internalType: 'uint16', type: 'uint16' },
          { name: 'options', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
    ],
    name: 'EnforcedOptionSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'inspector',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MsgInspectorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'srcEid',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'toAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountReceivedLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OFTReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'dstEid',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'fromAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountSentLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountReceivedLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OFTSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32', indexed: false },
      {
        name: 'peer',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'PeerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'preCrimeAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PreCrimeSet',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SEND',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SEND_AND_CALL',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    name: 'allowInitializePath',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'approvalRequired',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_msgType', internalType: 'uint16', type: 'uint16' },
      { name: '_extraOptions', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'combineOptions',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimalConversionRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endpoint',
    outputs: [
      {
        name: '',
        internalType: 'contract ILayerZeroEndpointV2',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'msgType', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'enforcedOptions',
    outputs: [{ name: 'enforcedOption', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '_sender', internalType: 'address', type: 'address' },
    ],
    name: 'isComposeMsgSender',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'isPeer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'lzReceive',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_packets',
        internalType: 'struct InboundPacket[]',
        type: 'tuple[]',
        components: [
          {
            name: 'origin',
            internalType: 'struct Origin',
            type: 'tuple',
            components: [
              { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
              { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
              { name: 'nonce', internalType: 'uint64', type: 'uint64' },
            ],
          },
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'executor', internalType: 'address', type: 'address' },
          { name: 'message', internalType: 'bytes', type: 'bytes' },
          { name: 'extraData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'lzReceiveAndRevert',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'lzReceiveSimulate',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'msgInspector',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'nextNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oApp',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oAppVersion',
    outputs: [
      { name: 'senderVersion', internalType: 'uint64', type: 'uint64' },
      { name: 'receiverVersion', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oftVersion',
    outputs: [
      { name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' },
      { name: 'version', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'peers',
    outputs: [{ name: 'peer', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'preCrime',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'quoteOFT',
    outputs: [
      {
        name: 'oftLimit',
        internalType: 'struct OFTLimit',
        type: 'tuple',
        components: [
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'maxAmountLD', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'oftFeeDetails',
        internalType: 'struct OFTFeeDetail[]',
        type: 'tuple[]',
        components: [
          { name: 'feeAmountLD', internalType: 'int256', type: 'int256' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
      {
        name: 'oftReceipt',
        internalType: 'struct OFTReceipt',
        type: 'tuple',
        components: [
          { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountReceivedLD',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: '_payInLzToken', internalType: 'bool', type: 'bool' },
    ],
    name: 'quoteSend',
    outputs: [
      {
        name: 'msgFee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: '_fee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_refundAddress', internalType: 'address', type: 'address' },
    ],
    name: 'send',
    outputs: [
      {
        name: 'msgReceipt',
        internalType: 'struct MessagingReceipt',
        type: 'tuple',
        components: [
          { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          {
            name: 'fee',
            internalType: 'struct MessagingFee',
            type: 'tuple',
            components: [
              { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
              { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      {
        name: 'oftReceipt',
        internalType: 'struct OFTReceipt',
        type: 'tuple',
        components: [
          { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountReceivedLD',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_delegate', internalType: 'address', type: 'address' }],
    name: 'setDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_enforcedOptions',
        internalType: 'struct EnforcedOptionParam[]',
        type: 'tuple[]',
        components: [
          { name: 'eid', internalType: 'uint32', type: 'uint32' },
          { name: 'msgType', internalType: 'uint16', type: 'uint16' },
          { name: 'options', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'setEnforcedOptions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_msgInspector', internalType: 'address', type: 'address' },
    ],
    name: 'setMsgInspector',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setPeer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_preCrime', internalType: 'address', type: 'address' }],
    name: 'setPreCrime',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sharedDecimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// oftx
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const oftxAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name_', internalType: 'string', type: 'string' },
      { name: 'symbol_', internalType: 'string', type: 'string' },
      { name: 'lzEndpoint_', internalType: 'address', type: 'address' },
      { name: 'delegate_', internalType: 'address', type: 'address' },
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'decimals_', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  { type: 'error', inputs: [], name: 'InsufficientBalance' },
  { type: 'error', inputs: [], name: 'InvalidDelegate' },
  { type: 'error', inputs: [], name: 'InvalidEndpointCall' },
  { type: 'error', inputs: [], name: 'InvalidLocalDecimals' },
  {
    type: 'error',
    inputs: [{ name: 'options', internalType: 'bytes', type: 'bytes' }],
    name: 'InvalidOptions',
  },
  { type: 'error', inputs: [], name: 'LzTokenUnavailable' },
  {
    type: 'error',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'NoPeer',
  },
  {
    type: 'error',
    inputs: [{ name: 'msgValue', internalType: 'uint256', type: 'uint256' }],
    name: 'NotEnoughNative',
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'OnlyEndpoint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'OnlyPeer',
  },
  { type: 'error', inputs: [], name: 'OnlySelf' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  {
    type: 'error',
    inputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    name: 'SimulationResult',
  },
  {
    type: 'error',
    inputs: [
      { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SlippageExceeded',
  },
  { type: 'error', inputs: [], name: 'UnsupportedOperation' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_enforcedOptions',
        internalType: 'struct EnforcedOptionParam[]',
        type: 'tuple[]',
        components: [
          { name: 'eid', internalType: 'uint32', type: 'uint32' },
          { name: 'msgType', internalType: 'uint16', type: 'uint16' },
          { name: 'options', internalType: 'bytes', type: 'bytes' },
        ],
        indexed: false,
      },
    ],
    name: 'EnforcedOptionSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'inspector',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MsgInspectorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'srcEid',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'toAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountReceivedLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OFTReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'dstEid',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'fromAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountSentLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountReceivedLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OFTSent',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32', indexed: false },
      {
        name: 'peer',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'PeerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'preCrimeAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PreCrimeSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COMPOSE_BURN_MSG_TYPE',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SEND',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SEND_AND_CALL',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    name: 'allowInitializePath',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'approvalRequired',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_msgType', internalType: 'uint16', type: 'uint16' },
      { name: '_extraOptions', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'combineOptions',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimalConversionRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'endpoint',
    outputs: [
      {
        name: '',
        internalType: 'contract ILayerZeroEndpointV2',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'msgType', internalType: 'uint16', type: 'uint16' },
    ],
    name: 'enforcedOptions',
    outputs: [{ name: 'enforcedOption', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '_sender', internalType: 'address', type: 'address' },
    ],
    name: 'isComposeMsgSender',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'isPeer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'lzCompose',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'lzReceive',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_packets',
        internalType: 'struct InboundPacket[]',
        type: 'tuple[]',
        components: [
          {
            name: 'origin',
            internalType: 'struct Origin',
            type: 'tuple',
            components: [
              { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
              { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
              { name: 'nonce', internalType: 'uint64', type: 'uint64' },
            ],
          },
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'executor', internalType: 'address', type: 'address' },
          { name: 'message', internalType: 'bytes', type: 'bytes' },
          { name: 'extraData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'lzReceiveAndRevert',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'lzReceiveSimulate',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'msgInspector',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'nextNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oApp',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oAppVersion',
    outputs: [
      { name: 'senderVersion', internalType: 'uint64', type: 'uint64' },
      { name: 'receiverVersion', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'oftVersion',
    outputs: [
      { name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' },
      { name: 'version', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'peers',
    outputs: [{ name: 'peer', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'preCrime',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'quoteOFT',
    outputs: [
      {
        name: 'oftLimit',
        internalType: 'struct OFTLimit',
        type: 'tuple',
        components: [
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'maxAmountLD', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'oftFeeDetails',
        internalType: 'struct OFTFeeDetail[]',
        type: 'tuple[]',
        components: [
          { name: 'feeAmountLD', internalType: 'int256', type: 'int256' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
      {
        name: 'oftReceipt',
        internalType: 'struct OFTReceipt',
        type: 'tuple',
        components: [
          { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountReceivedLD',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: '_payInLzToken', internalType: 'bool', type: 'bool' },
    ],
    name: 'quoteSend',
    outputs: [
      {
        name: 'msgFee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: '_fee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_refundAddress', internalType: 'address', type: 'address' },
    ],
    name: 'send',
    outputs: [
      {
        name: 'msgReceipt',
        internalType: 'struct MessagingReceipt',
        type: 'tuple',
        components: [
          { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          {
            name: 'fee',
            internalType: 'struct MessagingFee',
            type: 'tuple',
            components: [
              { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
              { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
      {
        name: 'oftReceipt',
        internalType: 'struct OFTReceipt',
        type: 'tuple',
        components: [
          { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountReceivedLD',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_delegate', internalType: 'address', type: 'address' }],
    name: 'setDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_enforcedOptions',
        internalType: 'struct EnforcedOptionParam[]',
        type: 'tuple[]',
        components: [
          { name: 'eid', internalType: 'uint32', type: 'uint32' },
          { name: 'msgType', internalType: 'uint16', type: 'uint16' },
          { name: 'options', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'setEnforcedOptions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_msgInspector', internalType: 'address', type: 'address' },
    ],
    name: 'setMsgInspector',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setPeer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_preCrime', internalType: 'address', type: 'address' }],
    name: 'setPreCrime',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sharedDecimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// oftxHelper
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const oftxHelperAbi = [
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  {
    type: 'function',
    inputs: [
      { name: '_oftx', internalType: 'address', type: 'address' },
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: '_fee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_refundAddress', internalType: 'address', type: 'address' },
    ],
    name: 'mintAndSendOFTX',
    outputs: [],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc20Abi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__
 */
export const useReadNoftx = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"SEND"`
 */
export const useReadNoftxSend = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'SEND',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"SEND_AND_CALL"`
 */
export const useReadNoftxSendAndCall = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'SEND_AND_CALL',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"allowInitializePath"`
 */
export const useReadNoftxAllowInitializePath =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAbi,
    functionName: 'allowInitializePath',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadNoftxAllowance = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"approvalRequired"`
 */
export const useReadNoftxApprovalRequired = /*#__PURE__*/ createUseReadContract(
  { abi: noftxAbi, functionName: 'approvalRequired' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadNoftxBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"combineOptions"`
 */
export const useReadNoftxCombineOptions = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'combineOptions',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"decimalConversionRate"`
 */
export const useReadNoftxDecimalConversionRate =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAbi,
    functionName: 'decimalConversionRate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadNoftxDecimals = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"endpoint"`
 */
export const useReadNoftxEndpoint = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'endpoint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"enforcedOptions"`
 */
export const useReadNoftxEnforcedOptions = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'enforcedOptions',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"isComposeMsgSender"`
 */
export const useReadNoftxIsComposeMsgSender =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAbi,
    functionName: 'isComposeMsgSender',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"isPeer"`
 */
export const useReadNoftxIsPeer = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'isPeer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"msgInspector"`
 */
export const useReadNoftxMsgInspector = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'msgInspector',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"name"`
 */
export const useReadNoftxName = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"nextNonce"`
 */
export const useReadNoftxNextNonce = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'nextNonce',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"oApp"`
 */
export const useReadNoftxOApp = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'oApp',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"oAppVersion"`
 */
export const useReadNoftxOAppVersion = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'oAppVersion',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"oftVersion"`
 */
export const useReadNoftxOftVersion = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'oftVersion',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"owner"`
 */
export const useReadNoftxOwner = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"peers"`
 */
export const useReadNoftxPeers = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'peers',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"preCrime"`
 */
export const useReadNoftxPreCrime = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'preCrime',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"quoteOFT"`
 */
export const useReadNoftxQuoteOft = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'quoteOFT',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"quoteSend"`
 */
export const useReadNoftxQuoteSend = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'quoteSend',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"sharedDecimals"`
 */
export const useReadNoftxSharedDecimals = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'sharedDecimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadNoftxSymbol = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"token"`
 */
export const useReadNoftxToken = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'token',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadNoftxTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: noftxAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__
 */
export const useWriteNoftx = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteNoftxApprove = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useWriteNoftxLzReceive = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
  functionName: 'lzReceive',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const useWriteNoftxLzReceiveAndRevert =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const useWriteNoftxLzReceiveSimulate =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteNoftxRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"send"`
 */
export const useWriteNoftxSend = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useWriteNoftxSetDelegate = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
  functionName: 'setDelegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const useWriteNoftxSetEnforcedOptions =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const useWriteNoftxSetMsgInspector =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAbi,
    functionName: 'setMsgInspector',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setPeer"`
 */
export const useWriteNoftxSetPeer = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const useWriteNoftxSetPreCrime = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
  functionName: 'setPreCrime',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteNoftxTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteNoftxTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteNoftxTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__
 */
export const useSimulateNoftx = /*#__PURE__*/ createUseSimulateContract({
  abi: noftxAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateNoftxApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: noftxAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useSimulateNoftxLzReceive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'lzReceive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const useSimulateNoftxLzReceiveAndRevert =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const useSimulateNoftxLzReceiveSimulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateNoftxRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"send"`
 */
export const useSimulateNoftxSend = /*#__PURE__*/ createUseSimulateContract({
  abi: noftxAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useSimulateNoftxSetDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'setDelegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const useSimulateNoftxSetEnforcedOptions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const useSimulateNoftxSetMsgInspector =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'setMsgInspector',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setPeer"`
 */
export const useSimulateNoftxSetPeer = /*#__PURE__*/ createUseSimulateContract({
  abi: noftxAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const useSimulateNoftxSetPreCrime =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'setPreCrime',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateNoftxTransfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: noftxAbi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateNoftxTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateNoftxTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__
 */
export const useWatchNoftxEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: noftxAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchNoftxApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"EnforcedOptionSet"`
 */
export const useWatchNoftxEnforcedOptionSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'EnforcedOptionSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"MsgInspectorSet"`
 */
export const useWatchNoftxMsgInspectorSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'MsgInspectorSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"OFTReceived"`
 */
export const useWatchNoftxOftReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'OFTReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"OFTSent"`
 */
export const useWatchNoftxOftSentEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'OFTSent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchNoftxOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"PeerSet"`
 */
export const useWatchNoftxPeerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'PeerSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"PreCrimeSet"`
 */
export const useWatchNoftxPreCrimeSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'PreCrimeSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchNoftxTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__
 */
export const useReadNoftxAdapter = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"SEND"`
 */
export const useReadNoftxAdapterSend = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'SEND',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"SEND_AND_CALL"`
 */
export const useReadNoftxAdapterSendAndCall =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'SEND_AND_CALL',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"allowInitializePath"`
 */
export const useReadNoftxAdapterAllowInitializePath =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'allowInitializePath',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"approvalRequired"`
 */
export const useReadNoftxAdapterApprovalRequired =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'approvalRequired',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"combineOptions"`
 */
export const useReadNoftxAdapterCombineOptions =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'combineOptions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"decimalConversionRate"`
 */
export const useReadNoftxAdapterDecimalConversionRate =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'decimalConversionRate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"endpoint"`
 */
export const useReadNoftxAdapterEndpoint = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'endpoint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"enforcedOptions"`
 */
export const useReadNoftxAdapterEnforcedOptions =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'enforcedOptions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"isComposeMsgSender"`
 */
export const useReadNoftxAdapterIsComposeMsgSender =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'isComposeMsgSender',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"isPeer"`
 */
export const useReadNoftxAdapterIsPeer = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'isPeer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"msgInspector"`
 */
export const useReadNoftxAdapterMsgInspector =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'msgInspector',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"nextNonce"`
 */
export const useReadNoftxAdapterNextNonce = /*#__PURE__*/ createUseReadContract(
  { abi: noftxAdapterAbi, functionName: 'nextNonce' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"oApp"`
 */
export const useReadNoftxAdapterOApp = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'oApp',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"oAppVersion"`
 */
export const useReadNoftxAdapterOAppVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'oAppVersion',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"oftVersion"`
 */
export const useReadNoftxAdapterOftVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'oftVersion',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"owner"`
 */
export const useReadNoftxAdapterOwner = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"peers"`
 */
export const useReadNoftxAdapterPeers = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'peers',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"preCrime"`
 */
export const useReadNoftxAdapterPreCrime = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'preCrime',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"quoteOFT"`
 */
export const useReadNoftxAdapterQuoteOft = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'quoteOFT',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"quoteSend"`
 */
export const useReadNoftxAdapterQuoteSend = /*#__PURE__*/ createUseReadContract(
  { abi: noftxAdapterAbi, functionName: 'quoteSend' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"sharedDecimals"`
 */
export const useReadNoftxAdapterSharedDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: noftxAdapterAbi,
    functionName: 'sharedDecimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"token"`
 */
export const useReadNoftxAdapterToken = /*#__PURE__*/ createUseReadContract({
  abi: noftxAdapterAbi,
  functionName: 'token',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__
 */
export const useWriteNoftxAdapter = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAdapterAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useWriteNoftxAdapterLzReceive =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceive',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const useWriteNoftxAdapterLzReceiveAndRevert =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const useWriteNoftxAdapterLzReceiveSimulate =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteNoftxAdapterRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"send"`
 */
export const useWriteNoftxAdapterSend = /*#__PURE__*/ createUseWriteContract({
  abi: noftxAdapterAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useWriteNoftxAdapterSetDelegate =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'setDelegate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const useWriteNoftxAdapterSetEnforcedOptions =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const useWriteNoftxAdapterSetMsgInspector =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'setMsgInspector',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setPeer"`
 */
export const useWriteNoftxAdapterSetPeer = /*#__PURE__*/ createUseWriteContract(
  { abi: noftxAdapterAbi, functionName: 'setPeer' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const useWriteNoftxAdapterSetPreCrime =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'setPreCrime',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteNoftxAdapterTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__
 */
export const useSimulateNoftxAdapter = /*#__PURE__*/ createUseSimulateContract({
  abi: noftxAdapterAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useSimulateNoftxAdapterLzReceive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const useSimulateNoftxAdapterLzReceiveAndRevert =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const useSimulateNoftxAdapterLzReceiveSimulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateNoftxAdapterRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"send"`
 */
export const useSimulateNoftxAdapterSend =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'send',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useSimulateNoftxAdapterSetDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setDelegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const useSimulateNoftxAdapterSetEnforcedOptions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const useSimulateNoftxAdapterSetMsgInspector =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setMsgInspector',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setPeer"`
 */
export const useSimulateNoftxAdapterSetPeer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setPeer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const useSimulateNoftxAdapterSetPreCrime =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setPreCrime',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateNoftxAdapterTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__
 */
export const useWatchNoftxAdapterEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: noftxAdapterAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"EnforcedOptionSet"`
 */
export const useWatchNoftxAdapterEnforcedOptionSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'EnforcedOptionSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"MsgInspectorSet"`
 */
export const useWatchNoftxAdapterMsgInspectorSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'MsgInspectorSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"OFTReceived"`
 */
export const useWatchNoftxAdapterOftReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'OFTReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"OFTSent"`
 */
export const useWatchNoftxAdapterOftSentEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'OFTSent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchNoftxAdapterOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"PeerSet"`
 */
export const useWatchNoftxAdapterPeerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'PeerSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"PreCrimeSet"`
 */
export const useWatchNoftxAdapterPreCrimeSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'PreCrimeSet',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__
 */
export const useReadOftx = /*#__PURE__*/ createUseReadContract({ abi: oftxAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"COMPOSE_BURN_MSG_TYPE"`
 */
export const useReadOftxComposeBurnMsgType =
  /*#__PURE__*/ createUseReadContract({
    abi: oftxAbi,
    functionName: 'COMPOSE_BURN_MSG_TYPE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"SEND"`
 */
export const useReadOftxSend = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'SEND',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"SEND_AND_CALL"`
 */
export const useReadOftxSendAndCall = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'SEND_AND_CALL',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"allowInitializePath"`
 */
export const useReadOftxAllowInitializePath =
  /*#__PURE__*/ createUseReadContract({
    abi: oftxAbi,
    functionName: 'allowInitializePath',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadOftxAllowance = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"approvalRequired"`
 */
export const useReadOftxApprovalRequired = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'approvalRequired',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadOftxBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"combineOptions"`
 */
export const useReadOftxCombineOptions = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'combineOptions',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"decimalConversionRate"`
 */
export const useReadOftxDecimalConversionRate =
  /*#__PURE__*/ createUseReadContract({
    abi: oftxAbi,
    functionName: 'decimalConversionRate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadOftxDecimals = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"endpoint"`
 */
export const useReadOftxEndpoint = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'endpoint',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"enforcedOptions"`
 */
export const useReadOftxEnforcedOptions = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'enforcedOptions',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"isComposeMsgSender"`
 */
export const useReadOftxIsComposeMsgSender =
  /*#__PURE__*/ createUseReadContract({
    abi: oftxAbi,
    functionName: 'isComposeMsgSender',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"isPeer"`
 */
export const useReadOftxIsPeer = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'isPeer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"msgInspector"`
 */
export const useReadOftxMsgInspector = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'msgInspector',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"name"`
 */
export const useReadOftxName = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"nextNonce"`
 */
export const useReadOftxNextNonce = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'nextNonce',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"oApp"`
 */
export const useReadOftxOApp = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'oApp',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"oAppVersion"`
 */
export const useReadOftxOAppVersion = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'oAppVersion',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"oftVersion"`
 */
export const useReadOftxOftVersion = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'oftVersion',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOftxOwner = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"peers"`
 */
export const useReadOftxPeers = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'peers',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"preCrime"`
 */
export const useReadOftxPreCrime = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'preCrime',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"quoteOFT"`
 */
export const useReadOftxQuoteOft = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'quoteOFT',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"quoteSend"`
 */
export const useReadOftxQuoteSend = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'quoteSend',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"sharedDecimals"`
 */
export const useReadOftxSharedDecimals = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'sharedDecimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadOftxSymbol = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"token"`
 */
export const useReadOftxToken = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'token',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadOftxTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: oftxAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__
 */
export const useWriteOftx = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteOftxApprove = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteOftxBurn = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzCompose"`
 */
export const useWriteOftxLzCompose = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'lzCompose',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useWriteOftxLzReceive = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'lzReceive',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const useWriteOftxLzReceiveAndRevert =
  /*#__PURE__*/ createUseWriteContract({
    abi: oftxAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const useWriteOftxLzReceiveSimulate =
  /*#__PURE__*/ createUseWriteContract({
    abi: oftxAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteOftxMint = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOftxRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: oftxAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"send"`
 */
export const useWriteOftxSend = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useWriteOftxSetDelegate = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'setDelegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const useWriteOftxSetEnforcedOptions =
  /*#__PURE__*/ createUseWriteContract({
    abi: oftxAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const useWriteOftxSetMsgInspector = /*#__PURE__*/ createUseWriteContract(
  { abi: oftxAbi, functionName: 'setMsgInspector' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setPeer"`
 */
export const useWriteOftxSetPeer = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const useWriteOftxSetPreCrime = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'setPreCrime',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteOftxTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteOftxTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: oftxAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOftxTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: oftxAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__
 */
export const useSimulateOftx = /*#__PURE__*/ createUseSimulateContract({
  abi: oftxAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateOftxApprove = /*#__PURE__*/ createUseSimulateContract({
  abi: oftxAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateOftxBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: oftxAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzCompose"`
 */
export const useSimulateOftxLzCompose = /*#__PURE__*/ createUseSimulateContract(
  { abi: oftxAbi, functionName: 'lzCompose' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useSimulateOftxLzReceive = /*#__PURE__*/ createUseSimulateContract(
  { abi: oftxAbi, functionName: 'lzReceive' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const useSimulateOftxLzReceiveAndRevert =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const useSimulateOftxLzReceiveSimulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateOftxMint = /*#__PURE__*/ createUseSimulateContract({
  abi: oftxAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOftxRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"send"`
 */
export const useSimulateOftxSend = /*#__PURE__*/ createUseSimulateContract({
  abi: oftxAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useSimulateOftxSetDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'setDelegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const useSimulateOftxSetEnforcedOptions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const useSimulateOftxSetMsgInspector =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'setMsgInspector',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setPeer"`
 */
export const useSimulateOftxSetPeer = /*#__PURE__*/ createUseSimulateContract({
  abi: oftxAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const useSimulateOftxSetPreCrime =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'setPreCrime',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateOftxTransfer = /*#__PURE__*/ createUseSimulateContract({
  abi: oftxAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateOftxTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOftxTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__
 */
export const useWatchOftxEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: oftxAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchOftxApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"EnforcedOptionSet"`
 */
export const useWatchOftxEnforcedOptionSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'EnforcedOptionSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"MsgInspectorSet"`
 */
export const useWatchOftxMsgInspectorSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'MsgInspectorSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"OFTReceived"`
 */
export const useWatchOftxOftReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'OFTReceived',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"OFTSent"`
 */
export const useWatchOftxOftSentEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'OFTSent',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOftxOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"PeerSet"`
 */
export const useWatchOftxPeerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'PeerSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"PreCrimeSet"`
 */
export const useWatchOftxPreCrimeSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'PreCrimeSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchOftxTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: oftxAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxHelperAbi}__
 */
export const useWriteOftxHelper = /*#__PURE__*/ createUseWriteContract({
  abi: oftxHelperAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link oftxHelperAbi}__ and `functionName` set to `"mintAndSendOFTX"`
 */
export const useWriteOftxHelperMintAndSendOftx =
  /*#__PURE__*/ createUseWriteContract({
    abi: oftxHelperAbi,
    functionName: 'mintAndSendOFTX',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxHelperAbi}__
 */
export const useSimulateOftxHelper = /*#__PURE__*/ createUseSimulateContract({
  abi: oftxHelperAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link oftxHelperAbi}__ and `functionName` set to `"mintAndSendOFTX"`
 */
export const useSimulateOftxHelperMintAndSendOftx =
  /*#__PURE__*/ createUseSimulateContract({
    abi: oftxHelperAbi,
    functionName: 'mintAndSendOFTX',
  })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const readErc20 = /*#__PURE__*/ createReadContract({ abi: erc20Abi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const readErc20Allowance = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const readErc20BalanceOf = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const readErc20Decimals = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const readErc20Name = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const readErc20Symbol = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const readErc20TotalSupply = /*#__PURE__*/ createReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const writeErc20 = /*#__PURE__*/ createWriteContract({ abi: erc20Abi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const writeErc20Approve = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const writeErc20Transfer = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const writeErc20TransferFrom = /*#__PURE__*/ createWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const simulateErc20 = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const simulateErc20Approve = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const simulateErc20Transfer = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateErc20TransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const watchErc20Event = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const watchErc20ApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const watchErc20TransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: erc20Abi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__
 */
export const readNoftx = /*#__PURE__*/ createReadContract({ abi: noftxAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"SEND"`
 */
export const readNoftxSend = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'SEND',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"SEND_AND_CALL"`
 */
export const readNoftxSendAndCall = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'SEND_AND_CALL',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"allowInitializePath"`
 */
export const readNoftxAllowInitializePath = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'allowInitializePath',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"allowance"`
 */
export const readNoftxAllowance = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"approvalRequired"`
 */
export const readNoftxApprovalRequired = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'approvalRequired',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readNoftxBalanceOf = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"combineOptions"`
 */
export const readNoftxCombineOptions = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'combineOptions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"decimalConversionRate"`
 */
export const readNoftxDecimalConversionRate = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'decimalConversionRate',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"decimals"`
 */
export const readNoftxDecimals = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"endpoint"`
 */
export const readNoftxEndpoint = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'endpoint',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"enforcedOptions"`
 */
export const readNoftxEnforcedOptions = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'enforcedOptions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"isComposeMsgSender"`
 */
export const readNoftxIsComposeMsgSender = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'isComposeMsgSender',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"isPeer"`
 */
export const readNoftxIsPeer = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'isPeer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"msgInspector"`
 */
export const readNoftxMsgInspector = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'msgInspector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"name"`
 */
export const readNoftxName = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"nextNonce"`
 */
export const readNoftxNextNonce = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'nextNonce',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"oApp"`
 */
export const readNoftxOApp = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'oApp',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"oAppVersion"`
 */
export const readNoftxOAppVersion = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'oAppVersion',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"oftVersion"`
 */
export const readNoftxOftVersion = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'oftVersion',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"owner"`
 */
export const readNoftxOwner = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"peers"`
 */
export const readNoftxPeers = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'peers',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"preCrime"`
 */
export const readNoftxPreCrime = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'preCrime',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"quoteOFT"`
 */
export const readNoftxQuoteOft = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'quoteOFT',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"quoteSend"`
 */
export const readNoftxQuoteSend = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'quoteSend',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"sharedDecimals"`
 */
export const readNoftxSharedDecimals = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'sharedDecimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"symbol"`
 */
export const readNoftxSymbol = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"token"`
 */
export const readNoftxToken = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'token',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readNoftxTotalSupply = /*#__PURE__*/ createReadContract({
  abi: noftxAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__
 */
export const writeNoftx = /*#__PURE__*/ createWriteContract({ abi: noftxAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"approve"`
 */
export const writeNoftxApprove = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceive"`
 */
export const writeNoftxLzReceive = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'lzReceive',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const writeNoftxLzReceiveAndRevert = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'lzReceiveAndRevert',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const writeNoftxLzReceiveSimulate = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'lzReceiveSimulate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeNoftxRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"send"`
 */
export const writeNoftxSend = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setDelegate"`
 */
export const writeNoftxSetDelegate = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'setDelegate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const writeNoftxSetEnforcedOptions = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'setEnforcedOptions',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const writeNoftxSetMsgInspector = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'setMsgInspector',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setPeer"`
 */
export const writeNoftxSetPeer = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const writeNoftxSetPreCrime = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'setPreCrime',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transfer"`
 */
export const writeNoftxTransfer = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeNoftxTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeNoftxTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: noftxAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__
 */
export const simulateNoftx = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"approve"`
 */
export const simulateNoftxApprove = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceive"`
 */
export const simulateNoftxLzReceive = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
  functionName: 'lzReceive',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const simulateNoftxLzReceiveAndRevert =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const simulateNoftxLzReceiveSimulate =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateNoftxRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"send"`
 */
export const simulateNoftxSend = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setDelegate"`
 */
export const simulateNoftxSetDelegate = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
  functionName: 'setDelegate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const simulateNoftxSetEnforcedOptions =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const simulateNoftxSetMsgInspector =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAbi,
    functionName: 'setMsgInspector',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setPeer"`
 */
export const simulateNoftxSetPeer = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const simulateNoftxSetPreCrime = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
  functionName: 'setPreCrime',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateNoftxTransfer = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateNoftxTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: noftxAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateNoftxTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__
 */
export const watchNoftxEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: noftxAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"Approval"`
 */
export const watchNoftxApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: noftxAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"EnforcedOptionSet"`
 */
export const watchNoftxEnforcedOptionSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAbi,
    eventName: 'EnforcedOptionSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"MsgInspectorSet"`
 */
export const watchNoftxMsgInspectorSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAbi,
    eventName: 'MsgInspectorSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"OFTReceived"`
 */
export const watchNoftxOftReceivedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAbi,
    eventName: 'OFTReceived',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"OFTSent"`
 */
export const watchNoftxOftSentEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: noftxAbi,
  eventName: 'OFTSent',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchNoftxOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"PeerSet"`
 */
export const watchNoftxPeerSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: noftxAbi,
  eventName: 'PeerSet',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"PreCrimeSet"`
 */
export const watchNoftxPreCrimeSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAbi,
    eventName: 'PreCrimeSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchNoftxTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: noftxAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__
 */
export const readNoftxAdapter = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"SEND"`
 */
export const readNoftxAdapterSend = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'SEND',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"SEND_AND_CALL"`
 */
export const readNoftxAdapterSendAndCall = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'SEND_AND_CALL',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"allowInitializePath"`
 */
export const readNoftxAdapterAllowInitializePath =
  /*#__PURE__*/ createReadContract({
    abi: noftxAdapterAbi,
    functionName: 'allowInitializePath',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"approvalRequired"`
 */
export const readNoftxAdapterApprovalRequired =
  /*#__PURE__*/ createReadContract({
    abi: noftxAdapterAbi,
    functionName: 'approvalRequired',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"combineOptions"`
 */
export const readNoftxAdapterCombineOptions = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'combineOptions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"decimalConversionRate"`
 */
export const readNoftxAdapterDecimalConversionRate =
  /*#__PURE__*/ createReadContract({
    abi: noftxAdapterAbi,
    functionName: 'decimalConversionRate',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"endpoint"`
 */
export const readNoftxAdapterEndpoint = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'endpoint',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"enforcedOptions"`
 */
export const readNoftxAdapterEnforcedOptions = /*#__PURE__*/ createReadContract(
  { abi: noftxAdapterAbi, functionName: 'enforcedOptions' },
)

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"isComposeMsgSender"`
 */
export const readNoftxAdapterIsComposeMsgSender =
  /*#__PURE__*/ createReadContract({
    abi: noftxAdapterAbi,
    functionName: 'isComposeMsgSender',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"isPeer"`
 */
export const readNoftxAdapterIsPeer = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'isPeer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"msgInspector"`
 */
export const readNoftxAdapterMsgInspector = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'msgInspector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"nextNonce"`
 */
export const readNoftxAdapterNextNonce = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'nextNonce',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"oApp"`
 */
export const readNoftxAdapterOApp = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'oApp',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"oAppVersion"`
 */
export const readNoftxAdapterOAppVersion = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'oAppVersion',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"oftVersion"`
 */
export const readNoftxAdapterOftVersion = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'oftVersion',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"owner"`
 */
export const readNoftxAdapterOwner = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"peers"`
 */
export const readNoftxAdapterPeers = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'peers',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"preCrime"`
 */
export const readNoftxAdapterPreCrime = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'preCrime',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"quoteOFT"`
 */
export const readNoftxAdapterQuoteOft = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'quoteOFT',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"quoteSend"`
 */
export const readNoftxAdapterQuoteSend = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'quoteSend',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"sharedDecimals"`
 */
export const readNoftxAdapterSharedDecimals = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'sharedDecimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"token"`
 */
export const readNoftxAdapterToken = /*#__PURE__*/ createReadContract({
  abi: noftxAdapterAbi,
  functionName: 'token',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__
 */
export const writeNoftxAdapter = /*#__PURE__*/ createWriteContract({
  abi: noftxAdapterAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceive"`
 */
export const writeNoftxAdapterLzReceive = /*#__PURE__*/ createWriteContract({
  abi: noftxAdapterAbi,
  functionName: 'lzReceive',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const writeNoftxAdapterLzReceiveAndRevert =
  /*#__PURE__*/ createWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const writeNoftxAdapterLzReceiveSimulate =
  /*#__PURE__*/ createWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeNoftxAdapterRenounceOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"send"`
 */
export const writeNoftxAdapterSend = /*#__PURE__*/ createWriteContract({
  abi: noftxAdapterAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setDelegate"`
 */
export const writeNoftxAdapterSetDelegate = /*#__PURE__*/ createWriteContract({
  abi: noftxAdapterAbi,
  functionName: 'setDelegate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const writeNoftxAdapterSetEnforcedOptions =
  /*#__PURE__*/ createWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const writeNoftxAdapterSetMsgInspector =
  /*#__PURE__*/ createWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'setMsgInspector',
  })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setPeer"`
 */
export const writeNoftxAdapterSetPeer = /*#__PURE__*/ createWriteContract({
  abi: noftxAdapterAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const writeNoftxAdapterSetPreCrime = /*#__PURE__*/ createWriteContract({
  abi: noftxAdapterAbi,
  functionName: 'setPreCrime',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeNoftxAdapterTransferOwnership =
  /*#__PURE__*/ createWriteContract({
    abi: noftxAdapterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__
 */
export const simulateNoftxAdapter = /*#__PURE__*/ createSimulateContract({
  abi: noftxAdapterAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceive"`
 */
export const simulateNoftxAdapterLzReceive =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceive',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const simulateNoftxAdapterLzReceiveAndRevert =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const simulateNoftxAdapterLzReceiveSimulate =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateNoftxAdapterRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"send"`
 */
export const simulateNoftxAdapterSend = /*#__PURE__*/ createSimulateContract({
  abi: noftxAdapterAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setDelegate"`
 */
export const simulateNoftxAdapterSetDelegate =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setDelegate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const simulateNoftxAdapterSetEnforcedOptions =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const simulateNoftxAdapterSetMsgInspector =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setMsgInspector',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setPeer"`
 */
export const simulateNoftxAdapterSetPeer = /*#__PURE__*/ createSimulateContract(
  { abi: noftxAdapterAbi, functionName: 'setPeer' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const simulateNoftxAdapterSetPreCrime =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'setPreCrime',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link noftxAdapterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateNoftxAdapterTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: noftxAdapterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__
 */
export const watchNoftxAdapterEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: noftxAdapterAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"EnforcedOptionSet"`
 */
export const watchNoftxAdapterEnforcedOptionSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'EnforcedOptionSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"MsgInspectorSet"`
 */
export const watchNoftxAdapterMsgInspectorSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'MsgInspectorSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"OFTReceived"`
 */
export const watchNoftxAdapterOftReceivedEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'OFTReceived',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"OFTSent"`
 */
export const watchNoftxAdapterOftSentEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'OFTSent',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchNoftxAdapterOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"PeerSet"`
 */
export const watchNoftxAdapterPeerSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'PeerSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link noftxAdapterAbi}__ and `eventName` set to `"PreCrimeSet"`
 */
export const watchNoftxAdapterPreCrimeSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: noftxAdapterAbi,
    eventName: 'PreCrimeSet',
  })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__
 */
export const readOftx = /*#__PURE__*/ createReadContract({ abi: oftxAbi })

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"COMPOSE_BURN_MSG_TYPE"`
 */
export const readOftxComposeBurnMsgType = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'COMPOSE_BURN_MSG_TYPE',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"SEND"`
 */
export const readOftxSend = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'SEND',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"SEND_AND_CALL"`
 */
export const readOftxSendAndCall = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'SEND_AND_CALL',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"allowInitializePath"`
 */
export const readOftxAllowInitializePath = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'allowInitializePath',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"allowance"`
 */
export const readOftxAllowance = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"approvalRequired"`
 */
export const readOftxApprovalRequired = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'approvalRequired',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"balanceOf"`
 */
export const readOftxBalanceOf = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"combineOptions"`
 */
export const readOftxCombineOptions = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'combineOptions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"decimalConversionRate"`
 */
export const readOftxDecimalConversionRate = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'decimalConversionRate',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"decimals"`
 */
export const readOftxDecimals = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"endpoint"`
 */
export const readOftxEndpoint = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'endpoint',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"enforcedOptions"`
 */
export const readOftxEnforcedOptions = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'enforcedOptions',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"isComposeMsgSender"`
 */
export const readOftxIsComposeMsgSender = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'isComposeMsgSender',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"isPeer"`
 */
export const readOftxIsPeer = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'isPeer',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"msgInspector"`
 */
export const readOftxMsgInspector = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'msgInspector',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"name"`
 */
export const readOftxName = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"nextNonce"`
 */
export const readOftxNextNonce = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'nextNonce',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"oApp"`
 */
export const readOftxOApp = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'oApp',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"oAppVersion"`
 */
export const readOftxOAppVersion = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'oAppVersion',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"oftVersion"`
 */
export const readOftxOftVersion = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'oftVersion',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"owner"`
 */
export const readOftxOwner = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"peers"`
 */
export const readOftxPeers = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'peers',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"preCrime"`
 */
export const readOftxPreCrime = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'preCrime',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"quoteOFT"`
 */
export const readOftxQuoteOft = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'quoteOFT',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"quoteSend"`
 */
export const readOftxQuoteSend = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'quoteSend',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"sharedDecimals"`
 */
export const readOftxSharedDecimals = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'sharedDecimals',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"symbol"`
 */
export const readOftxSymbol = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"token"`
 */
export const readOftxToken = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'token',
})

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"totalSupply"`
 */
export const readOftxTotalSupply = /*#__PURE__*/ createReadContract({
  abi: oftxAbi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__
 */
export const writeOftx = /*#__PURE__*/ createWriteContract({ abi: oftxAbi })

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"approve"`
 */
export const writeOftxApprove = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"burn"`
 */
export const writeOftxBurn = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzCompose"`
 */
export const writeOftxLzCompose = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'lzCompose',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceive"`
 */
export const writeOftxLzReceive = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'lzReceive',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const writeOftxLzReceiveAndRevert = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'lzReceiveAndRevert',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const writeOftxLzReceiveSimulate = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'lzReceiveSimulate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"mint"`
 */
export const writeOftxMint = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const writeOftxRenounceOwnership = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'renounceOwnership',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"send"`
 */
export const writeOftxSend = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setDelegate"`
 */
export const writeOftxSetDelegate = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'setDelegate',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const writeOftxSetEnforcedOptions = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'setEnforcedOptions',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const writeOftxSetMsgInspector = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'setMsgInspector',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setPeer"`
 */
export const writeOftxSetPeer = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const writeOftxSetPreCrime = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'setPreCrime',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transfer"`
 */
export const writeOftxTransfer = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transferFrom"`
 */
export const writeOftxTransferFrom = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const writeOftxTransferOwnership = /*#__PURE__*/ createWriteContract({
  abi: oftxAbi,
  functionName: 'transferOwnership',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__
 */
export const simulateOftx = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"approve"`
 */
export const simulateOftxApprove = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'approve',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"burn"`
 */
export const simulateOftxBurn = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'burn',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzCompose"`
 */
export const simulateOftxLzCompose = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'lzCompose',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceive"`
 */
export const simulateOftxLzReceive = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'lzReceive',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const simulateOftxLzReceiveAndRevert =
  /*#__PURE__*/ createSimulateContract({
    abi: oftxAbi,
    functionName: 'lzReceiveAndRevert',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const simulateOftxLzReceiveSimulate =
  /*#__PURE__*/ createSimulateContract({
    abi: oftxAbi,
    functionName: 'lzReceiveSimulate',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"mint"`
 */
export const simulateOftxMint = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const simulateOftxRenounceOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: oftxAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"send"`
 */
export const simulateOftxSend = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'send',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setDelegate"`
 */
export const simulateOftxSetDelegate = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'setDelegate',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const simulateOftxSetEnforcedOptions =
  /*#__PURE__*/ createSimulateContract({
    abi: oftxAbi,
    functionName: 'setEnforcedOptions',
  })

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const simulateOftxSetMsgInspector = /*#__PURE__*/ createSimulateContract(
  { abi: oftxAbi, functionName: 'setMsgInspector' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setPeer"`
 */
export const simulateOftxSetPeer = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'setPeer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const simulateOftxSetPreCrime = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'setPreCrime',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transfer"`
 */
export const simulateOftxTransfer = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transferFrom"`
 */
export const simulateOftxTransferFrom = /*#__PURE__*/ createSimulateContract({
  abi: oftxAbi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const simulateOftxTransferOwnership =
  /*#__PURE__*/ createSimulateContract({
    abi: oftxAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__
 */
export const watchOftxEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: oftxAbi,
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"Approval"`
 */
export const watchOftxApprovalEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: oftxAbi,
  eventName: 'Approval',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"EnforcedOptionSet"`
 */
export const watchOftxEnforcedOptionSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: oftxAbi,
    eventName: 'EnforcedOptionSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"MsgInspectorSet"`
 */
export const watchOftxMsgInspectorSetEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: oftxAbi,
    eventName: 'MsgInspectorSet',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"OFTReceived"`
 */
export const watchOftxOftReceivedEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: oftxAbi, eventName: 'OFTReceived' },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"OFTSent"`
 */
export const watchOftxOftSentEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: oftxAbi,
  eventName: 'OFTSent',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const watchOftxOwnershipTransferredEvent =
  /*#__PURE__*/ createWatchContractEvent({
    abi: oftxAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"PeerSet"`
 */
export const watchOftxPeerSetEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: oftxAbi,
  eventName: 'PeerSet',
})

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"PreCrimeSet"`
 */
export const watchOftxPreCrimeSetEvent = /*#__PURE__*/ createWatchContractEvent(
  { abi: oftxAbi, eventName: 'PreCrimeSet' },
)

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link oftxAbi}__ and `eventName` set to `"Transfer"`
 */
export const watchOftxTransferEvent = /*#__PURE__*/ createWatchContractEvent({
  abi: oftxAbi,
  eventName: 'Transfer',
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxHelperAbi}__
 */
export const writeOftxHelper = /*#__PURE__*/ createWriteContract({
  abi: oftxHelperAbi,
})

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link oftxHelperAbi}__ and `functionName` set to `"mintAndSendOFTX"`
 */
export const writeOftxHelperMintAndSendOftx = /*#__PURE__*/ createWriteContract(
  { abi: oftxHelperAbi, functionName: 'mintAndSendOFTX' },
)

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxHelperAbi}__
 */
export const simulateOftxHelper = /*#__PURE__*/ createSimulateContract({
  abi: oftxHelperAbi,
})

/**
 * Wraps __{@link simulateContract}__ with `abi` set to __{@link oftxHelperAbi}__ and `functionName` set to `"mintAndSendOFTX"`
 */
export const simulateOftxHelperMintAndSendOftx =
  /*#__PURE__*/ createSimulateContract({
    abi: oftxHelperAbi,
    functionName: 'mintAndSendOFTX',
  })
