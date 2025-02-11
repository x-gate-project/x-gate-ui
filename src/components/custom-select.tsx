import React, { useMemo } from 'react';

// components
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// themes
import { Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from 'next-i18next';

interface IItem {
  label: string;
  value: string;
}

interface IProps {
  onChange?: any;
  items: IItem[];
  valueSelected: any;
  placeholder?: string;
  disabled?: boolean;
  selectProps?: SelectProps;
}

const CustomSelect: React.FC<IProps> = (props) => {
  const { items, valueSelected, placeholder, selectProps, disabled, onChange } = props;
  const { classes } = useStyles();
  const { t } = useTranslation('common');

  const values = useMemo(() => {
    const arr = items.concat();
    let value = valueSelected;
    const placeHolderItem: IItem = {
      value: '',
      label: placeholder || '',
    };
    if (!valueSelected) {
      arr.unshift(placeHolderItem);
      value = placeHolderItem.value;
    }

    return {
      arr,
      value,
      placeHolderItem,
    };
  }, [valueSelected, placeholder]);

  return (
    <Select
      value={values.value}
      onChange={onChange}
      disabled={disabled}
      style={{ width: '150px' }}
      inputProps={{
        sx: {
          padding: '0',
        },
      }}
      // className={classNames({
      //   [classes.customSelect]: true,
      // })}
      // disableUnderline
      // classes={{
      //   root: classes.selectRoot,
      // }}
      IconComponent={(_) => (
        <img className={classes.icon} src="/images/icons/arrow-down_icon.svg" alt="" />
      )}
      {...selectProps}
    >
      {values.arr.map((item, index) => (
        <MenuItem
          key={index}
          value={item.value}
          style={{ display: item.value === values.placeHolderItem.value ? 'none' : 'inherit' }}
        >
          {t(item.label)}
        </MenuItem>
      ))}
    </Select>
  );
};

const useStyles = makeStyles()((theme: Theme) => ({
  customSelect: {
    background: theme.colors.white,
    border: '1px solid #b0b0b0',
    height: '28px',
    borderRadius: '0px',
  },
  selectRoot: {
    width: 120,
    padding: 4,
  },
  icon: {
    position: 'absolute',
    right: 10,
    cursor: 'pointer',
  },
}));

export default CustomSelect;
