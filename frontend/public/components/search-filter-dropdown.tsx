import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dropdown as DropdownDeprecated,
  DropdownToggle as DropdownToggleDeprecated,
  DropdownItem as DropdownItemDeprecated,
} from '@patternfly/react-core/deprecated';
import { CaretDownIcon } from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { TextFilter } from './factory';

export enum searchFilterValues {
  // t('public~Label')
  Label = 'Label',
  // t('public~Name')
  Name = 'Name',
}

export const SearchFilterDropdown: React.SFC<SearchFilterDropdownProps> = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(searchFilterValues.Label);

  const { onChange, nameFilterInput, labelFilterInput } = props;

  const { t } = useTranslation();

  const onToggle = (_event, open: boolean) => setOpen(open);
  const onSelect = (event: React.SyntheticEvent) => {
    setSelected((event.target as HTMLInputElement).name as searchFilterValues);
    setOpen(!isOpen);
  };
  const dropdownItems = [
    <DropdownItemDeprecated
      key="label-action"
      data-test="label-filter"
      name={searchFilterValues.Label}
      component="button"
    >
      {t(searchFilterValues.Label)}
    </DropdownItemDeprecated>,
    <DropdownItemDeprecated
      key="name-action"
      data-test="name-filter"
      name={searchFilterValues.Name}
      component="button"
    >
      {t(searchFilterValues.Name)}
    </DropdownItemDeprecated>,
  ];
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const { value } = e.target as HTMLInputElement;
      onChange(selected, value, true);
    }
  };

  const handleInputValue = (_event, value: string) => {
    onChange(selected, value, false);
  };

  return (
    <div className="pf-v5-c-input-group">
      <DropdownDeprecated
        onSelect={onSelect}
        toggle={
          <DropdownToggleDeprecated
            id="toggle-id"
            onToggle={onToggle}
            toggleIndicator={CaretDownIcon}
          >
            <>
              <FilterIcon className="span--icon__right-margin" /> {t(selected)}
            </>
          </DropdownToggleDeprecated>
        }
        isOpen={isOpen}
        dropdownItems={dropdownItems}
      />
      <TextFilter
        parentClassName="co-search__filter-input"
        onChange={handleInputValue}
        placeholder={selected === searchFilterValues.Label ? 'app=frontend' : 'my-resource'}
        name="search-filter-input"
        id="search-filter-input"
        value={selected === searchFilterValues.Label ? labelFilterInput : nameFilterInput}
        onKeyDown={handleKeyDown}
        aria-labelledby="toggle-id"
      />
    </div>
  );
};

export type SearchFilterDropdownProps = {
  onChange: (type: string, value: string, endOfString: boolean) => void;
  nameFilterInput: string;
  labelFilterInput: string;
};
