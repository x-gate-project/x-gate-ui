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
import Image from 'next/image';
import { Token } from '@/enums/token';
import { TOKEN_TO_ICON_MAP } from '@/utils/token.utils';
import { Chain } from 'viem';
import { joc } from '@/wagmi.config';

interface IProps {
  open: boolean;
  onClose: () => void;
  onChangeToken: (token: Token, network: Chain) => void;
  anchorEl: PopoverProps['anchorEl'];
  popoverProps?: PopoverProps;
  selectedToken: Token;
  selectedNetwork: Chain;
  networks: Chain[];
  tokens: Token[];
}

const TokenChangePopover: React.FC<IProps> = ({
  open,
  onClose,
  onChangeToken,
  anchorEl,
  popoverProps,
  selectedToken,
  selectedNetwork,
  networks,
  tokens,
}) => {
  const dict = useDict();

  const { classes } = useStyles();

  const allTokens = networks.flatMap((network) => {
    return tokens.map((token) => {
      if(token === Token.JOC) {
        return {
          token,
          network: joc,
        };
      }

      if(token === Token.JOCX && network.id === joc.id) {
        return null;
      }
      return {
        token,
        network,
      };
    });
  });

  const [searchText, setSearchText] = useState('');

  const onSelectToken = useCallback((t: { token: Token, network: Chain }) => {
    onClose();
    onChangeToken(t.token, t.network);
  }, [onClose, onChangeToken]);

  const changeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }, []);
  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => debounce(changeHandler, 1000)(event),
    [changeHandler],
  );

  const filteredTokens = useMemo(() => {
    if (!searchText) {
      return allTokens;
    }
    return allTokens.filter(
      (t) =>
        t && (t.token.toLowerCase().includes(searchText.toLowerCase()) ||
        t.network.name.toLowerCase().includes(searchText.toLowerCase())),
    );
  }, [searchText, allTokens]);

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
          placeholder={dict.token_change_popover.search_placeholder}
          size="small"
          onChange={onSearchChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <Image src="/icons/search-icon.svg" alt="search" width={16} height={16} />
            </InputAdornment>,
          }}
        />
        <div className={classes.divider}/>
        <div className={classes.list}>
          <div className={classes.listItem}>
            <Typography className={classes.selectNetworkTitle}>{dict.token_change_popover.select_token}</Typography>
          </div>
          {filteredTokens.map((t) => (
            t && (<div
              key={`${t.token}-${t.network.id}`}
              className={clsx(classes.listItem, (selectedNetwork && t.network.id === selectedNetwork.id && t.token === selectedToken) && classes.listItemSelected)}
              onClick={() => onSelectToken(t)}
            >
              <div className={classes.tokenInfoWrapper}>
                <Image src={TOKEN_TO_ICON_MAP[t.token]} alt={t.token} width={16} height={16} />
                <Typography className={classes.tokenName}>{t.token}</Typography>
              </div>
              <Typography className={classes.networkName}>{t.network.name}</Typography>
            </div>)
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
    justifyContent: 'space-between',
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
  tokenName: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: 0,
  },
  networkName: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: 0,
    color: '#020617',
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
  tokenInfoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
}));

export default TokenChangePopover;


