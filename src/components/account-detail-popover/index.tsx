import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CardContent, Typography, IconButton, Button, Popover, PopoverProps } from '@mui/material';
import { useAccount, useDisconnect, useSigner } from '@gusdk/gu-wallet-connector';
import { makeStyles } from 'tss-react/mui';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  anchorEl: PopoverProps['anchorEl'];
  popoverProps?: PopoverProps;
}

const AccountDetailPopover: React.FC<Props> = (props) => {
  const { account } = useAccount();
  const { open, onClose, popoverProps, anchorEl } = props;
  const { classes } = useStyles();
  const { disconnect } = useDisconnect();
  const router = useRouter();
  const handleCopy = () => {};
  const { t } = useTranslation();

  const handleDisconnect = useCallback(async () => {
    await disconnect();
    onClose();
    router.reload();
  }, [disconnect, onClose, router]);

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
    >
      <div className={classes.wrapper}>
        <div className={classes.contentWrapper}>
          <img
            src="/images/icons/eth_icon.svg"
            alt="Ethereum"
            style={{ width: 24, height: 24, marginRight: 8 }}
          />
          <div className={classes.accountDetailWrapper}>
            <Typography variant="subtitle1" fontWeight={600}>
              {'My Account'}
            </Typography>
            <div className={classes.addressWrapper}>
              <Typography
                variant="body2"
                color="textSecondary"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {account}
              </Typography>
            </div>
          </div>
          <IconButton onClick={handleCopy} color="default">
            <img
              src="/images/icons/copy_icon.svg"
              alt=""
              style={{ width: 16, height: 16, marginRight: 8 }}
            />
          </IconButton>
        </div>
        <Button
          onClick={handleDisconnect}
          variant="outlined"
          color="error"
          className={classes.disconnectBtn}
        >
          {t('account_detail_popover.disconnect')}
        </Button>
      </div>
    </Popover>
  );
};

const useStyles = makeStyles()((theme) => ({
  popoverPaper: {
    marginTop: 8,
    borderRadius: 4,
  },
  wrapper: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  disconnectBtn: {
    textTransform: 'none',
    width: '100%',
    padding: '0px',
    borderRadius: '6px',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressWrapper: {
    maxWidth: '150px',
  },
  accountDetailWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
}));

export default AccountDetailPopover;
