import React, { useEffect } from "react";
import cx from "classnames";
import { Listbox as ImplListBox, Transition } from "@headlessui/react";

import SelectDownArrow from "assets/select-down-arrow.svg";

import "./styles.css";
import {INetwork} from '../WalletDialog.tsx';

type ListboxArrayProps = {
  label?: React.ReactNode;
  placeholder?: string;
  btnClassName?: string;
  onChangeValue: (value: any) => void;
  data: { name: string; id: string }[];
  initValue?: any;
};

export function ListBoxArray({
                               label,
                               initValue,
                               onChangeValue,
                               data,
                               placeholder,
                               btnClassName,
                               className,
                               ...divProps
                             }: ListboxArrayProps & Omit<React.HTMLProps<HTMLDivElement>, "data">) {
  const [selectedItem, setSelectedItem] = React.useState<
      any | null
  >(initValue ?? null);

  useEffect(() => {
    if (selectedItem) {
      onChangeValue(selectedItem);
    }
  }, [selectedItem]);

  return (
      <ImplListBox
          {...divProps}
          value={selectedItem}
          onChange={setSelectedItem}
          as='div'
          className={cx("app-listbox", className)}
      >
        {label && <ImplListBox.Label>{label}</ImplListBox.Label>}
        <ImplListBox.Button
            data-app-active={selectedItem !== null}
            className={cx("app-listbox-btn", btnClassName)}
        >
          {selectedItem === null
              ? placeholder || "Select an option"
              : selectedItem.name}
          <img src={SelectDownArrow} />
        </ImplListBox.Button>
        <Transition
            as={React.Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
        >
          <ImplListBox.Options as='ul' className='app-listbox-options'>
            {data.map(option => (
                <ImplListBox.Option as='li' key={option.id} value={option}>
                  {option.name}
                </ImplListBox.Option>
            ))}
          </ImplListBox.Options>
        </Transition>
      </ImplListBox>
  );
}
