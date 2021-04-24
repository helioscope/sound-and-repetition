import React from 'react';

import { Slider, Typography } from '@material-ui/core';

type MultiplierControlProps = {
  inputId: string,
  className?: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step?: number,
  onChange: (event: React.ChangeEvent<{}>, newValue: number)=>void
}

export default function MultiplierControl (props:MultiplierControlProps) {
  let className = "MultiplierControl";
  let label = null;
  let labelId = undefined;
  if (props.label) {
    labelId = props.inputId + "-label";
    label = (
      <Typography id={labelId} align={"center"} gutterBottom>
        {props.label}
      </Typography>
    );
  }
  if (props.className) {
    className += " " + props.className;
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
        step={props.step || 0.1}
        valueLabelDisplay="auto"
      />
    </div>
  );
}
