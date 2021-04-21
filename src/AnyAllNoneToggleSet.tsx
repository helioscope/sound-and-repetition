import React from 'react';

import { ToggleButton } from '@material-ui/lab';
import { Button, Typography } from '@material-ui/core';

import './AnyAllNoneToggleSet.css';

export interface ToggleItemType {
  label : string,
  key? : string | number,
  value: any
};

export interface ToggleItemGroupType {
  label? : string,
  key? : string | number,
  items : ToggleItemType[]
};

type AnyAllNoneToggleSetProps = {
  label?: string,
  itemCollection: ToggleItemType[] | ToggleItemGroupType | ToggleItemGroupType[],
  itemToggleStates: Map<any, boolean>,
  onChange: (event: React.FormEvent<HTMLButtonElement>, newSelections: Map<any, boolean>)=>void
}

function isToggleItemGroup(thing: any): thing is ToggleItemGroupType {
  return (thing as ToggleItemGroupType).items instanceof Array;
}

export default function AnyAllNoneToggleSet (props:AnyAllNoneToggleSetProps) {
  const itemCollection = props.itemCollection;
  const itemToggleStates = props.itemToggleStates;
  let allItems: ToggleItemType[] = [];
  let groups: ToggleItemGroupType[];
  let toggleGroups : JSX.Element[] = [];
  let mainLabel: JSX.Element | undefined;
  let allNoneButtons: JSX.Element | undefined;

  // handle different possible itemCollection types, converting to Array<ToggleItemGroupType>
  if (itemCollection instanceof Array) {
    if (isToggleItemGroup(itemCollection[0])) {
      groups = itemCollection as ToggleItemGroupType[];
    } else {
      groups = [{
        items: itemCollection as ToggleItemType[],
      }];
    }
  } else if (isToggleItemGroup(itemCollection)) {
    groups = [itemCollection as ToggleItemGroupType];
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
              let newToggleStates = new Map(itemToggleStates);
              newToggleStates.set(item.value, !itemToggleStates.get(item.value));
              props.onChange(evt, newToggleStates);
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
              let newToggleStates = new Map();
              allItems.forEach((item) => {
                newToggleStates.set(item.value, true);
              });
              props.onChange(evt, newToggleStates);
            }}>
          {"All"}
        </Button>
        <Button
            key="none" 
            variant="outlined"
            color="secondary"
            size="small"
            onClick={(evt)=>{
              let newToggleStates = new Map();
              allItems.forEach((item) => {
                newToggleStates.set(item.value, false);
              });
              props.onChange(evt, newToggleStates);
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