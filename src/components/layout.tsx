import React from 'react';
import Head from 'next/head';
// components
import Header from './header';
// themes
import { Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

interface IProps {
  title?: string;
  visibleHelper?: boolean;
}

const Layout: React.FC<React.PropsWithChildren<IProps>> = (props) => {
  const { title, children } = props;
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <div className={classes.content}>{children}</div>
    </div>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  root: {},
  content: {
    marginTop: 60,
    minHeight: '100vh',
    overflow: 'hidden',
    background: theme.colors.white,
    [theme.breakpoints.up('sm')]: {
      marginTop: 50,
    },
  },
}));

export default Layout;
