import React, { useCallback, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { useDict } from '@/contexts/DictContext';
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { Box, CircularProgress, Dialog, DialogTitle, IconButton } from '@mui/material';
import { useTransactionState } from '@/contexts/TransactionStateContext';
import { getEtherscanTxLink, getLayerZeroTxLink } from '@/utils/string.utils';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { Transaction } from '@/services/local-storage.service';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const RecentTransactionDialog: React.FC<IProps> = ({
  open,
  onClose,
}) => {
  const dict = useDict();

  const { classes } = useStyles();
  const { transactions, clearCompletedTransactions } = useTransactionState();

  const pendingTransactions = useMemo(() => transactions.filter((tx) => tx.confirmedAt === undefined && tx.isFailed === undefined).sort((a, b) => b.createdAt - a.createdAt), [transactions]);
  const confirmedTransactions = useMemo(() => transactions.filter((tx) => (tx.confirmedAt !== undefined || tx.isFailed !== undefined)).sort((a, b) => b.createdAt - a.createdAt), [transactions]);
  const allTransactions = [...pendingTransactions, ...confirmedTransactions];

  console.log('ALL: ', allTransactions)

  const handleClearCompletedTransactions = useCallback(() => {
    clearCompletedTransactions();
    onClose();
  }, [clearCompletedTransactions, onClose]);

  const getExplorerLink = (tx: Transaction) => {
    if (tx.lzEndpointId) {
      return getLayerZeroTxLink(tx.hash);
    }
    return getEtherscanTxLink(tx.hash);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      data-testid="dialog"
      maxWidth="xs"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <>
        <IconButton
          onClick={onClose}
          className={classes.closeIcon}
          data-testid="close-button"
        >
          <CloseIcon className={classes.itemIcon} />
        </IconButton>
        <DialogTitle color="rgba(9, 9, 11, 1)" fontSize={24} sx={{ paddingBottom: '12px' }}>
          {dict.recent_transaction_dialog.title}
        </DialogTitle>
        <div className={classes.container}>
          <div className={classes.clearAllContainer} onClick={handleClearCompletedTransactions}>
            <Typography className={classes.title}>{dict.recent_transaction_dialog.transactions}</Typography>
            <Typography className={classes.clearAll}>{dict.recent_transaction_dialog.clear_all}</Typography>
          </div>
          <div className={classes.list}>
            {allTransactions.length > 0 ? allTransactions.map((tx) => (
              <div
                key={tx.hash}
                className={classes.listItem}
              >
                <Box display="flex" alignItems="center" gap="8px">
                {!tx.confirmedAt && <Box width={20} height={20} display="flex" alignItems="center" justifyContent="center"><CircularProgress size={20} color="primary" /></Box>}
                {tx.confirmedAt && !tx.isFailed && <CheckCircleIcon className={classes.itemIcon} color="success" />}
                {tx.confirmedAt && tx.isFailed && <ErrorIcon className={classes.itemIcon} color="error" />}
                <Typography className={classes.summary}>{tx.summary}</Typography>
                </Box>
                <Link href={getExplorerLink(tx)} target="_blank">
                  <LaunchIcon className={classes.itemIcon} />
                </Link>
              </div>
            )) : (
              <Typography className={classes.emptyTitle}>{dict.recent_transaction_dialog.no_transactions}</Typography>
            )}
          </div>
        </div>
      </>
    </Dialog>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
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
    justifyContent: 'space-between',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  summary: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  closeIcon: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1,
  },
  dialogPaper: {
    borderRadius: '12px',
    maxWidth: '420px',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  clearAllContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0px 16px',
  },
  clearAll: {
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: 0,
    color: theme.palette.primary.main,
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  title: {
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  itemIcon: {
    width: 24,
    height: 24,
  },
  emptyTitle: {
    margin: '24px auto 0',
    paddingBottom: '84px',
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}));

export default RecentTransactionDialog;


