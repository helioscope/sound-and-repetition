import React from 'react';

import { Slider, Typography } from '@material-ui/core';

type SmallCountControlProps = {
  inputId: string,
  className?: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step?: number,
  onChange: (event: React.ChangeEvent<{}>, newValue: number)=>void,
  disabled?: boolean
}

export default function SmallCountControl (props:SmallCountControlProps) {
  let className = "SmallCountControl";
  let label = null;
  let labelId = undefined;
  let step = props.step || 1;
  const marks = [];

  if (props.label) {
    labelId = props.inputId + "-label";
    label = (
      <Typography id={labelId} align={"center"} gutterBottom>
        {props.label}: {props.value}
      </Typography>
    );
  }
  if (props.className) {
    className += " " + props.className;
  }
  for (let i = props.min; i <= props.max; i+= step) {
    marks.push({value: i, label: i});
  }
  return (
    <div className={className}>
      {label}
      <Slider
        aria-labelledby={labelId}
        id={props.inputId}
        value={props.value}
        onChange={(evt, val) => {props.onChange(evt, val as number)}}
        min={props.min}
        max={props.max}
        step={props.step}
        marks={marks}
        disabled={props.disabled}
      />
    </div>
  );
}
