import React, { useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';
// Components
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

// Types
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import {
  BrowserWalletRequired,
  InjectedConnector,
  TorusConnector,
  useConnect,
  WalletConnectConnector,
} from '@gusdk/gu-wallet-connector';
import { Connector } from '@gusdk/gu-wallet-connector/lib/core/connectors/base';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const WalletConnectorDialog: React.FC<IProps> = (props) => {
  const { open, onClose } = props;
  const { classes } = useStyles();
  const { t, i18n } = useTranslation('common');
  const { connectors, connect } = useConnect();

  const { enqueueSnackbar } = useSnackbar();

  const onConnect = useCallback(
    async (connector: Connector<any, any>) => {
      try {
        await connect(connector);
      } catch (error: any) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    },
    [connect, enqueueSnackbar],
  );

  const getConfig = useCallback(
    (connector: typeof connectors[number]) => {
      if (connector instanceof InjectedConnector) {
        return {
          logo: '/images/injected-wallet.png',
          name: 'Browser wallet',
          description: t('connect_with_wallet', {
            name: 'Browser wallet',
          }),
        };
      }
      if (connector instanceof WalletConnectConnector) {
        return {
          logo: '/images/wallet-connect.svg',
          name: 'WalletConnect',
          description: t('connect_with_wallet', { name: 'WalletConnect' }),
        };
      }
      if (connector instanceof TorusConnector) {
        return {
          logo: '/images/torus-wallet.svg',
          name: 'Torus',
          description: t('connect_with_wallet', { name: 'Torus' }),
        };
      }
    },
    [t],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      data-testid="wallet-connector-dialog"
      classes={{ paper: classes.dialogPaper }}
    >
      <>
        <IconButton onClick={onClose} className={classes.closeIcon} data-testid="close-button">
          <img src="/images/close_icon.svg" alt="" />
        </IconButton>
        <DialogTitle>
          <Typography variant="h5" color="primary" component="p">
            {t('wallet_connect_dialog.title')}
          </Typography>
        </DialogTitle>
        <Divider className={classes.divider} />
        <DialogContent sx={{ paddingBottom: 3 }}>
          {connectors.map((connector, index) => (
            <BrowserWalletRequired key={index} disable={!(connector instanceof InjectedConnector)}>
              <ListItemButton
                data-testid={'connect-selection-' + index}
                alignItems="flex-start"
                data-index={index}
                onClick={() => onConnect(connector)}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    imgProps={{ sx: { objectFit: 'contain' } }}
                    src={getConfig(connector)?.logo}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={getConfig(connector)?.name}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {getConfig(connector)?.description}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            </BrowserWalletRequired>
          ))}
        </DialogContent>
      </>
    </Dialog>
  );
};

const useStyles = makeStyles()((theme) => ({
  closeIcon: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1,
  },
  dialogPaper: {
    width: '100%',
  },
  content: {
    paddingTop: theme.spacing(2),
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  dialogActions: {
    justifyContent: 'center',
    '& button': {
      width: 121,
    },
  },
  divider: {
    margin: theme.spacing(0, 3, 2, 3),
  },
}));

export default WalletConnectorDialog;
