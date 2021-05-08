import React from 'react';

import { Button, Collapse } from '@material-ui/core';
import AnyAllNoneToggleSet from './AnyAllNoneToggleSet';
import BinaryControl from './BinaryControl';
import DurationControl from './DurationControl';
import MultiplierControl from './MultiplierControl';
import SmallCountControl from './SmallCountControl';

import { ChordExerciseSettings } from '../exercises/ChordExercise';
import { rootPitchCollection, chordsCollection } from '../uiConstants';


type ChordExerciseControlsProps = {
  advancedConfigIsOpen: boolean,
  settings: ChordExerciseSettings,
  onToggleAdvancedSettings: (nowOpen: boolean)=>void,
  onChangeSettings: (changes: Partial<ChordExerciseSettings>)=>void
}

export default function ScaleNameExerciseControls (props:ChordExerciseControlsProps) {
  const settings = props.settings;
  const chordSelections = settings.chordSelections;
  const chordChoices = (
    <AnyAllNoneToggleSet
        label={"Chords:"}
        itemCollection={chordsCollection}
        selectedValues={chordSelections}
        onChange={(event, newSelections) => {
          props.onChangeSettings({chordSelections: newSelections});
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
      {chordChoices}

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
              Chord Playback
            </div>
            <div className="settings-item">
              <MultiplierControl
                label={"Chord Play Speed"}
                inputId="chord-play-speed"
                value={settings.examplePlaySpeed}
                onChange={(evt, newVal)=>{props.onChangeSettings({examplePlaySpeed: newVal})}}
                min={0.1}
                max={4.0}
              />
            </div>
            <div className="settings-item">
              <SmallCountControl
                label={"Chord Play Count"}
                inputId={'chord-play-count'}
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
            <div className="settings-item">
              <BinaryControl
                label={"Arpeggiate (play notes in sequence)"}
                inputId={"arpeggiate"}
                format={"switch"}
                value={settings.playInSequence}
                onChange={(evt, newVal)=>{props.onChangeSettings({playInSequence: newVal})}}
              />
            </div>
          </div>

          <div className="settings-group">
            <div className="settings-group-header">
              Chord Name Reading
            </div>
            <div className="settings-item">
              <BinaryControl
                label={"Read Chord Name"}
                inputId={"read-chord-name"}
                format={"switch"}
                value={settings.readChordName}
                onChange={(evt, newVal)=>{props.onChangeSettings({readChordName: newVal})}}
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
                disabled={!settings.readChordName}
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