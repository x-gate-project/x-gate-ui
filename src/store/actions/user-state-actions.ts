import { createTypeAsyncAction } from '@gu-corp/redux-async-lib';
import { getEnv } from '~/env';
import { getErc20Balance } from '@gu-corp/gu-wallet-sdk/dist/utils/erc20.util';
import { ethers } from 'ethers';

export const getAccountAction = createTypeAsyncAction('GET_ACCOUNT', async (address: string) => {
  const provider = new ethers.JsonRpcProvider(getEnv('NEXT_PUBLIC_JOC_URL') || '');
  const usdtBalance = ethers.formatEther(await provider.getBalance(address));
  const usdtxBalance = await getErc20Balance(
    getEnv('NEXT_PUBLIC_JOC_URL') || '',
    getEnv('NEXT_PUBLIC_USDTX_CONTRACT_ADDRESS') || '',
    address,
  );

  // const usdtBalance = await getErc20Balance(
  //   getEnv('NEXT_PUBLIC_JOC_URL') || '',
  //   getEnv('NEXT_PUBLIC_USDTX_CONTRACT_ADDRESS') || '',
  //   address,
  // );
  return { usdtBalance, usdtxBalance, address };
});
