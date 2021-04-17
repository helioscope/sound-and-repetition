import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import { Container, Slider, Typography } from '@material-ui/core';
import { ThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import { cyan, teal } from '@material-ui/core/colors';
import { ToggleButton } from '@material-ui/lab';

import { initSynth, playNoteSequence, getScaleNotes, setMasterVolume } from './musicUtil';
import NoteObject from './data/NoteObject';
import { MusicalScale, scales } from './data/scales';
import { Pitch, pitches } from './data/pitches';
import { randomPickOne } from './randomUtil';

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

type ExerciseId = 'intervals' | 'pitches' | 'chords' | 'scales';
const exercises : ExerciseId[] = [
  // 'intervals',
  // 'pitches',
  // 'chords',
  'scales'
];

type AppState = {
  activeExercise: ExerciseId,
  isPlaying: boolean,
  masterVolume: number,
  scaleSelections: Map<MusicalScale, boolean>,
  rootNoteChoice: Pitch | null
};

// Map doesn't have a filter() or map() method but it's easy to check if one is selected
// Array is an easy list of selected ones, but it's harder to check if one is selected

let playTimeout : number | undefined;

class App extends React.Component {
  state : AppState = {
    activeExercise: exercises[0],
    isPlaying: false,
    masterVolume: 0.5,
    rootNoteChoice: null,
    scaleSelections: new Map().set( (scales.find((s)=>{return s.id === 'ionian'}) || scales[0]) , true),
  }
  componentDidMount() {
    initSynth();
  }
  adoptExercise(id:ExerciseId) {
    this.setState({activeExercise : id});
  }
  togglePlay() {
    this.setState({ isPlaying : !this.state.isPlaying }, ()=>{
      if (this.state.isPlaying) {
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
    })
  }
  startExercise() {
    const pitch = this.state.rootNoteChoice ? this.state.rootNoteChoice : randomPickOne(pitches);
    const rootNote = new NoteObject({pitch: pitch, octave: 3});
    const selectedScales = this.getSelectedScalesArray(this.state.scaleSelections);
    let playDuration: number; // use seconds
    
    if (selectedScales.length > 0) {
      const scale = randomPickOne(selectedScales);
      let noteInterval = 0.35;
      playDuration = noteInterval * (scale.intervals.length + 1) + 1;
      playNoteSequence(getScaleNotes(rootNote, scale), noteInterval);
    } else {
      playDuration = 0.25; // we'll just retry after this duration, in case a scale has been selected.
    }

    playTimeout = window.setTimeout(()=>{this.onPlayTimeout();}, playDuration * 1000);
  }
  cancelExercise() {
    clearTimeout(playTimeout);
    playTimeout = undefined;
  }
  onPlayTimeout() {
    if (this.state.isPlaying) {
      this.startExercise();
    }
  }
  getSelectedScalesArray(scalesMap: Map<MusicalScale, boolean>) : MusicalScale[] {
    let selectedScales: MusicalScale[] = [];
    scalesMap.forEach((isSelected, scale)=>{
      if (isSelected) {
        selectedScales.push(scale);
      }
    });
    return selectedScales;
  }
  render() {
    const activeExercise = this.state.activeExercise;
    const exerciseToggles = exercises.map((exerciseId:ExerciseId) => {
      // Note: ToggleButton doesn't support a "color" prop.
      return (
        <ToggleButton 
            key={exerciseId}
            value={exerciseId}
            selected={activeExercise === exerciseId}
            onChange={() => {
              this.adoptExercise(exerciseId);
            }}>
          {exerciseId}
        </ToggleButton>
      )
    });
    const scaleSelections = this.state.scaleSelections;
    const scaleChoices = scales.map((scale) => {
      return (
        <ToggleButton
            key={scale.id}
            value={scale.id}
            selected={scaleSelections.get(scale)}
            onChange={() => {
              let newSelectionSet = new Map(scaleSelections);
              newSelectionSet.set(scale, !scaleSelections.get(scale));
              this.setState({
                scaleSelections: newSelectionSet
              });
            }}>
          {scale.name}
        </ToggleButton>
      );
    });
    const rootPitchChoice = this.state.rootNoteChoice;
    let rootPitchChoices = pitches.map((pitch)=>{
      return (
        <ToggleButton
            key={pitch.index}
            value={pitch.index}
            selected={rootPitchChoice === pitch}
            onChange={() => {
              this.setState({
                rootNoteChoice: pitch
              });
            }}>
          {pitch.names[0]}
        </ToggleButton>
      );
    })
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Container>
            <div className="exercise-selector">
              <Typography gutterBottom>
                Exercise type:
              </Typography>
              {exerciseToggles}
            </div>
            <Typography gutterBottom>
              Root pitch:
            </Typography>
            <div className="scale-choices">
              {rootPitchChoices}
            </div>
            <Typography gutterBottom>
              Scales to play:
            </Typography>
            <div className="scale-choices">
              {scaleChoices}
            </div>
            <div className="main-controls">
              <div>
                <Typography gutterBottom>
                  Volume
                </Typography>
                <Slider 
                    value={this.state.masterVolume}
                    onChange={(evt, newVal)=>{this.setVolume(newVal as number)}}
                    min={0}
                    max={1}
                    step={0.001}/>
              </div>
              <div>
                <ToggleButton
                    value="play"
                    selected={this.state.isPlaying}
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
