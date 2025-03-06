import React, { useCallback } from 'react';
import Popover, { PopoverProps } from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useDict } from '@/contexts/DictContext';
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { CircularProgress, Divider, List, ListItem } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';

interface IProps {
  open: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenRecentTransactions: () => void;
  anchorEl: PopoverProps['anchorEl'];
  popoverProps?: PopoverProps;
  isPending: boolean;
}

const WalletButtonPopover: React.FC<IProps> = ({
  open,
  onClose,
  anchorEl,
  popoverProps,
  onOpenProfile,
  onOpenRecentTransactions,
  isPending,
}) => {
  const dict = useDict();

  const { classes } = useStyles();

  const handleOpenRecentTransactions = useCallback(() => {
    onOpenRecentTransactions();
    onClose();
  }, [onOpenRecentTransactions, onClose]);

  const handleOpenProfile = useCallback(() => {
    onOpenProfile();
    onClose();
  }, [onOpenProfile, onClose]);

  return (
    <Popover
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      {...popoverProps}
      classes={{ paper: classes.popoverPaper }}
      data-testid="add-to-wallet-popover"
    >
      <List className={classes.list}>
        <ListItem
          data-test-id="popover-detail-button"
          className={classes.listItem}
          onClick={handleOpenProfile}
        >
          <AccountCircleOutlinedIcon className={classes.itemIcon} />
          <Typography>{dict.wallet_button_popover.profile}</Typography>
        </ListItem>
        <Divider className={classes.divider} />
        <ListItem
          data-test-id="popover-transfer-button"
          className={classes.listItem}
          onClick={handleOpenRecentTransactions}
        >
          {isPending ? <CircularProgress size={20} color="primary" /> : <SwapVertOutlinedIcon className={classes.itemIcon} />}
          <Typography>{dict.wallet_button_popover.transactions}</Typography>
        </ListItem>
      </List>
    </Popover>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
  popoverPaper: {
    marginTop: 3,
    borderRadius: '8px',
    maxWidth: '271px',
    boxShadow: `
      0px 2px 4px -2px rgba(0, 0, 0, 0.1),
      0px 4px 6px -1px rgba(0, 0, 0, 0.1)
    `,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  list: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    width: '100%',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  listItemSelected: {
    backgroundColor: '#F1F5F9',
  },
  selectNetworkTitle: {
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: 0,
    color: '#64748B',
  },
  networkName: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  searchTextField: {
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: 0,
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  },
  divider: {
    height: '1px',
    width: '100%',
    backgroundColor: '#E2E8F0',
  },
  itemIcon: {
    width: 24,
    height: 24,
    color: 'rgb(46, 46, 55)',
  },
}));

export default WalletButtonPopover;
