import React, { Props } from 'react';

import { ToggleButton } from '@material-ui/lab';
import { Button, Typography } from '@material-ui/core';

import './AnyAllNoneToggleSet.css';

export interface ToggleItem<ValueType> {
  label : string,
  key? : string | number,
  value: ValueType // probably better to use generics?
};

export interface ToggleItemGroup<ItemValueType> {
  label? : string,
  key? : string | number,
  items : ToggleItem<ItemValueType>[]
};

type AnyAllNoneToggleSetProps<ItemValueType> = {
  label?: string,
  itemCollection: ToggleItem<ItemValueType>[] | ToggleItemGroup<ItemValueType> | ToggleItemGroup<ItemValueType>[],
  selectedValues: ItemValueType[],
  onChange: (event: React.FormEvent<HTMLButtonElement>, newSelections: ItemValueType[])=>void
}

function isToggleItemGroup(thing: any): thing is ToggleItemGroup<any> {
  return (thing as ToggleItemGroup<any>).items instanceof Array;
}

type TempType = any; // todo: adopt generics in component -- this string will be easier to find & replace than 'any'

export default function AnyAllNoneToggleSet (props:AnyAllNoneToggleSetProps<TempType>) { // probably better to use generics for component?
  const itemCollection = props.itemCollection;
  let allItems: ToggleItem<TempType>[] = [];
  let groups: ToggleItemGroup<TempType>[];
  let toggleGroups : JSX.Element[] = [];
  let mainLabel: JSX.Element | undefined;
  let allNoneButtons: JSX.Element | undefined;
  let selectedValues: TempType[] = props.selectedValues;
  let itemToggleStates: Map<TempType, boolean> = new Map<TempType, boolean>();

  // minor performance tweak -- instead of finding the value in selectedValues[] for every item, make a map first
  // further performance improvements could explore react's built-in memoization features
  selectedValues.forEach((value) => {
    itemToggleStates.set(value, true);
  })

  // handle different possible itemCollection types, converting to Array<ToggleItemGroupType>
  if (itemCollection instanceof Array) {
    if (isToggleItemGroup(itemCollection[0])) {
      groups = itemCollection as ToggleItemGroup<TempType>[];
    } else {
      groups = [{
        items: itemCollection as ToggleItem<TempType>[],
      }];
    }
  } else if (isToggleItemGroup(itemCollection)) {
    groups = [itemCollection as ToggleItemGroup<TempType>];
  } else {
    throw new Error("unhandled itemCollection type");
  }
  
  // build optionally-labeled groups of ToggleButtons
  groups.forEach((group, groupIndex)=>{
    const toggles : JSX.Element[] = [];
    let groupLabel : JSX.Element | undefined = undefined;

    group.items.forEach((item, itemIndex) => {
      allItems.push(item);
      toggles.push(
        <ToggleButton
            key={item.key? item.key : itemIndex}
            value={item.value}
            selected={itemToggleStates.get(item.value)}
            size={"small"}
            onChange={(evt) => {
              let newSelections: TempType[] = [];
              if (itemToggleStates.get(item.value)) { 
                // item is selected -- remove it
                selectedValues.forEach((selectedValue)=>{
                  if (selectedValue !== item.value) {
                    newSelections.push(selectedValue);
                  }
                });
              } else {
                // item is not selected -- add it
                newSelections = selectedValues.slice();
                newSelections.push(item.value);
              }
              props.onChange(evt, newSelections);
            }}>
          {item.label}
        </ToggleButton>
      );
    });

    if (group.label) {
      groupLabel = (
        <div className="group-label">
          {group.label}
        </div>
      )
    }

    toggleGroups.push(
      <div className="grouped-toggles" key={group.key? group.key : groupIndex}>
        {groupLabel}
        {toggles}
      </div>
    );
  });

  if (props.label) {
    mainLabel = (
      <Typography gutterBottom className="toggleset-label">
        {props.label}
      </Typography>
    );
  }

  if (allItems.length > 1) {
    allNoneButtons = (
      <div className="all-none-buttons">
        <Button 
            key="all"
            variant="outlined"
            color="primary"
            size="small"
            onClick={(evt)=>{
              let newSelections : TempType[] = [];
              allItems.forEach((item) => {
                newSelections.push(item.value);
              });
              props.onChange(evt, newSelections);
            }}>
          {"All"}
        </Button>
        <Button
            key="none" 
            variant="outlined"
            color="secondary"
            size="small"
            onClick={(evt)=>{
              props.onChange(evt, []);
            }}>
          {"None"}
        </Button>
      </div>
    )
  }
  
  return (
    <div className="AnyAllNoneToggleSet">
      {mainLabel}
      <div className="body">
        {toggleGroups}
        {allNoneButtons}
      </div>
    </div>
  );
}