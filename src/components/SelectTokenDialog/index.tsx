// React, Redux
import React, { useCallback, useMemo, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
// Components
import { useDict } from "@/contexts/DictContext";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import {
  debounce,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import clsx from "clsx";
import Image from "next/image";
import { Token } from "@/enums/token";
import { Chain } from "viem";
import { CHAIN_ID_TO_ICON_MAP } from "@/wagmi/config";
import CloseIcon from "@mui/icons-material/Close";
import TokenListItem from "./TokenListItem";

interface IProps {
  open: boolean;
  onClose: () => void;
  onChangeToken: (token: Token, network: Chain) => void;
  selectedToken: {
    token: Token;
    network: Chain;
  };
  tokens: {
    token: Token;
    network: Chain;
  }[];
  isFrom: boolean;
}

const SelectTokenDialog: React.FC<IProps> = ({
  open,
  onClose,
  onChangeToken,
  selectedToken,
  tokens,
  isFrom,
}) => {
  const dict = useDict();

  const { classes } = useStyles();
  const [currentNetwork, setCurrentNetwork] = useState<Chain | null>(
    null
  );

  const availableNetworks = useMemo(() => {
    const networkSet = new Set<Chain>();
    tokens.forEach((tokenData) => {
      if (tokenData && tokenData.network) {
        networkSet.add(tokenData.network);
      }
    });
    return Array.from(networkSet);
  }, [tokens]);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (open) {
      setSearchText("");
      setCurrentNetwork(null);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setSearchText("");
    setCurrentNetwork(null);
    onClose();
  }, [onClose]);

  const onSelectToken = useCallback(
    (t: { token: Token; network: Chain }) => {
      onChangeToken(t.token, t.network);
      handleClose();
    },
    [onChangeToken, handleClose]
  );

  const onSelectNetwork = useCallback((network: Chain) => {
    setCurrentNetwork(network);
  }, []);

  const onSelectAllNetworks = useCallback(() => {
    setCurrentNetwork(null);
  }, []);

  const changeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value);
    },
    []
  );
  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      debounce(changeHandler, 600)(event),
    [changeHandler]
  );

  const filteredTokens = useMemo(() => {
    let filteredTokens = tokens;

    if (currentNetwork) {
      filteredTokens = filteredTokens.filter((t) => t && t.network.id === currentNetwork.id);
    }

    if (searchText) {
      filteredTokens = filteredTokens.filter(
        (t) =>
          t &&
          (t.token.toLowerCase().includes(searchText.toLowerCase()) ||
            t.network.name.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    return filteredTokens;
  }, [searchText, tokens, currentNetwork]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      data-testid="dialog"
      maxWidth="sm"
      fullWidth
      classes={{ paper: classes.dialogPaper }}
    >
      <>
        <IconButton
          onClick={handleClose}
          className={classes.closeIcon}
          data-testid="close-button"
        >
          <CloseIcon className={classes.itemIcon} />
        </IconButton>

        <DialogTitle className={classes.dialogTitle}>
          {isFrom ? dict.token_change_dialog.from : dict.token_change_dialog.to}
        </DialogTitle>

        <div className={classes.container}>
          <div style={{ padding: "0 24px" }}>
            {/* Search Bar */}
            <TextField
              className={classes.searchTextField}
              placeholder={dict.token_change_dialog.search_placeholder}
              size="small"
              onChange={onSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image
                      src="/icons/search-icon.svg"
                      alt="search"
                      width={16}
                      height={16}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <div className={classes.networkSection}>
              <Typography className={classes.sectionTitle}>
                {dict.token_change_dialog.network}{" "}
                {currentNetwork
                  ? currentNetwork.name
                  : dict.token_change_dialog.all}
              </Typography>
              <div className={classes.networkIcons}>
                <div
                  className={clsx(
                    classes.networkIcon,
                    !currentNetwork && classes.networkIconSelected
                  )}
                  onClick={onSelectAllNetworks}
                >
                  <Typography className={classes.allNetworksText}>
                    {dict.token_change_dialog.all}
                  </Typography>
                </div>
                {availableNetworks.map((net) => (
                  <div
                    key={net.id}
                    className={clsx(
                      classes.networkIcon,
                      currentNetwork &&
                        net.id === currentNetwork.id &&
                        classes.networkIconSelected
                    )}
                    onClick={() => onSelectNetwork(net)}
                  >
                    <Image
                      src={CHAIN_ID_TO_ICON_MAP[net.id]}
                      alt=""
                      width={28}
                      height={28}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={classes.tokenList}>
            {filteredTokens.length > 0 ? (
              filteredTokens.map(
                (t) =>
                  t && (
                    <TokenListItem
                      key={`${t.token}-${t.network.id}`}
                      tokenData={t}
                      selectedToken={selectedToken.token}
                      selectedNetwork={selectedToken.network}
                      onSelectToken={onSelectToken}
                    />
                  )
              )
            ) : (
              <div className={classes.emptyState}>
                <Typography className={classes.emptyStateText}>
                  {dict.token_change_dialog.no_results_found}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </>
    </Dialog>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    padding: "0 0 24px 0",
    backgroundColor: "#FFFFFF",
  },
  dialogTitle: {
    color: "#1A1A1A",
    fontSize: "24px",
    fontWeight: 600,
    padding: "24px 24px 0 24px",
    backgroundColor: "#FFFFFF",
  },
  searchTextField: {
    width: "100%",
    paddingTop: "12px",
    paddingBottom: "12px",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#F8F9FA",
      borderRadius: "12px",
      "& fieldset": {
        border: "1px solid #E2E8F0",
      },
      "&:hover fieldset": {
        border: "1px solid #CBD5E1",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #3B82F6",
      },
    },
    "& .MuiInputBase-input": {
      color: "#1A1A1A",
      "&::placeholder": {
        color: "#64748B",
        opacity: 1,
      },
    },
  },
  settingsIcon: {
    color: "#64748B",
    fontSize: "20px",
  },
  networkSection: {
    marginBottom: "24px",
  },
  sectionTitle: {
    color: "#374151",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "12px",
  },
  networkIcons: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  networkIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#F8F9FA",
    border: "2px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#E2E8F0",
    },
  },
  networkIconSelected: {
    border: "2px solid #3B82F6",
    backgroundColor: "#EBF4FF",
  },
  networkIconText: {
    color: "#374151",
    fontSize: "14px",
    fontWeight: 600,
  },
  allNetworksIcon: {
    backgroundColor: "#F8F9FA",
    border: "2px solid #E2E8F0",
  },
  allNetworksText: {
    color: "#374151",
    fontSize: "12px",
    fontWeight: 600,
  },
  moreNetworks: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#F8F9FA",
    border: "2px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748B",
    fontSize: "12px",
    fontWeight: 600,
  },
  popularTokensSection: {
    marginBottom: "24px",
  },
  popularTokens: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  popularTokenButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "#F8F9FA",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    color: "#374151",
    textTransform: "none",
    minWidth: "auto",
    "&:hover": {
      backgroundColor: "#E2E8F0",
    },
  },
  popularTokenText: {
    color: "#374151",
    fontSize: "14px",
    fontWeight: 500,
  },
  tokenList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "calc(80vh - 200px)",
    overflowY: "auto",
    '&::-webkit-scrollbar': {
    width: '14px',
    background: 'transparent',
  },
  '&:hover': {
    '&::-webkit-scrollbar': {
      width: '14px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: "#E2E8F0",
    },
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(0, 0, 0, 0)',
    },
    '&::-webkit-scrollbar-thumb': {
      border: '4px solid rgba(0, 0, 0, 0)',
      backgroundClip: 'padding-box',
      borderRadius: '9999px',
      backgroundColor: "white",
    },
  },
  emptyState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    minHeight: "120px",
  },
  emptyStateText: {
    fontSize: "16px",
    fontWeight: 400,
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1,
    color: "#374151",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  dialogPaper: {
    borderRadius: "30px",
    maxWidth: "418px",
    maxHeight: "80vh",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  itemIcon: {
    width: 24,
    height: 24,
    color: "#374151",
  },
}));

export default SelectTokenDialog;

