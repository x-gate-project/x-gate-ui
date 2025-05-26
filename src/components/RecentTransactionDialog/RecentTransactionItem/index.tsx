import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { useDict } from '@/contexts/DictContext';
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { Box, CircularProgress } from '@mui/material';
import { getEtherscanTxLink, getLayerZeroTxLink } from '@/utils/string.utils';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LaunchIcon from '@mui/icons-material/Launch';
import ErrorIcon from '@mui/icons-material/Error';
import { Transaction } from '@/services/local-storage.service';
import { TransactionMethod } from '@/enums/transaction-method';
import { useConfig } from 'wagmi';
import { renderTokenBalance } from '@/utils/render.util';
import { TOKEN_TO_DECIMALS_MAP } from '@/utils/token.utils';

interface IProps {
  transaction: Transaction;
}

const RecentTransactionItem: React.FC<IProps> = ({
  transaction,
}) => {
  const dict = useDict();
  const wagmiConfig = useConfig();

  const { classes } = useStyles();

  const summary = useMemo(() => {
    const fromNetwork = wagmiConfig.chains.find((chain) => chain.id === transaction.fromChainId)?.name || '';
    const toNetwork = wagmiConfig.chains.find((chain) => chain.id === transaction.toChainId)?.name || '';
    const renderAmount = renderTokenBalance(transaction.amount, { displayDecimals: TOKEN_TO_DECIMALS_MAP[transaction.token] });
    let messageTemplate;
    switch (transaction.method) {
      case TransactionMethod.SEND:
        messageTemplate = dict.send_tab.send_summary;
        break;
      case TransactionMethod.MINT:
        messageTemplate = dict.mint_tab.mint_summary;
        break;
      case TransactionMethod.BURN:
        messageTemplate = dict.burn_tab.burn_summary;
        break;
      default:
        return;
    }
    return messageTemplate
    .replace("{{token}}", transaction.token)
    .replace("{{from}}", fromNetwork)
    .replace("{{to}}", toNetwork)
    .replace("{{amount}}", renderAmount);
  }, [transaction, dict, wagmiConfig]);

  const getExplorerLink = (tx: Transaction) => {
    if (tx.lzEndpointId) {
      return getLayerZeroTxLink(tx.hash);
    }
    return getEtherscanTxLink(tx.hash);
  };

  return (
    <div
      key={transaction.hash}
      className={classes.listItem}
    >
      <Box display="flex" alignItems="center" gap="8px">
        {!transaction.confirmedAt && <Box width={20} height={20} display="flex" alignItems="center" justifyContent="center"><CircularProgress size={20} color="primary" /></Box>}
        {transaction.confirmedAt && !transaction.isFailed && <CheckCircleIcon className={classes.itemIcon} color="success" />}
        {transaction.confirmedAt && transaction.isFailed && <ErrorIcon className={classes.itemIcon} color="error" />}
        <Typography className={classes.summary}>{summary}</Typography>
                </Box>
        <Link href={getExplorerLink(transaction)} target="_blank">
          <LaunchIcon className={classes.launchIcon} />
        </Link>
      </div>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    justifyContent: 'space-between',
    width: '100%',
  },
  summary: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  itemIcon: {
    width: 24,
    height: 24,
  },
  launchIcon: {
    width: 24,
    height: 24,
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default RecentTransactionItem;