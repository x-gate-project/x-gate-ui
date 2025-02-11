import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { makeStyles } from 'tss-react/mui';
// themes
import { Theme } from '@mui/material/styles';
// enums
import { useTranslation } from 'next-i18next';
import { Button } from '@mui/material';
import { useSigner, WalletConnectorDialog } from '@gusdk/gu-wallet-connector';
import { truncateEthAddress } from '~/utils/string.utils';
import AccountDetailPopover from '~/components/account-detail-popover';
import theme from '~/styles/theme';

interface IProps {}

const Header: React.FC<IProps> = (props) => {
  const { classes } = useStyles();
  const [openWalletConnectorDialog, setOpenWalletConnectorDialog] = useState(false);
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);
  const signer = useSigner();

  const { t } = useTranslation('common');
  const onOpenWalletConnectorDialog = useCallback(() => {
    setOpenWalletConnectorDialog(true);
  }, []);

  const onCloseWalletConnectorDialog = useCallback(() => {
    setOpenWalletConnectorDialog(false);
  }, []);

  const [accountDetailPopoverAnchorEl, setAccountDetailPopoverAnchorEl] =
    useState<HTMLElement | null>(null);

  const onOpenAccountDetailPopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAccountDetailPopoverAnchorEl(event.currentTarget);
    },
    [setAccountDetailPopoverAnchorEl],
  );
  const onCloseAccountDetailPopover = useCallback(() => {
    setAccountDetailPopoverAnchorEl(null);
  }, [setAccountDetailPopoverAnchorEl]);

  useEffect(() => {
    (async () => {
      if (signer) {
        const userAddress = await signer.getAddress();
        setUserAddress(userAddress);
      }
    })();
  }, [signer]);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.appBar}>
          <div className={classes.left}>
            <Link href={'#'}>
              <div className={classes.menuItem}>LOGO</div>
            </Link>
          </div>
          <div className={classes.right}>
            <Button
              startIcon={<img src="/images/icons/joc-icon.svg" alt="USDT" width="24" />}
              endIcon={<img src="/images/icons/caret-sort.svg" alt="" width="16" />}
              variant="outlined"
              onClick={() => {}}
              sx={{
                fontSize: '16px',
                fontWeight: 400,
                color: 'black',
                lineHeight: '20px',
                textAlign: 'left',
                textTransform: 'none',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '9999px',
              }}
            >
              JOC
            </Button>
            {userAddress ? (
              <Button
                startIcon={<img src="/images/icons/wallet_icon.svg" alt="" width="16" />}
                onClick={onOpenAccountDetailPopover}
                className={classes.connectWalletButton}
                variant="contained"
              >
                {truncateEthAddress(userAddress)}
              </Button>
            ) : (
              <Button
                startIcon={<img src="/images/icons/wallet_icon.svg" alt="" width="16" />}
                onClick={onOpenWalletConnectorDialog}
                className={classes.connectWalletButton}
                variant="contained"
              >
                {t('header.connect_wallet')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <WalletConnectorDialog
        open={openWalletConnectorDialog}
        onClose={onCloseWalletConnectorDialog}
      />
      <AccountDetailPopover
        open={Boolean(accountDetailPopoverAnchorEl)}
        onClose={onCloseAccountDetailPopover}
        anchorEl={accountDetailPopoverAnchorEl}
      />
    </div>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'white',
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    margin: 'auto',
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      paddingLeft: 50,
      paddingRight: 50,
    },
  },
  appBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      height: 50,
    },
    [theme.breakpoints.down('sm')]: {
      alignItems: 'start',
    },
  },
  left: {
    display: 'flex',
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '12px',
      flexDirection: 'column-reverse',
      justifyContent: 'center',
      alignItems: 'end',
    },
  },
  menuItem: {
    color: theme.colors.black,
    paddingLeft: 25,
    paddingRight: 25,
    textDecoration: 'none',
    fontSize: 16,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  connectWalletButton: {
    textTransform: 'none',
    borderRadius: '6px',
  },
}));

export default Header;
