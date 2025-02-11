import { createTypeReducer } from '@gu-corp/redux-async-lib';

import * as WindowStateActions from '../actions/window-state-actions';

export type IState = {
  isDrawerOpen: boolean;
};

export const initialState: IState = {
  isDrawerOpen: true,
};

export const openDrawerReducer = WindowStateActions.openDrawer.reducer<IState>((state, action) => {
  return {
    isDrawerOpen: true,
  };
});

export const closeDrawerReducer = WindowStateActions.closeDrawer.reducer<IState>(
  (state, action) => {
    return {
      isDrawerOpen: false,
    };
  },
);

export const reducer = createTypeReducer(initialState, openDrawerReducer, closeDrawerReducer);
