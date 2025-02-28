// React, Redux
import React from 'react';
// Material UI
import Popover, { PopoverProps } from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
// Components
import { useDict } from '@/contexts/DictContext';
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import Link from 'next/link';

interface IProps {
  open: boolean;
  onClose: () => void;
  anchorEl: PopoverProps['anchorEl'];
  popoverProps?: PopoverProps;
}

const MenuPopover: React.FC<IProps> = ({
  open,
  onClose,
  anchorEl,
  popoverProps,
}) => {
  const dict = useDict();

  const { classes } = useStyles();

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
      <div className={classes.container}>
        <div className={classes.list}>
          <Link href={process.env.NEXT_PUBLIC_SWAP_PAGE_LINK || ''} target="_blank">
            <div className={classes.listItem}>
              <div className={classes.tokenInfoWrapper}>
                <Typography className={classes.tokenName}>{dict.dashboard.swap_title}</Typography>
              </div>
            </div>
          </Link>
          <div className={classes.divider} />
          <Link href={process.env.NEXT_PUBLIC_POOL_PAGE_LINK || ''} target="_blank">
            <div className={classes.listItem}>
              <div className={classes.tokenInfoWrapper}>
                <Typography className={classes.tokenName}>{dict.dashboard.pool_title}</Typography>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Popover>
  );
}

const useStyles = makeStyles()((theme: Theme) => ({
  popoverPaper: {
    marginTop: 3,
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
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
    fontSize: '16px',
    fontWeight: "bold",
    color: "#565A69",
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

export default MenuPopover;


