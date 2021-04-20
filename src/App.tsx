import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import { Button, Container, Grid, Slider, Typography } from '@material-ui/core';
import { ThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import { cyan, teal } from '@material-ui/core/colors';
import { ToggleButton } from '@material-ui/lab';

import { initSynth, playNoteSequence, getScaleNotes, setMasterVolume } from './musicUtil';
import NoteObject from './data/NoteObject';
import { MusicalScale, scales } from './data/scales';
import { Pitch, pitches } from './data/pitches';
import { randomPickOne } from './randomUtil';
import AnyAllNoneToggleSet, {ToggleItemGroupType, ToggleItemType} from './AnyAllNoneToggleSet';

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


const rootPitchCollection = pitches.map((pitch)=>{
  return {
    label: pitch.names[0],
    value: pitch
  }
});

const scalesCollection = ( () : ToggleItemGroupType[] => {
  let scaleToggleItems = scales.map((scale) => {
    return {
      label: scale.name,
      key: scale.id,
      value: scale
    };
  });
  
  return [
    {
      label: '7-tone',
      items: scaleToggleItems.filter((item) => {return item.value.intervals.length === 7;})
    },
    {
      label: '5-tone',
      items: scaleToggleItems.filter((item) => {return item.value.intervals.length === 5;})
    },
    {
      label: 'other',
      items: scaleToggleItems.filter((item) => {
        let toneCount = item.value.intervals.length;
        return  toneCount !== 7 && toneCount !== 5;
      })
    },
  ];
})();

type AppState = {
  activeExercise: ExerciseId,
  isPlaying: boolean,
  masterVolume: number,
  scaleSelections: Map<MusicalScale, boolean>,
  rootPitchSelections: Map<Pitch, boolean>,
  exerciseState: 'not-started' | 'started' | 'completed',
  currentScale: MusicalScale | undefined,
  currentPitch: Pitch | undefined,
  // scalePlaySpeed: number
};

// Map doesn't have a filter() or map() method but it's easy to check if one is selected
// Array is an easy list of selected ones, but it's harder to check if one is selected

let playTimeout : number | undefined;

class App extends React.Component {
  state : AppState = {
    activeExercise: exercises[0],
    isPlaying: false,
    masterVolume: 0.5,
    exerciseState: 'not-started',

    rootPitchSelections: new Map().set( (pitches.find((p)=>{return p.names[0] === 'C'}) || pitches[0]) , true),
    scaleSelections: new Map().set( (scales.find((s)=>{return s.id === 'ionian'}) || scales[0]) , true),
    currentScale: undefined,
    currentPitch: undefined,
    // scalePlaySpeed: 1
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
    const selectedPitches = this.getSelectionArray<Pitch>(this.state.rootPitchSelections);
    const selectedScales = this.getSelectionArray<MusicalScale>(this.state.scaleSelections);
    let scale : MusicalScale | undefined;
    let pitch : Pitch | undefined;
    let playDuration: number; // use seconds
    let exerciseState = 'not started';
    
    if (selectedScales.length > 0) {
      scale = randomPickOne(selectedScales);
    }

    if (selectedPitches.length > 0) {
      pitch = randomPickOne(selectedPitches);
    }

    if (scale && pitch) {
      const rootNote = new NoteObject({pitch: pitch, octave: 3});
      const noteInterval = 0.35;
      const delayBeforeScaleReadOut = 1;
      
      playNoteSequence(getScaleNotes(rootNote, scale), noteInterval);
      playDuration = noteInterval * (scale.intervals.length + 1) + delayBeforeScaleReadOut;
      exerciseState = 'started';
    } else {
      // we'll just retry after this duration, in case a scale + pitch has been selected.
      playDuration = 0.25;
      exerciseState = 'not started'
    }

    playTimeout = window.setTimeout(()=>{this.onPlayTimeout();}, playDuration * 1000);
    this.setState({
      currentScale: scale,
      currentPitch: pitch,
      exerciseState: exerciseState
    });
  }
  continueExercise() {
    let currentPitch = this.state.currentPitch;
    let currentScale = this.state.currentScale;
    if (currentPitch && currentScale) {
      let utterance = new SpeechSynthesisUtterance(currentPitch.names[0] + " " + currentScale.name);
      let utteranceWait = 2.5;

      utterance.volume = this.state.masterVolume;
      window.speechSynthesis.speak(utterance);

      this.setState({
        exerciseState: 'completed'
      }, () => {
        playTimeout = window.setTimeout(()=>{this.onPlayTimeout();}, utteranceWait * 1000);
      });
    } else {
      throw new Error('currentPitch and currentScale must be assigned to continue the exercise');
    }
  }
  cancelExercise() {
    clearTimeout(playTimeout);
    playTimeout = undefined;
  }
  onPlayTimeout() {
    if (this.state.isPlaying) {
      const exerciseState = this.state.exerciseState;
      if (exerciseState === 'not-started') {
        this.startExercise();
      } else if (exerciseState === 'started') {
        this.continueExercise();
      } else if (exerciseState === 'completed') {
        this.startExercise();
      } else {
        throw new Error(`unhandled exercise state: ${exerciseState}`);
      }
    }
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
    const scaleSelections = this.state.scaleSelections;
    const scaleChoices = (
      <AnyAllNoneToggleSet
          label={"Scales:"}
          itemCollection={scalesCollection}
          itemToggleStates={scaleSelections}
          onChange={(event, newSelections) => {
            this.setState({
              scaleSelections: newSelections
            })
          }}/>
    );
    const rootPitchSelections = this.state.rootPitchSelections;
    const rootPitchChoices = (
      <AnyAllNoneToggleSet
          label={"Root pitches:"}
          itemCollection={rootPitchCollection}
          itemToggleStates={rootPitchSelections}
          onChange={(event, newSelections) => {
            this.setState({
              rootPitchSelections: newSelections
            })
          }}/>
    );

    return (
      <div className="exercise-config">
        {rootPitchChoices}
        {scaleChoices}
      </div>

    );
  }
  render() {
    const activeExercise = this.state.activeExercise;
    const exerciseToggles = exercises.map((exerciseId:ExerciseId) => {
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
              <Grid container spacing={6}>
                <Grid item xs={6} sm={3}>
                  <Typography gutterBottom>
                    Volume
                  </Typography>
                  <Slider 
                      value={this.state.masterVolume}
                      onChange={(evt, newVal)=>{this.setVolume(newVal as number)}}
                      min={0}
                      max={1}
                      step={0.001}/>
                </Grid>
                <Grid item>
                  <ToggleButton
                      value="play"
                      selected={this.state.isPlaying}
                      onChange={()=>{this.togglePlay();}}>
                    play
                  </ToggleButton>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
