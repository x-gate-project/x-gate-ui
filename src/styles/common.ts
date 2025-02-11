import { CSSObject } from '@emotion/serialize';
import { BOLD, MEDIUM, REGULAR } from '../constants/font-weight';
import { NOTO_SANS_JP_FONT } from '../constants/fonts';

export const link: CSSObject = {
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
};

export const navText: CSSObject = {
  fontFamily: NOTO_SANS_JP_FONT,
  fontWeight: MEDIUM,
  fontSize: 16,
  textTransform: 'uppercase',
  letterSpacing: '2px',
  lineHeight: '24px',
};

export const body1BoldText: CSSObject = {
  fontFamily: NOTO_SANS_JP_FONT,
  fontWeight: BOLD,
  fontSize: 16,
  letterSpacing: '0.15px',
  lineHeight: '28px',
};

export const body1Text: CSSObject = {
  fontFamily: NOTO_SANS_JP_FONT,
  fontWeight: REGULAR,
  fontSize: 16,
  letterSpacing: '0.15px',
};

export const body2Text: CSSObject = {
  fontFamily: NOTO_SANS_JP_FONT,
  fontWeight: REGULAR,
  fontSize: 14,
  letterSpacing: '0.15px',
};

export const subtitle1Text: CSSObject = {
  fontFamily: NOTO_SANS_JP_FONT,
  fontWeight: MEDIUM,
  fontSize: 16,
  letterSpacing: '0.15px',
};

export const captionText: CSSObject = {
  fontFamily: NOTO_SANS_JP_FONT,
  fontWeight: REGULAR,
  fontSize: 12,
  letterSpacing: '0.4px',
};

export const closeDialogButton = (theme): CSSObject => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1,
});
