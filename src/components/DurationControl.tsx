import React from 'react';

import { Slider, Typography } from '@material-ui/core';

type DurationControlProps = {
  inputId: string,
  className?: string,
  label: string,
  value: number,
  min: number,
  max: number,
  step?: number,
  onChange: (event: React.ChangeEvent<{}>, newValue: number)=>void
}

export default function DurationControl (props:DurationControlProps) {
  let className = "DurationControl";
  let label = null;
  let labelId = undefined;
  const step = props.step || 0.1;
  const marks = [];

  if (props.label) {
    labelId = props.inputId + "-label";
    label = (
      <Typography id={labelId} align={"center"} gutterBottom>
        {props.label}: {props.value}s
      </Typography>
    );
  }
  if (props.className) {
    className += " " + props.className;
  }
  // for (let i = props.min; i <= props.max; i+= step) {
  //   marks.push({value: i, label: i});
  // }
  marks.push({value: props.min, label: props.min});
  marks.push({value: props.max, label: props.max});
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
        step={step}
        marks={marks}
      />
    </div>
  );
}
