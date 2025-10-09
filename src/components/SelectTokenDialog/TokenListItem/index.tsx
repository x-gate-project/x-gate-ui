import { Token } from "@/enums/token";
import { renderTokenBalance } from "@/utils/render.util";
import {
  getTokenAddress,
  TOKEN_TO_DECIMALS_MAP,
  TOKEN_TO_ICON_MAP,
} from "@/utils/token.utils";
import { Chain } from "viem";
import { useAccount, useBalance } from "wagmi";
import clsx from "clsx";
import TokenWithChainIcon from "@/components/TokenWithChainIcon";
import Typography from "@mui/material/Typography";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import { ellipsifyText } from "@/utils/string.utils";
import { CHAIN_ID_TO_ICON_MAP } from "@/wagmi/config";

interface TokenListItemProps {
  tokenData: { token: Token; network: Chain };
  selectedToken: Token;
  selectedNetwork: Chain;
  onSelectToken: (tokenData: { token: Token; network: Chain }) => void;
}

const TokenListItem: React.FC<TokenListItemProps> = ({
  tokenData,
  selectedToken,
  selectedNetwork,
  onSelectToken,
}) => {
  const { classes } = useStyles();
  const { address } = useAccount();
  const { token, network } = tokenData;

  const tokenAddress = getTokenAddress(token, network);

  const { data: balanceData } = useBalance({
    address,
    token: tokenAddress as `0x${string}`,
    chainId: network.id,
  });

  const displayDecimals = TOKEN_TO_DECIMALS_MAP[token];
  const balance = balanceData
    ? renderTokenBalance(balanceData?.formatted, { displayDecimals })
    : "0";

  return (
    <div
      key={`${token}-${network.id}`}
      className={clsx(
        classes.tokenListItem,
        selectedNetwork &&
          network.id === selectedNetwork.id &&
          token === selectedToken &&
          classes.tokenListItemSelected
      )}
      onClick={() => onSelectToken(tokenData)}
    >
      <div className={classes.tokenInfoWrapper}>
        <TokenWithChainIcon
          tokenIcon={TOKEN_TO_ICON_MAP[token]}
          chainIcon={CHAIN_ID_TO_ICON_MAP[network.id]}
          width={32}
          height={32}
        />
        <div className={classes.tokenDetails}>
          <div className={classes.tokenInfo}>
            <div className={classes.tokenSymbolRow}>
              <Typography className={classes.tokenSymbol}>{token}</Typography>
            </div>
            <Typography className={classes.tokenName}>{token}</Typography>
          </div>
        </div>
      </div>
      <div className={classes.tokenBalanceContainer}>
        {address && (
          <Typography className={classes.tokenBalance}>{balance}</Typography>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  tokenListItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "space-between",
    padding: "12px",
    marginLeft: "12px",
    marginRight: "12px",
    backgroundColor: "white",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#E2E8F0",
    },
  },
  tokenListItemSelected: {
    backgroundColor: "#F1F5F9",
    cursor: "not-allowed",
    opacity: 0.5,
    pointerEvents: "none",
  },
  tokenInfoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  tokenDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  tokenInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  tokenSymbolRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "4px",
  },
  tokenSymbol: {
    color: "#1A1A1A",
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "20px",
  },
  tokenName: {
    color: "#64748B",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "18px",
  },
  tokenBalanceContainer: {
    maxWidth: "50%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    marginRight: "8px",
  },
  tokenBalance: {
    color: "#374151",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: "20px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}));

export default TokenListItem;
