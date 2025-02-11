import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
// Components
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// Types
import { StyledComponentProps } from '~/types/material-ui';
// Styles
import { makeStyles } from 'tss-react/mui';
import Layout from '../layout';

interface Props extends StyledComponentProps<typeof useStyles> {
  code?: number;
  message?: string;
}

const Error: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { code = 500, message = t('error_page.system_error_message') } = props;
  const { classes } = useStyles(undefined, { props: { classes: props.classes } });

  return (
    <Layout>
      <Paper className={classes.paper}>
        <div className={classes.logo}>
          <img src="/images/logo.svg" alt="" />
        </div>
        <Typography variant="h6" className={classes.code}>
          ({code})
        </Typography>
        <Typography variant="body2" className={classes.message}>
          {message}
        </Typography>
        <div className={classes.loginButtonWrapper}>
          <Link href={'#'}>
            <Button data-testid="back-to-dashboard-button" variant="contained" color="primary">
              {t('dashboard')}
            </Button>
          </Link>
        </div>
        <div data-testid="contact-us-link" className={classes.contactLink}>
          <Link href={'#'}>
            <Typography data-testid="contact-us-title" variant="button">
              {t('error_page.click_here_to_contact_us')}
            </Typography>
          </Link>
        </div>
      </Paper>
    </Layout>
  );
};

const useStyles = makeStyles()((theme) => ({
  paper: {
    width: '100%',
    textAlign: 'center',
    padding: '50px 10px 40px',
    [theme.breakpoints.up('sm')]: {
      padding: '100px 20px 85px',
    },
  },
  logo: {
    '& img': {
      width: 200,
    },
  },
  code: {
    marginTop: 24,
  },
  message: {
    margin: '24px auto 0',
    maxWidth: 220,
  },
  loginButtonWrapper: {
    marginTop: 24,
  },
  contactLink: {
    marginTop: 24,
    color: theme.colors.dodgerBlue,
    cursor: 'pointer',
  },
}));

export default Error;
