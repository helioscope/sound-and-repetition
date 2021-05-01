import React from 'react';

import { Button, Collapse } from '@material-ui/core';
import AnyAllNoneToggleSet from './AnyAllNoneToggleSet';
import BinaryControl from './BinaryControl';
import DurationControl from './DurationControl';
import MultiplierControl from './MultiplierControl';
import SmallCountControl from './SmallCountControl';

import { ScaleNameExerciseSettings } from '../exercises/ScaleNameExercise';
import { rootPitchCollection, scalesCollection } from '../uiConstants';
import { MusicalScale } from '../data/scales';
import { Pitch } from '../data/pitches';

type ScaleNameExerciseControlsProps = {
  advancedConfigIsOpen: boolean,
  settings: ScaleNameExerciseSettings,
  onToggleAdvancedSettings: (nowOpen: boolean)=>void,
  onChangeSettings: (changes: Partial<ScaleNameExerciseSettings>)=>void
}

export default function ScaleNameExerciseControls (props:ScaleNameExerciseControlsProps) {
  const settings = props.settings;
  const scaleSelections = settings.scaleSelections;
  const scaleChoices = (
    <AnyAllNoneToggleSet
        label={"Scales:"}
        itemCollection={scalesCollection}
        selectedValues={scaleSelections}
        onChange={(event, newSelections) => {
          props.onChangeSettings({scaleSelections: newSelections});
        }}/>
  );
  const rootPitchSelections = settings.rootPitchSelections;
  const rootPitchChoices = (
    <AnyAllNoneToggleSet
        label={"Root pitches:"}
        itemCollection={rootPitchCollection}
        selectedValues={rootPitchSelections}
        onChange={(event, newSelections) => {
          props.onChangeSettings({rootPitchSelections: newSelections});
        }}/>
  );

  return (
    <div className="exercise-config">
      {rootPitchChoices}
      {scaleChoices}

      <Button 
        className="advanced-settings-toggle"
        color="primary"
        onClick={()=>{props.onToggleAdvancedSettings(!props.advancedConfigIsOpen)}}
      >
        {(props.advancedConfigIsOpen? "Hide" : "Show") + " Advanced Settings"}
      </Button>

      <Collapse in={props.advancedConfigIsOpen}>
        <div className="advanced-settings">
          <div className="settings-group">
            <div className="settings-group-header">
              Scale Playback
            </div>
            <div className="settings-item">
              <MultiplierControl
                label={"Scale Play Speed"}
                inputId="scale-play-speed"
                value={settings.scalePlaySpeed}
                onChange={(evt, newVal)=>{props.onChangeSettings({scalePlaySpeed: newVal})}}
                min={0.1}
                max={4.0}
              />
            </div>
            <div className="settings-item">
              <SmallCountControl
                label={"Scale Play Count"}
                inputId={'scale-play-count'}
                value={settings.scalePlayCount}
                onChange={(evt, newValue)=>{props.onChangeSettings({scalePlayCount: newValue})}}
                min={1}
                max={4}
              />
            </div>
            <div className="settings-item">
              <DurationControl
                label={"Pause Between Plays"}
                inputId="pause-between-plays"
                value={settings.pauseBetweenScalePlays}
                onChange={(evt, newVal)=>{props.onChangeSettings({pauseBetweenScalePlays: newVal})}}
                min={0.1}
                max={3.5}
                disabled={settings.scalePlayCount === 1}
              />
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-header">
              Scale Name Reading
            </div>
            <div className="settings-item">
              <BinaryControl
                label={"Read Scale Name"}
                inputId={"read-scale-name"}
                format={"switch"}
                value={settings.readScaleName}
                onChange={(evt, newVal)=>{props.onChangeSettings({readScaleName: newVal})}}
              />
            </div>
            <div className="settings-item">
              <DurationControl
                label={"Pause Before Reading"}
                inputId={"pause-before-reading"}
                value={settings.pauseBeforeNameReading}
                onChange={(evt, newVal)=>{props.onChangeSettings({pauseBeforeNameReading: newVal})}}
                min={0.1}
                max={3.5}
                disabled={!settings.readScaleName}
              />
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-header">
              Ending
            </div>
            <div className="settings-item">
              <DurationControl
                label={"Pause Before End"}
                inputId="pause-before-end"
                value={settings.pauseBeforeEnd}
                onChange={(evt, newVal)=>{props.onChangeSettings({pauseBeforeEnd: newVal})}}
                min={0.1}
                max={4.0}
              />
            </div>
            <div className="settings-item">
              <SmallCountControl
                label={"Exercise Repeats"}
                inputId={'repeat-count'}
                value={settings.repeatCount}
                onChange={(evt, newValue)=>{props.onChangeSettings({repeatCount: newValue})}}
                min={0}
                max={4}
              />
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
}