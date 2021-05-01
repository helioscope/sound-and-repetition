import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import { Container, Slider, Typography } from '@material-ui/core';
import { ThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import { cyan, teal } from '@material-ui/core/colors';
import { ToggleButton } from '@material-ui/lab';

import { initSynth, setMasterVolume } from './util/musicUtil';
import { setSpeechVolume } from './util/speechSynthesisUtil';
import { MusicalScale, scales } from './data/scales';
import { Pitch, pitches } from './data/pitches';
import { scaleNameExerciseDefaultSettings, ScaleNameExerciseSettings } from './exercises/ScaleNameExercise';
import { GenericEarExercise } from './exercises/EarExerciseBase';
import ScaleNameExerciseControls from './components/ScaleNameExerciseControls';
import { exerciseList } from './uiConstants';
import { ToggleItemType } from './components/AnyAllNoneToggleSet';

const theme : Theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: cyan,
    secondary: teal,
    background: {
      default: '#202032'
    }
  },
});

type AppState = {
  activeExercise: GenericEarExercise, // since this is mutable (and self-mutates), should this be in state?
  playEnabled: boolean,
  masterVolume: number,

  scaleSelections: Map<MusicalScale, boolean>,
  rootPitchSelections: Map<Pitch, boolean>,
  openAdvancedSettings: boolean,
  scaleExerciseSettings: ScaleNameExerciseSettings
};

class App extends React.Component {
  state : AppState = {
    activeExercise: exerciseList[0].value,
    playEnabled: false,
    masterVolume: 0.5,

    rootPitchSelections: new Map().set( (pitches.find((p)=>{return p.names[0] === 'C'}) || pitches[0]) , true),
    scaleSelections: new Map().set( (scales.find((s)=>{return s.id === 'ionian'}) || scales[0]) , true),
    openAdvancedSettings: false,
    scaleExerciseSettings: scaleNameExerciseDefaultSettings,
  }
  componentDidMount() {
    initSynth();
    exerciseList.forEach((item) => {
      const exercise : GenericEarExercise = item.value as GenericEarExercise;
      exercise.onFinish = (exerciseState)=>{this.onFinishExercise();};
    })
  }
  componentWillUnmount() {
    this.cancelExercise();
  }
  adoptExercise(exercise: GenericEarExercise) {
    if (exercise === this.state.activeExercise) {
      return;
    }
    this.state.activeExercise.cancel();
    this.setState({
      activeExercise : exercise,
      playEnabled: false
    });
  }
  startExercise() {
    this.state.activeExercise.start();
  }
  onFinishExercise() {
    if (this.state.playEnabled) {
      this.startExercise();
    }
  }
  cancelExercise() {
    this.state.activeExercise.cancel();
  }
  togglePlay() {
    this.setState({ playEnabled : !this.state.playEnabled }, ()=>{
      if (this.state.playEnabled) {
        this.startExercise();
      } else {
        this.cancelExercise();
      }
    });
  }
  setVolume(newVolume : number) {
    this.setState({
      masterVolume : newVolume
    }, ()=>{
      setMasterVolume(this.state.masterVolume);
      setSpeechVolume(this.state.masterVolume);
    })
  }
  getSelectionArray<ValueType>(scalesMap: Map<ValueType, boolean>) : ValueType[] {
    let selectedScales: ValueType[] = [];
    scalesMap.forEach((isSelected, scale)=>{
      if (isSelected) {
        selectedScales.push(scale);
      }
    });
    return selectedScales;
  }
  renderScaleExerciseConfig() {
    return (
      <ScaleNameExerciseControls
        settings={this.state.scaleExerciseSettings}
        scaleSelections={this.state.scaleSelections} // todo: cleanup toggles to simply work off selection list
        rootPitchSelections={this.state.rootPitchSelections} // todo: cleanup toggles to simply work off selection list
        advancedConfigIsOpen={this.state.openAdvancedSettings}
        onToggleAdvancedSettings={(nowOpen: boolean)=>{
          this.setState({
            openAdvancedSettings: nowOpen
          });
        }}
        onChangePitchSelections={(newSelections)=>{ // todo: cleanup toggles to simply work off selection list
          this.setState({
            rootPitchSelections: newSelections,
            scaleExerciseSettings: this.state.activeExercise.updateSettings({rootPitchSelections: this.getSelectionArray(newSelections)})
          });
        }}
        onChangeScaleSelections={(newSelections)=>{ // todo: cleanup toggles to simply work off selection list
          this.setState({
            scaleSelections: newSelections,
            scaleExerciseSettings: this.state.activeExercise.updateSettings({scaleSelections: this.getSelectionArray(newSelections)})
          });
        }}
        onChangeSettings={(updatedSettings) => {
          this.setState({
            scaleExerciseSettings: this.state.activeExercise.updateSettings(updatedSettings)
          });
        }}
      />
    )
  }
  render() {
    const activeExercise = this.state.activeExercise;
    const exerciseToggles = exerciseList.map((entry: ToggleItemType) => {
      return (
        <ToggleButton 
            key={entry.label}
            value={entry.label}
            selected={activeExercise === entry.value}
            onChange={() => {
              this.adoptExercise(entry.value);
            }}>
          {entry.label}
        </ToggleButton>
      )
    });
    
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Container>
            <div className="exercise-selector">
              <Typography gutterBottom>
                Exercise:
              </Typography>
              {exerciseToggles}
            </div>
            {this.renderScaleExerciseConfig()}
            <div className="main-controls">
              <div className="volume-cell">
                <Typography gutterBottom>
                  Volume
                </Typography>
                <Slider 
                  value={this.state.masterVolume}
                  onChange={(evt, newVal)=>{this.setVolume(newVal as number)}}
                  min={0}
                  max={1}
                  step={0.001}
                />
              </div>
              <div className="play-pause-cell">
                <ToggleButton
                    value="play"
                    selected={this.state.playEnabled}
                    onChange={()=>{this.togglePlay();}}>
                  play
                </ToggleButton>
              </div>
            </div>
          </Container>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
