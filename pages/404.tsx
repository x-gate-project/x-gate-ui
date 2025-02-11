export { default } from '~/pages/404';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18NextConfig from '../next-i18next.config';

export const getStaticProps = async ({ locale }) => ({
  props: {
    title: 'Not Found',
    ...(await serverSideTranslations(locale || 'en', ['common'], nextI18NextConfig)),
  },
});
