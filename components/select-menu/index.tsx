import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MdKeyboardArrowDown } from "react-icons/md";

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface SelectMenuProps {
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const SelectMenu: React.FC<SelectMenuProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex w-full min-w-[239px] justify-between rounded-lg bg-transparent px-3 py-2 text-sm font-medium text-primary-text-contrast border border-primary-border hover:primary-border-hover">
          {selectedValue}
          <MdKeyboardArrowDown
            className="-mr-1 ml-2 h-5 w-5 text-primary-solid"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right overflow-y-scroll absolute right-0 mt-2 min-w-[239px] z-10 rounded-lg bg-primary-bg-subtle text-primary-text-contrast ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 px-[6px] max-h-[50vh] ">
            {options.map((option) => (
              <Menu.Item key={option}>
                {({ active }) => (
                  <button
                    type="button"
                    className={classNames(
                      active ? "hover:bg-primary-bg-hover rounded-lg" : "",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                    onClick={() => onChange(option)}
                  >
                    {option}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default SelectMenu;
