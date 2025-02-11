import { alpha } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  description: {
    marginTop: theme.spacing(1),
  },
  registerSection: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(4),
    },
  },
  registerItem: {
    backgroundColor: theme.colors.darkCerulean,
    borderRadius: 4,
    border: `1px solid ${alpha(theme.colors.black, 0.12)}`,
    textAlign: 'center',
    padding: theme.spacing(2, 4),
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(2, 4),
    },
  },
  registerIcon: {
    width: 60,
  },
  registerItemLeft: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  registerItemText: {
    color: theme.colors.white,
    fontSize: 14,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
      fontSize: 24,
    },
  },
  registerButton: {
    backgroundColor: theme.colors.white,
    color: theme.colors.darkCerulean,
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
    },
  },
  lastLogin: {
    textAlign: 'right',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  cart: {
    border: `1px solid ${theme.palette.divider}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardActions: {
    padding: theme.spacing(0, 2, 4, 2),
    justifyContent: 'right',
  },
  avatar: {
    padding: theme.spacing(2),
    width: 80,
    height: 80,
    border: `2px solid ${theme.palette.divider}`,
  },
  avatarSmall: {
    padding: theme.spacing(1),
    width: 50,
    height: 50,
    border: `2px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1),
  },
  chipCampain: {
    backgroundColor: theme.colors.froly,
    color: theme.colors.white,
  },
  chipDevelopment: {
    backgroundColor: theme.colors.lochmara,
    color: theme.colors.white,
  },
  dialogPaper: {
    width: '100%',
  },
  thumbnail: {
    padding: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingRight: 0,
    },
    minHeight: 200,
    '& img': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      objectFit: 'contain',
      backgroundColor: '#F0F7FF',
    },
  },
  dialogContent: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0,
    },
  },
}));

export { useStyles };
