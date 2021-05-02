import { EarExerciseBase, EarExercise } from './EarExerciseBase';
import NoteObject from "../data/NoteObject";
import { Pitch, pitches } from "../data/pitches";
import { ToneInterval, toneIntervals } from '../data/toneIntervals';
import { randomPickOne } from "../util/chanceUtil";
import { playNoteSequence } from "../util/musicUtil";
import { startSpeech } from "../util/speechSynthesisUtil";

export type ToneIntervalExerciseSettings = {
  // primary
  rootPitchSelections: Pitch[],
  intervalSelections: ToneInterval[],

  // secondary
  examplePlaySpeed: number,
  examplePlayCount: number,
  pauseBetweenExamplePlays: number,
  readIntervalName: boolean,
  pauseBeforeNameReading: number,
  pauseBeforeEnd: number,
  repeatCount: number,
  // intervalPlayMode: 'ascending' | 'descending' | 'random', // later?
  // intervalOctaveRange: number, // later? (+/- interval note this number * semitones-per-octave)
  // randomizeNoteVelocities: boolean, // later?
}
export type ToneIntervalExerciseState = {
  isPlaying : boolean,
  currentPitch: Pitch | null,
  currentInterval: ToneInterval | null,
  currentExamplePlayCount: number,
  currentExerciseRepeatCount: number
}

export const toneIntervalExerciseDefaultSettings : ToneIntervalExerciseSettings = {
  rootPitchSelections: [pitches[0]],
  intervalSelections: [toneIntervals.find((interval)=>{return interval.value === 7;}) || toneIntervals[7]],
  examplePlaySpeed: 1,
  examplePlayCount: 3,
  pauseBetweenExamplePlays: 1.5,
  readIntervalName: true,
  pauseBeforeNameReading: 2,
  pauseBeforeEnd: 1,
  repeatCount: 0
}
export const toneIntervalExerciseDefaultState : ToneIntervalExerciseState = {
  isPlaying: false,
  currentPitch: null,
  currentInterval: null,
  currentExamplePlayCount: 0,
  currentExerciseRepeatCount: 0
}

export class ToneIntervalExercise 
    extends EarExerciseBase<ToneIntervalExerciseSettings, ToneIntervalExerciseState> 
    implements EarExercise<ToneIntervalExerciseSettings, ToneIntervalExerciseState> {
  constructor() {
    super(toneIntervalExerciseDefaultSettings, toneIntervalExerciseDefaultState);
  }
  start() {
    this.prep();
    if (this.state.currentPitch && this.state.currentInterval) {
      this.playExample();
      if (this.onStart) {
        this.onStart(this.state);
      }
    } else {
      // poll again later
      this.doAfterPause(()=>{
        this.start();
      }, 0.25);
    }
  }
  prep() {
    const selectedPitches = this.settings.rootPitchSelections;
    const selectedIntervals = this.settings.intervalSelections;
    let interval : ToneInterval | undefined;
    let pitch : Pitch | undefined;
    
    if (selectedIntervals.length > 0) {
      interval = randomPickOne(selectedIntervals);
    }

    if (selectedPitches.length > 0) {
      pitch = randomPickOne(selectedPitches);
    }

    if (interval && pitch) {
      this.setState({
        currentInterval: interval,
        currentPitch: pitch,
        currentExamplePlayCount: 0,
        currentExerciseRepeatCount: 0
      });
    } else {
      this.setState({
        currentInterval: null,
        currentPitch: null,
        currentExamplePlayCount: 0,
        currentExerciseRepeatCount: 0
      });
    }
  }
  playExample() {
    let interval : ToneInterval | null = this.state.currentInterval;
    let pitch : Pitch | null = this.state.currentPitch;

    if (interval && pitch) {
      let playDuration: number; // use seconds
      const rootNote = new NoteObject({pitch: pitch as Pitch, octave: 3});
      const noteInterval = 0.35 / this.settings.examplePlaySpeed;
      const noteLength = noteInterval * 0.8;
      const noteVelocity = 0.75;
      const notes : NoteObject[] = [rootNote];

      notes.push(new NoteObject({value: rootNote.value + interval.value}));
      
      playDuration = noteInterval * notes.length;

      this.setState({
        currentExamplePlayCount: this.state.currentExamplePlayCount + 1
      });
      playNoteSequence(notes, noteInterval, noteLength, noteVelocity);
      this.doAfterPause(()=>{this.onFinishScalePlay();}, playDuration);
    }
  }
  onFinishScalePlay() {
    if (this.state.currentExamplePlayCount < this.settings.examplePlayCount) {
      this.doAfterPause(()=>{this.playExample();}, this.settings.pauseBetweenExamplePlays);
    } else if (this.settings.readIntervalName) {
      this.doAfterPause(()=>{this.readScale();} ,this.settings.pauseBeforeNameReading);
    } else{
      this.doAfterPause(()=>{this.onFinishEverything();}, this.settings.pauseBeforeEnd);
    }
  }
  readScale() {
    const currentPitch = this.state.currentPitch;
    const currentInterval = this.state.currentInterval;

    if (currentPitch && currentInterval) {
      let intervalName = currentInterval.label;
      startSpeech(intervalName, {
        onComplete: ()=>{this.onFinishNameRead();}
      });
    } else {
      throw new Error('currentPitch and currentScale must be assigned to read the scale');
    }
  }
  onFinishNameRead() {
    if (this.state.currentExerciseRepeatCount < this.settings.repeatCount) {
      // repeat the whole performance
      this.setState({
        currentExerciseRepeatCount: this.state.currentExerciseRepeatCount + 1,
        currentExamplePlayCount: 0
      });
      // start from beginning (maintaining the prep that was already done)
      this.doAfterPause(()=>{this.playExample();}, this.settings.pauseBeforeEnd);
    } else {
      this.doAfterPause(()=>{this.onFinishEverything();}, this.settings.pauseBeforeEnd);
    }
  }
  onFinishEverything() {
    if (this.onFinish) {
      this.onFinish(this.state);
    }
  }
}