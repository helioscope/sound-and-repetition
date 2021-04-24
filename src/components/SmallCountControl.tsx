import React from 'react';

import { FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, NativeSelect, Typography } from '@material-ui/core';

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
    // label = (
    //   <InputLabel htmlFor={props.inputId}>{props.label}</InputLabel>
    // );
    label = (
      <Typography align={"center"} gutterBottom>
        {props.label}
      </Typography>
    );
  }
  if (props.className) {
    className += " " + props.className;
  }

  for (let i = props.min; i < max; i += step) {
    // optionElems.push(
    //   <option key={i} value={i}>{i}</option>
    // );
    optionElems.push(
      <FormControlLabel key={i} value={i} control={<Radio />} label={i} labelPlacement="top" />
    );
  }

  return (
    <div className={className}>
      <FormControl>
        {label}
        {/* <NativeSelect
          value={props.value}
          onChange={(evt) => {props.onChange(evt, parseInt(evt.target.value))}}
          inputProps={{
            name: props.inputId,
            id: props.inputId,
          }}
        >
          {optionElems}
        </NativeSelect> */}
        <RadioGroup 
          row 
          name={props.inputId}
          value={props.value}
          onChange={(evt, value)=>{props.onChange(evt, parseInt(value))}}
        >
          {optionElems}
        </RadioGroup>
      </FormControl>
    </div>
  );
}
