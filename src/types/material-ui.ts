import { makeStyles } from 'tss-react/mui';
interface ThemeColors {
  black: string;
  white: string;
  toryBlue: string;
  navyBlue: string;
  pattensBlue: string;
  midnight: string;
  aliceBlue: string;
  aliceBlue2: string;
  nobel: string;
  charcoal: string;
  darkCerulean: string;
  nightRider: string;
  gainsboro: string;
  gainsboro2: string;
  snow: string;
  dodgerBlue: string;
  dodgerBlue2: string;
  redOrange: string;
  fruitSalad: string;
  orangePeel: string;
  silver: string;
  milanoRed: string;
  froly: string;
  lochmara: string;
}

declare module '@mui/material/styles' {
  interface Theme {
    colors: ThemeColors;
  }
  interface ThemeOptions {
    colors: ThemeColors;
  }
}

class WrapperMakeStyles<Params = void> {
  // wrapped has no explicit return type so we can infer it
  wrapped(params: Params) {
    return makeStyles(params);
  }
}

export interface StyledComponentProps<
  T extends ReturnType<ReturnType<WrapperMakeStyles['wrapped']>>,
> {
  classes?: Partial<ReturnType<T>['classes']>;
}
