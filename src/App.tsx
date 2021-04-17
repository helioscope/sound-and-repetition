import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import {Button, Container} from '@material-ui/core';
import { ThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import { cyan, teal } from '@material-ui/core/colors';
import { ToggleButton } from '@material-ui/lab';

import {initSynth, playNoteSequence, getScaleNotes} from './musicUtil';
import NoteObject from './data/NoteObject';
import {MusicalScale, scales} from './data/scales';
import {pitches} from './data/pitches';
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
  isPlaying: boolean
};

let playTimeout : number | undefined;

class App extends React.Component {
  state : AppState = {
    activeExercise: exercises[0],
    isPlaying: false
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
  startExercise() {
    let rootNote = new NoteObject({pitch: randomPickOne(pitches), octave: 3});
    let scale: MusicalScale | undefined = scales.find((s)=>{return s.id === 'ionian'});
    if (scale) {
      let noteInterval = 0.35;
      let playDuration = noteInterval * (scale.intervals.length + 1) + 1;
      playNoteSequence(getScaleNotes(rootNote, scale), noteInterval);
      playTimeout = window.setTimeout(()=>{this.onPlayTimeout();}, playDuration * 1000);
    } else {
      throw new Error("Unable to find 'ionian' scale");
    }
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
  render() {
    const activeExercise = this.state.activeExercise;
    const exerciseToggles = exercises.map((exerciseId:ExerciseId) => {
      // Note: ToggleButton doesn't support a "color" prop.
      return (
        <ToggleButton value="intervals"
            selected={activeExercise === exerciseId}
            onChange={() => {
              this.adoptExercise(exerciseId);
            }}>
          {exerciseId}
        </ToggleButton>
      )
    })
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Container>
            <div className="exercise-selector">
              {exerciseToggles}
            </div>
            <div className="main-controls">
              <ToggleButton
                  value="play"
                  selected={this.state.isPlaying}
                  onChange={()=>{this.togglePlay();}}>
                play
              </ToggleButton>
            </div>
          </Container>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
