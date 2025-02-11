import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Tooltip,
  Box,
  alpha,
  InputAdornment,
  Divider,
  IconButton,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { initialValues, validateForm } from './form';
import { useSelector } from 'react-redux';
import { RootState } from '~/store/configure-store';
import theme from '~/styles/theme';

interface IProps {}

const SendTab: React.FC<IProps> = (props) => {
  const [mintAmount, setMintAmount] = useState(0);
  const { classes } = useStyles();
  const { t } = useTranslation();
  const [isMinting, setIsMinting] = useState(false);
  const account = useSelector((state: RootState) => state.userState?.account);
  const [isToETH, setIsToETH] = useState(false);

  const onSubmit = useCallback(() => {
    console.log('AMOUNT: ');
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    if (!isNaN(Number(amount))) {
      setMintAmount(Number(amount));
    }
    formik.handleChange(event);
  };

  const swapFromAndToNetwork = useCallback(() => {
    setIsToETH(!isToETH);
  }, [setIsToETH, isToETH]);

  const formik = useFormik({
    initialValues: initialValues,
    validate: validateForm(t),
    enableReinitialize: true,
    onSubmit: onSubmit,
  });

  const handleSetMaxAmount = useCallback(() => {
    const maxAmount = Math.floor(
      isToETH ? Number(account?.usdtxBalance || '0') : Number(account?.usdtBalance || '0'),
    );
    setMintAmount(maxAmount);
    formik.setFieldValue('from', maxAmount);
  }, [formik, account, isToETH]);

  const handleSetHalfAmount = useCallback(() => {
    const halfAmount = Math.floor(
      (isToETH ? Number(account?.usdtxBalance || '0') : Number(account?.usdtBalance || '0')) / 2,
    );
    setMintAmount(halfAmount);
    formik.setFieldValue('from', halfAmount);
  }, [formik, account, isToETH]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={classes.wrapper}>
        <div className={classes.itemWrapper}>
          <Typography className={classes.sendTitle}>{t('send_tab.from')}</Typography>
          <TextField
            fullWidth
            placeholder="0"
            variant="outlined"
            disabled={!account}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <div className={classes.recommendWrapper}>
                    <div className={classes.chipWrapper}>
                      <Chip
                        onClick={handleSetMaxAmount}
                        label={t('send_tab.max')}
                        className={classes.chipButton}
                      />
                      <Chip
                        onClick={handleSetHalfAmount}
                        label={'50%'}
                        className={classes.chipButton}
                      />
                    </div>
                    <div className={classes.balanceWrapper}>
                      <Chip
                        icon={
                          isToETH ? (
                            <img src="/images/icons/usdtx-joc.svg" alt="USDT" width="28" />
                          ) : (
                            <img src="/images/icons/usdtx-eth.svg" alt="USDT" width="28" />
                          )
                        }
                        label={'USDTX'}
                        variant="outlined"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          textAlign: 'left',
                          padding: '0px',
                        }}
                      />
                      <Box
                        display="flex"
                        alignItems="baseline"
                        overflow="hidden"
                        maxWidth={120}
                        gap={1}
                      >
                        <div className={classes.balanceTitle}>{`${t('send_tab.balance')}:`}</div>
                        <Tooltip
                          title={(isToETH ? account?.usdtxBalance : account?.usdtBalance) || '-'}
                        >
                          <Typography className={classes.balanceContent}>
                            {(isToETH ? account?.usdtxBalance : account?.usdtBalance) || ''}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </div>
                  </div>
                </InputAdornment>
              ),
            }}
            className={classes.textField}
            sx={{
              '& .MuiInputBase-input': {
                padding: '32px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
            autoFocus
            size="medium"
            value={formik.values.from}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            name="from"
            inputProps={{ 'data-testid': 'from-input' }}
            helperText={
              (Boolean(formik.errors.amount) && formik.touched.amount) ||
              mintAmount > Number(account?.usdtBalance)
                ? t('send_tab.invalid_amount')
                : ''
            }
            error={
              (Boolean(formik.errors.amount) && formik.touched.amount) ||
              ((mintAmount > Number(account?.usdtBalance)) as any)
            }
          />
        </div>

        <div className={classes.dividerWrapper}>
          <Divider className={classes.divider}></Divider>
          <IconButton
            onClick={swapFromAndToNetwork}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '4px',
              width: '32px',
              height: '32px',
            }}
          >
            <img src="/images/icons/arrow-up-down.svg" alt="Icon" width="16" height="16" />
          </IconButton>
          <Divider className={classes.divider}></Divider>
        </div>

        <div className={classes.itemWrapper}>
          <Typography className={classes.sendTitle}>{t('send_tab.to')}</Typography>
          <TextField
            fullWidth
            placeholder="0"
            variant="outlined"
            disabled
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <div className={classes.recommendWrapper}>
                    <div className={classes.balanceWrapper}>
                      <Chip
                        icon={
                          isToETH ? (
                            <img src="/images/icons/usdtx-eth.svg" alt="USDTX" width="24" />
                          ) : (
                            <img src="/images/icons/usdtx-joc.svg" alt="USDTX" width="24" />
                          )
                        }
                        label={'USDTX'}
                        variant="outlined"
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          textAlign: 'left',
                          padding: '0px',
                        }}
                      />
                    </div>
                  </div>
                </InputAdornment>
              ),
            }}
            className={classes.textField}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
              '& .MuiInputBase-input': {
                paddingLeft: '32px',
              },
            }}
            size="medium"
            value={formik.values.from}
            name="to"
            inputProps={{ 'data-testid': 'to-input' }}
          />
        </div>
        <Button
          variant="contained"
          className={classes.sendButton}
          onClick={() => formik.handleSubmit()}
          type="submit"
          color="primary"
          disabled={
            !formik.isValid ||
            !formik.dirty ||
            mintAmount > (isToETH ? Number(account?.usdtxBalance) : Number(account?.usdtBalance)) ||
            isMinting ||
            !account ||
            mintAmount === 0
          }
          endIcon={isMinting && <CircularProgress size={20} color="inherit" />}
        >
          {t('send_tab.button')}
        </Button>
      </div>
    </form>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  wrapper: {
    width: '100%',
    padding: '32px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0px 1px 2px -1px rgba(0, 0, 0, 0.10), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
    border: `1px solid ${theme.palette.divider}`,
  },
  itemWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'start',
  },
  sendButton: {
    textTransform: 'none',
    padding: '12px',
  },
  sendTitle: {
    fontSize: '16px',
    fontWeight: 400,
    textAlign: 'left',
  },
  textFieldWrapper: {
    display: 'flex',
    flex: 1,
    width: '100%',
    borderRadius: '8px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textField: {
    '& input': { fontSize: '32px', fontWeight: 400 },
    fontSize: '32px',
    fontStyle: 'normal',
    fontWeight: 400,
  },
  balanceWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100px',
    paddingX: '8px',
    gap: '8px',
    [theme.breakpoints.down('sm')]: {
      gap: '4px',
    },
  },
  recommendWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
    },
  },
  chipWrapper: {
    display: 'flex',
    gap: '4px',
  },
  chipButton: {
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '100%',
    '&:hover': {
      background: alpha(theme.palette.primary.main, 0.3),
      color: theme.palette.primary.main,
      cursor: 'pointer',
    },
  },
  balanceTitle: {
    fontSize: '14px',
    color: theme.palette.text.secondary,
    maxLines: 1,
  },
  balanceContent: {
    fontSize: '14px',
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxLines: 1,
  },
  dividerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  divider: {
    color: theme.palette.divider,
    display: 'flex',
    flex: 1,
  },
}));

export default SendTab;
