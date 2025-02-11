import { createTypeReducer } from '@gu-corp/redux-async-lib';

import * as UserStateActions from '../actions/user-state-actions';

export type IState = {
  account?: {
    usdtBalance: string;
    usdtxBalance: string;
    address: string;
  };
};

export const initialState: IState = {};

export const getAccountReducer = UserStateActions.getAccountAction.reducer<IState>(
  (state, action) => {
    if (action.error) {
      return {};
    }
    return {
      account: action.payload,
    };
  },
);

export const reducer = createTypeReducer(initialState, getAccountReducer);
