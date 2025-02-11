import React from 'react';
import { useTranslation } from 'next-i18next';
// Components
import Error from '~/components/error';
import { StyledComponentProps } from '~/types/material-ui';

interface Props {}

const NotFoundError = (props: Props) => {
  const { t } = useTranslation();

  return <Error code={404} message={t('error_page.404_message')} />;
};

export default NotFoundError;
