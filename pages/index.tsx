export { default } from '~/pages/dashboard';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../next-i18next.config';

export const getServerSideProps = async ({ locale }) => ({
  props: {
    title: 'USDTX',
    ...(await serverSideTranslations(locale || 'en', ['common'], nextI18NextConfig)),
  },
});
