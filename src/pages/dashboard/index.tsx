// lib
import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
// components
import { useTranslation } from 'react-i18next';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useSigner } from '@gusdk/gu-wallet-connector';
import Layout from '../../components/layout';
import MintTab from '~/components/mint-tab';
import BurnTab from '~/components/burn-tab';
import SendTab from '~/components/send-tab';
import { useDispatch } from 'react-redux';
import { getAccountAction } from '~/store/actions/user-state-actions';

interface Props {
  title: string;
  namespacesRequired: string;
}

const Homepage: NextPage<Props> = (props) => {
  const { title } = props;
  const { t } = useTranslation();
  const { classes } = useStyles();
  const signer = useSigner();
  const dispatch = useDispatch();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const onTabChange = useCallback(
    (event: React.ChangeEvent<any>, value: any) => {
      setSelectedTabIndex(value);
    },
    [setSelectedTabIndex],
  );

  useEffect(() => {
    (async () => {
      if (signer) {
        try {
          const address = await signer.getAddress();
          await dispatch(getAccountAction(address));
        } catch (error: any) {
          console.log('ERROR: ', error.message);
        }
      }
    })();
  }, [signer, dispatch]);

  return (
    <Layout title={title}>
      <div className={classes.root}>
        <div className={classes.container}>
          <Tabs
            value={selectedTabIndex}
            onChange={onTabChange}
            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          >
            <Tab
              label={t('dashboard.send_title')}
              disableRipple
              classes={{ root: classes.tab, selected: classes.tabSelected }}
              data-testid="send-tab-button"
            />
            <Tab
              label={t('dashboard.mint_title')}
              disableRipple
              classes={{ root: classes.tab, selected: classes.tabSelected }}
              data-testid="mint-tab-button"
            />
            <Tab
              label={t('dashboard.burn_title')}
              disableRipple
              classes={{ root: classes.tab, selected: classes.tabSelected }}
              data-testid="burn-tab-button"
            />
          </Tabs>
          <div className={classes.content}>
            {selectedTabIndex === 0 && <SendTab />}
            {selectedTabIndex === 1 && <MintTab />}
            {selectedTabIndex === 2 && <BurnTab />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'start',
      paddingTop: '64px',
    },
    height: '100vh',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '40%',
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%',
    },
    [theme.breakpoints.up('sm')]: {
      maxWidth: '70%',
    },
    [theme.breakpoints.up('xs')]: {
      maxWidth: '95%',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '24px',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRoot: {
    minHeight: '32px',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
  },
  tabsIndicator: {
    height: '0px !important',
  },
  tab: {
    minWidth: '30%',
    fontSize: '16px',
    color: theme.palette.text.secondary,
    fontWeight: 500,
    textTransform: 'capitalize',
    flex: 1,
    minHeight: '28px',
  },
  tabSelected: {
    background: '#F1F5F9',
    fontWeight: 500,
    borderRadius: '9999px',
    padding: '16px',
    color: theme.palette.text.primary,
  },
}));

export default Homepage;
