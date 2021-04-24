import React from 'react';

import { FormControl, InputLabel, NativeSelect } from '@material-ui/core';

type SmallCountControlProps = {
  inputId: string,
  className?: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step?: number,
  onChange: (event: React.ChangeEvent<{}>, newValue: number)=>void
}

export default function SmallCountControl (props:SmallCountControlProps) {
  let className = "SmallCountControl";
  let label = null;
  let max = props.max;
  let step = props.step || 1;
  let optionElems = [];

  if (props.label) {
    label = (
      <InputLabel htmlFor={props.inputId}>{props.label}</InputLabel>
    );
  }
  if (props.className) {
    className += " " + props.className;
  }

  for (let i = props.min; i < max; i += step) {
    optionElems.push(
      <option key={i} value={i}>{i}</option>
    );
  }

  return (
    <div className={className}>
      <FormControl>
        {label}
        <NativeSelect
          value={props.value}
          onChange={(evt) => {props.onChange(evt, parseInt(evt.target.value))}}
          inputProps={{
            name: props.inputId,
            id: props.inputId,
          }}
        >
          {optionElems}
        </NativeSelect>
      </FormControl>
    </div>
  );
}
