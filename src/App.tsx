import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import './App.css';
import { Container, Grid, Slider, Typography } from '@material-ui/core';
import { ThemeProvider, createMuiTheme, Theme } from '@material-ui/core/styles';
import { cyan, teal } from '@material-ui/core/colors';
import { ToggleButton } from '@material-ui/lab';

import { initSynth, playNoteSequence, getScaleNotes, setMasterVolume, cancelNotesPlayback } from './util/musicUtil';
import { startSpeech, cancelSpeech, setSpeechVolume } from './speechSynthesisUtil';
import NoteObject from './data/NoteObject';
import { MusicalScale, scales } from './data/scales';
import { Pitch, pitches } from './data/pitches';
import { randomPickOne } from './util/chanceUtil';
import AnyAllNoneToggleSet, {ToggleItemGroupType} from './components/AnyAllNoneToggleSet';
import DurationControl from './components/DurationControl';
import SmallCountControl from './components/SmallCountControl';
import MultiplierControl from './components/MultiplierControl';
import BinaryControl from './components/BinaryControl';

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
  currentScalePlayCount: number,
  currentExerciseRepeatCount: number,
  
  // scalePlayMode: 'ascending' | 'descending', // later?
  scalePlaySpeed: number,
  scalePlayCount: number,
  pauseBetweenScalePlays: number,
  // randomizeNoteVelocities: boolean, // later?
  readScaleName: boolean,
  pauseBeforeNameReading: number,
  repeats: number,
  pauseBeforeEnd: number,
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
    currentScalePlayCount: 0,
    currentExerciseRepeatCount: 0,

    scalePlaySpeed: 1,
    scalePlayCount: 1,
    pauseBetweenScalePlays: 1,
    readScaleName: true,
    pauseBeforeNameReading: 1,
    repeats: 0,
    pauseBeforeEnd: 1,
  }
  componentDidMount() {
    initSynth();
  }
  componentWillUnmount() {
    this.cancelExercise();
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
      setSpeechVolume(this.state.masterVolume);
    })
  }
  startExercise() {
    this.prepExercise(() => {
      if (this.state.currentPitch && this.state.currentScale) {
        this.playScale();
      } else {
        // try again in a bit
        this.doAfterPause(()=>{
          if (this.state.isPlaying) {
            this.startExercise();
          }
        }, 0.25);
      }
    });
  }
  prepExercise(completionCallback:()=>void) {
    const selectedPitches = this.getSelectionArray<Pitch>(this.state.rootPitchSelections);
    const selectedScales = this.getSelectionArray<MusicalScale>(this.state.scaleSelections);
    let scale : MusicalScale | undefined;
    let pitch : Pitch | undefined;
    
    if (selectedScales.length > 0) {
      scale = randomPickOne(selectedScales);
    }

    if (selectedPitches.length > 0) {
      pitch = randomPickOne(selectedPitches);
    }

    if (scale && pitch) {
      this.setState({
        currentScale: scale,
        currentPitch: pitch,
        currentScalePlayCount: 0,
        exerciseState: 'unstarted'
      }, completionCallback);
    } else {
      this.setState({
        currentScale: undefined,
        currentPitch: undefined,
        currentScalePlayCount: 0,
        exerciseState: 'unstarted'
      }, completionCallback);
    }
  }
  playScale() {
    let scale : MusicalScale | undefined = this.state.currentScale;
    let pitch : Pitch | undefined = this.state.currentPitch;

    if (scale && pitch) {
      let playDuration: number; // use seconds
      const rootNote = new NoteObject({pitch: pitch as Pitch, octave: 3});
      const noteInterval = 0.35 / this.state.scalePlaySpeed;
      const noteLength = noteInterval * 0.8;
      const noteVelocity = 0.75;
      
      playDuration = noteInterval * (scale.intervals.length + 1);

      this.setState({
        currentScalePlayCount: this.state.currentScalePlayCount + 1,
        exerciseState: 'started'
      }, ()=>{
        playNoteSequence(getScaleNotes(rootNote, scale as MusicalScale), noteInterval, noteLength, noteVelocity);
        this.doAfterPause(()=>{this.onFinishScalePlay();}, playDuration);
      });
    }
  }
  onFinishScalePlay() {
    if (this.state.currentScalePlayCount < this.state.scalePlayCount) {
      this.doAfterPause(()=>{this.playScale();}, this.state.pauseBetweenScalePlays);
    } else if (this.state.readScaleName) {
      this.doAfterPause(()=>{this.readScale();} ,this.state.pauseBeforeNameReading);
    } else{
      this.doAfterPause(()=>{this.onFinishExercise();}, this.state.pauseBeforeEnd);
    }
  }
  readScale() {
    const currentPitch = this.state.currentPitch;
    const currentScale = this.state.currentScale;

    if (currentPitch && currentScale) {
      let scaleName = currentPitch.names[0] + " ";
      if (currentScale.spokenName) {
        scaleName += currentScale.spokenName;
      } else {
        scaleName += currentScale.name;
      }
      startSpeech(scaleName, {
        volume: this.state.masterVolume,
        onComplete: ()=>{this.onFinishScaleRead();}
      });
    } else {
      throw new Error('currentPitch and currentScale must be assigned to read the scale');
    }
  }
  onFinishScaleRead() {
    if (this.state.isPlaying === false) {
      return;
    }
    if (this.state.currentExerciseRepeatCount < this.state.repeats) {
      // repeat the whole performance
      this.setState({
        currentExerciseRepeatCount: this.state.currentExerciseRepeatCount + 1,
        currentScalePlayCount: 0
      }, () => {
        // start from beginning (maintaining the prep that was already done)
        this.doAfterPause(()=>{this.playScale();}, this.state.pauseBeforeEnd);
      })
    } else {
      this.doAfterPause(()=>{this.onFinishExercise();}, this.state.pauseBeforeEnd);
    }
  }
  onFinishExercise() {
    this.startExercise();
  }
  cancelExercise() {
    clearTimeout(playTimeout);
    playTimeout = undefined;
    cancelNotesPlayback();
    cancelSpeech();
  }
  doAfterPause(action:()=>void, delayInSeconds: number) {
    playTimeout = window.setTimeout(action, delayInSeconds * 1000);
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

        <Grid container spacing={4}>
          <Grid item xs={6} sm={4}>
            <MultiplierControl
              label={"Scale Play Speed"}
              inputId="scale-play-speed"
              value={this.state.scalePlaySpeed}
              onChange={(evt, newVal)=>{this.setState({scalePlaySpeed: newVal})}}
              min={0.1}
              max={4.0}
              step={0.1}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <SmallCountControl
              label={"Scale Play Count"}
              inputId={'scale-play-count'}
              value={this.state.scalePlayCount}
              onChange={(evt, newValue)=>{this.setState({scalePlayCount: newValue})}}
              min={1}
              max={4}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <DurationControl
              label={"Pause Between Plays"}
              inputId="pause-between-plays"
              value={this.state.pauseBetweenScalePlays}
              onChange={(evt, newVal)=>{this.setState({pauseBetweenScalePlays: newVal})}}
              min={0.1}
              max={3.5}
              step={0.1}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <BinaryControl
              label={"Read Scale Name"}
              inputId={"read-scale-name"}
              format={"switch"}
              value={this.state.readScaleName}
              onChange={(evt, newVal)=>{this.setState({readScaleName: newVal})}}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <DurationControl
              label={"Pause Before Reading"}
              inputId={"pause-before-reading"}
              value={this.state.pauseBeforeNameReading}
              onChange={(evt, newVal)=>{this.setState({pauseBeforeNameReading: newVal})}}
              min={0.1}
              max={3.5}
              step={0.1}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <SmallCountControl
              label={"Repeats"}
              inputId={'repeat-count'}
              value={this.state.repeats}
              onChange={(evt, newValue)=>{this.setState({repeats: newValue})}}
              min={0}
              max={4}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <DurationControl
              label={"Pause Before End"}
              inputId="pause-before-end"
              value={this.state.pauseBeforeEnd}
              onChange={(evt, newVal)=>{this.setState({pauseBeforeEnd: newVal})}}
              min={0.1}
              max={4.0}
              step={0.1}
            />
          </Grid>
        </Grid>
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
