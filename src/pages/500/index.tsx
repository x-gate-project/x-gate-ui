import React from 'react';
import { useTranslation } from 'next-i18next';
// Components
import Error from '~/components/error';

interface Props {}

const SystemError = (props: Props) => {
  const { t } = useTranslation();

  return <Error code={500} message={t('error_page.500_message')} />;
};

export default SystemError;
