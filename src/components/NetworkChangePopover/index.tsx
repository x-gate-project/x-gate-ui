// React, Redux
import React, { useCallback, useMemo, useState } from 'react';
// Material UI
import Popover, { PopoverProps } from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
// Components
import { useDict } from '@/contexts/DictContext';
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { debounce, InputAdornment, TextField } from '@mui/material';
import clsx from 'clsx';
import { Chain } from 'viem';
import { CHAIN_ID_TO_ICON_MAP } from '@/wagmi.config';

interface IProps {
  open: boolean;
  onClose: () => void;
  onChangeNetwork: (selectedNetwork: Chain) => void;
  anchorEl: PopoverProps['anchorEl'];
  popoverProps?: PopoverProps;
  selectedNetwork: Chain;
  networks: Chain[];
}

const NetworkChangePopover: React.FC<IProps> = ({
  open,
  onClose,
  onChangeNetwork,
  anchorEl,
  popoverProps,
  selectedNetwork,
  networks,
}) => {
  const dict = useDict();

  const { classes } = useStyles();

  const [searchText, setSearchText] = useState('');

  const onChangeNetworkClick = useCallback((network: Chain) => {
    onClose();
    onChangeNetwork(network);
  }, [onClose, onChangeNetwork]);

  const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }, []);
  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => debounce(changeHandler, 1000)(event),
    [changeHandler],
  );

  const filteredNetworks = useMemo(() => {
    if (!searchText) {
      return networks;
    }
    return networks.filter(
      (network) =>
        network.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [networks, searchText]);

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
      <div className={classes.container}>
        <TextField
          className={classes.searchTextField}
          placeholder={dict.network_change_popover.search_placeholder}
          size="small"
          onChange={onSearchChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/search-icon.svg" alt="search" width={16} height={16} />
            </InputAdornment>,
          }}
        />
        <div className={classes.divider}/>
        <div className={classes.list}>
          <div className={classes.listItem}>
            <Typography className={classes.selectNetworkTitle}>{dict.network_change_popover.select_network}</Typography>
          </div>
          {filteredNetworks.map((network) => (
            <div
              key={network.name}
              className={clsx(classes.listItem, network.name === selectedNetwork.name && classes.listItemSelected)}
              onClick={() => onChangeNetworkClick(network)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CHAIN_ID_TO_ICON_MAP[network.id]} alt={network.name} width={16} height={16} />
              <Typography className={classes.networkName}>{network.name}</Typography>
            </div>
          ))}
        </div>
      </div>
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
}));

export default NetworkChangePopover;


