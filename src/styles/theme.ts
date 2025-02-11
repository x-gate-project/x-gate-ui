import { Theme, createTheme, alpha } from '@mui/material/styles';
import {
  BLACK_COLOR,
  WHITE_COLOR,
  TORY_BLUE_COLOR,
  NAVY_BLUE_COLOR,
  PATTENS_BLUE_COLOR,
  MID_NIGHT_COLOR,
  ALICE_BLUE_COLOR,
  ALICE_BLUE_2_COLOR,
  NOBEL_COLOR,
  CHARCOAL_COLOR,
  DARK_CERULEAN_COLOR,
  NIGHT_RIDER_COLOR,
  GAINSBORO_COLOR,
  GAINSBORO_2_COLOR,
  SNOW_COLOR,
  DODGER_BLUE_COLOR,
  DODGER_BLUE_2_COLOR,
  RED_ORANGE_COLOR,
  FRUIT_SALAD_COLOR,
  ORANGE_PEEL_COLOR,
  SILVER_COLOR,
  FROLY_COLOR,
  LOCHMARA_COLOR,
  MAIN_COLOR,
} from '../constants/colors';
import {
  XS_BREAKPOINT,
  SM_BREAKPOINT,
  MD_BREAKPOINT,
  LG_BREAKPOINT,
  XL_BREAKPOINT,
} from '../constants/breakpoints';
import { NOTO_SANS_JP_FONT } from '../constants/fonts';
import { LIGHT, REGULAR, MEDIUM } from '../constants/font-weight';

const theme: Theme = createTheme({
  colors: {
    black: BLACK_COLOR,
    white: WHITE_COLOR,
    toryBlue: TORY_BLUE_COLOR,
    navyBlue: NAVY_BLUE_COLOR,
    pattensBlue: PATTENS_BLUE_COLOR,
    midnight: MID_NIGHT_COLOR,
    aliceBlue: ALICE_BLUE_COLOR,
    aliceBlue2: ALICE_BLUE_2_COLOR,
    nobel: NOBEL_COLOR,
    charcoal: CHARCOAL_COLOR,
    darkCerulean: DARK_CERULEAN_COLOR,
    nightRider: NIGHT_RIDER_COLOR,
    gainsboro: GAINSBORO_COLOR,
    gainsboro2: GAINSBORO_2_COLOR,
    snow: SNOW_COLOR,
    dodgerBlue: DODGER_BLUE_COLOR,
    dodgerBlue2: DODGER_BLUE_2_COLOR,
    redOrange: RED_ORANGE_COLOR,
    fruitSalad: FRUIT_SALAD_COLOR,
    orangePeel: ORANGE_PEEL_COLOR,
    silver: SILVER_COLOR,
    milanoRed: MAIN_COLOR,
    froly: FROLY_COLOR,
    lochmara: LOCHMARA_COLOR,
  },
  breakpoints: {
    values: {
      xs: XS_BREAKPOINT,
      sm: SM_BREAKPOINT,
      md: MD_BREAKPOINT,
      lg: LG_BREAKPOINT,
      xl: XL_BREAKPOINT,
    },
  },
  spacing: 8,
  palette: {
    background: {
      default: SNOW_COLOR,
    },
    primary: {
      main: MAIN_COLOR,
    },
    text: {
      primary: NIGHT_RIDER_COLOR,
      secondary: '#64748B',
      disabled: alpha(BLACK_COLOR, 0.38),
    },
    divider: GAINSBORO_COLOR,
  },
  typography: {
    fontFamily: NOTO_SANS_JP_FONT,
    fontSize: 14,
  },
});

theme.components = {
  MuiAppBar: {
    styleOverrides: {
      colorPrimary: {
        backgroundColor: theme.colors.black,
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      h1: {
        fontSize: 34,
        fontWeight: REGULAR,
        letterSpacing: -1.5,
        [theme.breakpoints.up('sm')]: {
          fontSize: 42,
        },
      },
      h2: {
        fontSize: 32,
        fontWeight: LIGHT,
        letterSpacing: -0.5,
        [theme.breakpoints.up('sm')]: {
          fontSize: 38,
        },
      },
      h3: {
        fontSize: 30,
        letterSpacing: 0,
        fontWeight: REGULAR,
        [theme.breakpoints.up('sm')]: {
          fontSize: 34,
        },
      },
      h4: {
        fontSize: 24,
        fontWeight: REGULAR,
        letterSpacing: 0.25,
        [theme.breakpoints.up('sm')]: {
          fontSize: 28,
        },
      },
      h5: {
        fontSize: 20,
        fontWeight: REGULAR,
        letterSpacing: 0,
        [theme.breakpoints.up('sm')]: {
          fontSize: 24,
        },
      },
      h6: {
        fontSize: 20,
        letterSpacing: 0.15,
        fontWeight: MEDIUM,
      },
      subtitle1: {
        fontSize: 16,
        letterSpacing: 0.15,
        fontWeight: MEDIUM,
      },
      subtitle2: {
        fontSize: 14,
        letterSpacing: 0.1,
        fontWeight: MEDIUM,
      },
      body1: {
        fontSize: 16,
        letterSpacing: 0.15,
        fontWeight: REGULAR,
      },
      body2: {
        fontSize: 14,
        letterSpacing: 0.15,
        fontWeight: REGULAR,
      },
      button: {
        fontSize: 18,
        letterSpacing: 0.4,
        fontWeight: MEDIUM,
        textTransform: 'uppercase',
      },
      caption: {
        fontSize: 12,
        letterSpacing: 0.4,
        fontWeight: REGULAR,
      },
      overline: {
        fontSize: 14,
        letterSpacing: 1,
        fontWeight: REGULAR,
        textTransform: 'uppercase',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        margin: theme.spacing(2),
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        paddingRight: theme.spacing(7), // Fix title overlap close dialog button
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: theme.spacing(1, 3),
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: theme.spacing(1, 3, 3, 3),
        '& > :not(:first-of-type)': {
          marginLeft: theme.spacing(2),
        },
      },
      spacing: {
        '& > :not(:first-of-type)': {
          marginLeft: theme.spacing(3),
        },
      },
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      selectLabel: {
        fontSize: 12,
        letterSpacing: 0.4,
        fontWeight: REGULAR,
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: {
        fontSize: 16,
        letterSpacing: 0.15,
        fontWeight: REGULAR,
      },
    },
  },
  MuiStepLabel: {
    styleOverrides: {
      label: {
        fontSize: 16,
        letterSpacing: 0.15,
        fontWeight: REGULAR,
      },
      active: {
        letterSpacing: 0.15,
        fontWeight: MEDIUM,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'standard',
    },
  },
};

export default theme;
