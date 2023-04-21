import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Slider from 'rc-slider';
import { RadioGroup } from '@/components/ui/radio-group';
import Collapse from '@/components/ui/collapse';
import { useDrawer } from '@/components/drawer-views/context';
import Button from '@/components/ui/button';
import { NormalGridIcon } from '@/components/icons/normal-grid';
import { CompactGridIcon } from '@/components/icons/compact-grid';
import { Close } from '@/components/icons/close';
import { Listbox } from '@/components/ui/listbox';
import { Transition } from '@headlessui/react';
import { ChevronDown } from '@/components/icons/chevron-down';
import { useGridSwitcher } from '@/lib/hooks/use-grid-switcher';
import { Check } from '@/components/icons/check';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { setFilters, reset } from '@/store/roadmapFilterSlice';

export function GridSwitcher() {
  const { isGridCompact, setIsGridCompact } = useGridSwitcher();
  return (
    <div className="flex overflow-hidden rounded-xl">
      <button
        className={`relative flex h-11 w-11 items-center justify-center bg-gray-800 transition ${
          !isGridCompact ? 'z-10 text-white' : 'text-white'
        }`}
        onClick={() => setIsGridCompact(!isGridCompact)}
        aria-label="Normal Grid"
      >
        {!isGridCompact && (
          <motion.span
            className="absolute left-0 right-0 bottom-0 h-full w-full bg-brand shadow-large"
            layoutId="gridSwitchIndicator"
          />
        )}
        <NormalGridIcon className="relative" />
      </button>
      <button
        className={`relative flex h-11 w-11 items-center justify-center bg-gray-800 transition ${
          isGridCompact ? 'z-10 text-white' : 'text-white'
        }`}
        onClick={() => setIsGridCompact(!isGridCompact)}
        aria-label="Normal Grid"
      >
        {isGridCompact && (
          <motion.span
            className="absolute left-0 right-0 bottom-0 h-full w-full  bg-brand shadow-large"
            layoutId="gridSwitchIndicator"
          />
        )}
        <CompactGridIcon className="relative" />
      </button>
    </div>
  );
}

export const sort = [
  { id: 1, name: 'Date Listed: Newest' },
  { id: 2, name: 'Date Listed: Oldest' },
  { id: 3, name: 'Ending: Soonest' },
  { id: 4, name: 'Ending: Latest' },
];

export function SortList() {
  const [selectedItem, setSelectedItem] = useState(sort[0]);
  return (
    <div className="relative">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex h-10 w-auto items-center justify-between rounded-xl bg-gray-800 px-4 text-xs text-white sm:w-56 sm:text-sm lg:h-11">
          {selectedItem.name}
          <ChevronDown className="ml-2" />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-light-dark p-3 shadow-large sm:w-full">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-xl px-3 py-2 text-xs font-medium text-white transition sm:text-sm  ${
                      selected ? 'my-1 bg-gray-800' : 'hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

interface RangeFilterProps {
  min: number;
  max: number;
  range: {
    min: number;
    max: number;
  };
  setRange: React.Dispatch<
    React.SetStateAction<{
      min: number;
      max: number;
    }>
  >;
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
  range,
  min,
  max,
  setRange,
}) => {
  function handleRangeChange(value: any) {
    setRange({
      min: value[0],
      max: value[1],
    });
  }
  function handleMaxChange(max: number) {
    setRange({
      ...range,
      max: max || range.min,
    });
  }
  function handleMinChange(min: number) {
    setRange({
      ...range,
      min: min || 0,
    });
  }
  return (
    <div className="p-5">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <input
          className="h-9 rounded-xl border-gray-600 bg-gray-800 text-sm text-white outline-none focus:border-gray-500 focus:outline-none focus:ring-0"
          type="number"
          value={range.min}
          onChange={(e) => handleMinChange(parseInt(e.target.value))}
          min="0"
          max={range.max}
          placeholder="placeholder"
        />
        <input
          className="h-9 rounded-xl border-gray-600 bg-gray-800 text-sm text-white outline-none focus:border-gray-500 focus:outline-none focus:ring-0"
          type="number"
          value={range.max}
          onChange={(e) => handleMaxChange(parseInt(e.target.value))}
          min={range.min}
          placeholder="placeholder"
        />
      </div>
      <Slider
        range
        min={min}
        max={max}
        value={[range.min, range.max]}
        allowCross={false}
        onChange={(value: any) => handleRangeChange(value)}
      />
    </div>
  );
};

interface StatusProps {
  values: string[];
  plan: string;
  setPlan: React.Dispatch<React.SetStateAction<string>>;
}

export const Status: React.FC<StatusProps> = ({ values, plan, setPlan }) => {
  return (
    <RadioGroup
      value={plan}
      onChange={setPlan}
      className="grid grid-cols-2 gap-2 p-4"
    >
      {values.map((val, idx) => {
        return (
          <RadioGroup.Option value={val} key={idx}>
            {({ checked }) => (
              <span
                className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
                  checked
                    ? 'border-brand bg-brand text-white shadow-button'
                    : 'border-gray-700 bg-gray-800 text-white'
                }`}
              >
                {val}
              </span>
            )}
          </RadioGroup.Option>
        );
      })}
    </RadioGroup>
  );
};

interface CheckBoxListProps {
  list: string[];
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}

const CheckBoxList: React.FC<CheckBoxListProps> = ({
  list,
  selectedValues,
  setSelectedValues,
}) => {
  const handleCheck = (value: string) => {
    if (selectedValues.includes(value)) {
      const newValues = selectedValues.filter((val) => {
        return val !== value;
      });
      setSelectedValues(newValues);
    } else {
      const newValues = [...selectedValues, value];
      setSelectedValues(newValues);
    }
  };
  return (
    <div className="flex w-full flex-col gap-3 p-5">
      {list.length !== 0 &&
        list.map((item, idx) => {
          return (
            <div className="flex w-full flex-row" key={idx}>
              <div
                onClick={() => handleCheck(item)}
                className="mr-2 flex h-6 w-6 items-center justify-center rounded-sm bg-gray-600"
              >
                {selectedValues.includes(item) && <Check />}
              </div>
              <div>{item}</div>
            </div>
          );
        })}
    </div>
  );
};

const OrderByValues = [
  'Newest',
  'Public Goods',
  'Defi Protocols',
  'Web3 Infra',
  'Longevity',
  'Deep Tech',
];

const OutlookValues = [
  'Long-term Public',
  'Good (>5yrs+)',
  'Next 2 yrs',
  'Next 5 yrs',
];

const OutcomeValues = [
  'Infrastructure',
  'Tooling',
  'Publication',
  'Product',
  'Other',
];

export function Filters() {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [activeObjectivesRange, setActiveObjectivesRange] = useState({
    min: 0,
    max: 100,
  });
  const [outlook, setOutlook] = useState('');
  const [outcome, setOutcome] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const triggerSet = useAppSelector((state) => state.roadmapFilter.triggerSet);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (triggerSet) {
      const data = {
        'filter.roadmap_outlook': outlook,
        'filter.roadmap_outcome_types':
          outcome.length > 0 ? outcome.join(',') : '',
        'filter.roadmap_total_stake': `${priceRange.min},${priceRange.max}`,
        'filter.roadmap_active_objectives': `${activeObjectivesRange.min},${activeObjectivesRange.max}`,
      };
      dispatch(setFilters(data));
    }
  }, [triggerSet, dispatch]);

  return (
    <>
      <Collapse label="Active Objectives" initialOpen>
        <RangeFilter
          min={0}
          max={100}
          range={activeObjectivesRange}
          setRange={setActiveObjectivesRange}
        />
      </Collapse>
      <Collapse label="Amount Staked (USD)" initialOpen>
        <RangeFilter
          min={0}
          max={1000}
          range={priceRange}
          setRange={setPriceRange}
        />
      </Collapse>
      {/* <Collapse label="Creator" initialOpen>
        <CollectionSelect onSelect={(value) => console.log(value)} />
      </Collapse> */}
      <Collapse label="Outlook" initialOpen>
        <Status plan={outlook} setPlan={setOutlook} values={OutlookValues} />
      </Collapse>
      <Collapse label="Outcome" initialOpen>
        <CheckBoxList
          selectedValues={outcome}
          setSelectedValues={setOutcome}
          list={OutcomeValues}
        />
      </Collapse>
    </>
  );
}

export default function DrawerFilters() {
  const { closeDrawer } = useDrawer();
  return (
    <div className="relative w-full max-w-full bg-dark xs:w-80">
      <div className="flex h-20 items-center justify-between overflow-hidden px-6 py-4">
        <h2 className="text-xl font-medium uppercase tracking-wider text-white">
          Filters
        </h2>
        <Button shape="circle" onClick={closeDrawer}>
          <Close className="h-auto w-3" />
        </Button>
      </div>
      <div className="h-[75vh] overflow-y-scroll px-6 pb-20 pt-1">
        <Filters />
      </div>
      <div className="absolute left-0 bottom-4 z-10 w-full px-6">
        <Button fullWidth onClick={closeDrawer}>
          DONE
        </Button>
      </div>
    </div>
  );
}
