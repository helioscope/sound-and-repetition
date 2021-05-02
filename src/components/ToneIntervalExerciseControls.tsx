import React from 'react';

import { Button, Collapse } from '@material-ui/core';
import AnyAllNoneToggleSet from './AnyAllNoneToggleSet';
import BinaryControl from './BinaryControl';
import DurationControl from './DurationControl';
import MultiplierControl from './MultiplierControl';
import SmallCountControl from './SmallCountControl';

import { ToneIntervalExerciseSettings } from '../exercises/ToneIntervalExercise';
import { rootPitchCollection, intervalsCollection } from '../uiConstants';


type ToneIntervalExerciseControlsProps = {
  advancedConfigIsOpen: boolean,
  settings: ToneIntervalExerciseSettings,
  onToggleAdvancedSettings: (nowOpen: boolean)=>void,
  onChangeSettings: (changes: Partial<ToneIntervalExerciseSettings>)=>void
}

export default function ScaleNameExerciseControls (props:ToneIntervalExerciseControlsProps) {
  const settings = props.settings;
  const intervalSelections = settings.intervalSelections;
  const intervalChoices = (
    <AnyAllNoneToggleSet
        label={"Intervals:"}
        itemCollection={intervalsCollection}
        selectedValues={intervalSelections}
        onChange={(event, newSelections) => {
          props.onChangeSettings({intervalSelections: newSelections});
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
      {intervalChoices}

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
                label={"Interval Play Speed"}
                inputId="interval-play-speed"
                value={settings.examplePlaySpeed}
                onChange={(evt, newVal)=>{props.onChangeSettings({examplePlaySpeed: newVal})}}
                min={0.1}
                max={4.0}
              />
            </div>
            <div className="settings-item">
              <SmallCountControl
                label={"Interval Play Count"}
                inputId={'interval-play-count'}
                value={settings.examplePlayCount}
                onChange={(evt, newValue)=>{props.onChangeSettings({examplePlayCount: newValue})}}
                min={1}
                max={4}
              />
            </div>
            <div className="settings-item">
              <DurationControl
                label={"Pause Between Plays"}
                inputId="pause-between-plays"
                value={settings.pauseBetweenExamplePlays}
                onChange={(evt, newVal)=>{props.onChangeSettings({pauseBetweenExamplePlays: newVal})}}
                min={0.1}
                max={3.5}
                disabled={settings.examplePlayCount === 1}
              />
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-header">
              Scale Name Reading
            </div>
            <div className="settings-item">
              <BinaryControl
                label={"Read Interval Name"}
                inputId={"read-interval-name"}
                format={"switch"}
                value={settings.readIntervalName}
                onChange={(evt, newVal)=>{props.onChangeSettings({readIntervalName: newVal})}}
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
                disabled={!settings.readIntervalName}
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