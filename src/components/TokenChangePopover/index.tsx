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

interface IProps {
  open: boolean;
  onClose: () => void;
  onChangeToken: (token: Token) => void;
  anchorEl: PopoverProps['anchorEl'];
  popoverProps?: PopoverProps;
  selectedToken: Token;
  currentNetwork: string;
  tokens: Token[];
}

const TokenChangePopover: React.FC<IProps> = ({
  open,
  onClose,
  onChangeToken,
  anchorEl,
  popoverProps,
  selectedToken,
  currentNetwork,
  tokens,
}) => {
  const dict = useDict();

  const { classes } = useStyles();

  const [searchText, setSearchText] = useState('');

  const onChangeTokenClick = useCallback((token: Token) => {
    onClose();
    onChangeToken(token);
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
      return tokens;
    }
    return tokens.filter(
      (token) =>
        token.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, tokens]);

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
          {filteredTokens.map((token) => (
            <div
              key={token}
              className={clsx(classes.listItem, token === selectedToken && classes.listItemSelected)}
              onClick={() => onChangeTokenClick(token)}
            >
              <div className={classes.tokenInfoWrapper}>
                <Image src={TOKEN_TO_ICON_MAP[token]} alt={token} width={16} height={16} />
                <Typography className={classes.tokenName}>{token}</Typography>
              </div>
              <Typography className={classes.networkName}>{currentNetwork}</Typography>
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
    // maxWidth: '271px',
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


