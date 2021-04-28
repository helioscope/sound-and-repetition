import React from 'react';

import './BinaryControl.css';

import { FormControlLabel, Switch, Checkbox } from '@material-ui/core';

type BinaryControlProps = {
  inputId: string,
  className?: string,
  label: string,
  value: boolean,
  format: 'switch' | 'checkbox',
  onChange: (event: React.ChangeEvent<{}>, newValue: boolean)=>void,
  disabled?: boolean
}

export default function BinaryControl (props:BinaryControlProps) {
  let className = "BinaryControl";
  let controlElement = null;
  
  if (props.className) {
    className += " " + props.className;
  }

  if (props.format === 'switch') {
    controlElement = (
      <Switch 
        color="primary"
        checked={props.value}
        onChange={(evt, newVal)=>{props.onChange(evt, newVal)}}
      />
    );
  } else if (props.format === 'checkbox') {
    controlElement = (
      <Checkbox 
        color="primary"
        checked={props.value}
        onChange={(evt, newVal)=>{props.onChange(evt, newVal)}}
      />
    );
  } else {
    throw new Error(`unsupported BinaryControl format: ${props.format}`);
  }

  return (
    <div className={className}>
      <FormControlLabel
        control={controlElement}
        label={props.label + ": " + (props.value? "Yes" : "No")}
        labelPlacement="top"
        disabled={props.disabled}
      />
    </div>
  );
}
