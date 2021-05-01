import { EarExerciseBase, EarExercise } from './EarExerciseBase';
import NoteObject from "../data/NoteObject";
import { Pitch } from "../data/pitches";
import { MusicalScale } from "../data/scales";
import { randomPickOne } from "../util/chanceUtil";
import { getScaleNotes, playNoteSequence } from "../util/musicUtil";
import { startSpeech } from "../util/speechSynthesisUtil";

export type ScaleNameExerciseSettings = {
  // primary
  rootPitchSelections: Pitch[],
  scaleSelections: MusicalScale[],

  // secondary
  scalePlaySpeed: number,
  scalePlayCount: number,
  pauseBetweenScalePlays: number,
  readScaleName: boolean,
  pauseBeforeNameReading: number,
  pauseBeforeEnd: number,
  repeatCount: number,
  // scalePlayMode: 'ascending' | 'descending' , // later? (caveat: "melodic minor" scale changes asc v. desc)
  // randomizeNoteVelocities: boolean, // later?
}
export type ScaleNameExerciseState = {
  isPlaying : boolean,
  currentPitch: Pitch | null,
  currentScale: MusicalScale | null,
  currentScalePlayCount: number,
  currentExerciseRepeatCount: number
}

const defaultSettings : ScaleNameExerciseSettings = {
  rootPitchSelections: [],
  scaleSelections: [],
  scalePlaySpeed: 1,
  scalePlayCount: 1,
  pauseBetweenScalePlays: 1,
  readScaleName: true,
  pauseBeforeNameReading: 1,
  pauseBeforeEnd: 1,
  repeatCount: 0
}
const defaultState : ScaleNameExerciseState = {
  isPlaying: false,
  currentPitch: null,
  currentScale: null,
  currentScalePlayCount: 0,
  currentExerciseRepeatCount: 0
}

export class ScaleNameExercise 
    extends EarExerciseBase<ScaleNameExerciseSettings, ScaleNameExerciseState> 
    implements EarExercise<ScaleNameExerciseSettings, ScaleNameExerciseState> {
  constructor() {
    super(defaultSettings, defaultState);
  }
  start() {
    this.prep();
    if (this.state.currentPitch && this.state.currentScale) {
      this.playScale();
      if (this.onStart) {
        this.onStart(this.state);
      }
    } else {
      // poll again later
      this.doAfterPause(()=>{
        if (this.state.isPlaying) {
          this.start();
        }
      }, 0.25);
    }
  }
  prep() {
    const selectedPitches = this.settings.rootPitchSelections;
    const selectedScales = this.settings.scaleSelections;
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
        currentExerciseRepeatCount: 0
      });
    } else {
      this.setState({
        currentScale: null,
        currentPitch: null,
        currentScalePlayCount: 0,
        currentExerciseRepeatCount: 0
      });
    }
  }
  playScale() {
    let scale : MusicalScale | null = this.state.currentScale;
    let pitch : Pitch | null = this.state.currentPitch;

    if (scale && pitch) {
      let playDuration: number; // use seconds
      const rootNote = new NoteObject({pitch: pitch as Pitch, octave: 3});
      const noteInterval = 0.35 / this.settings.scalePlaySpeed;
      const noteLength = noteInterval * 0.8;
      const noteVelocity = 0.75;
      
      playDuration = noteInterval * (scale.intervals.length + 1);

      this.setState({
        currentScalePlayCount: this.state.currentScalePlayCount + 1
      });
      playNoteSequence(getScaleNotes(rootNote, scale as MusicalScale), noteInterval, noteLength, noteVelocity);
      this.doAfterPause(()=>{this.onFinishScalePlay();}, playDuration);
    }
  }
  onFinishScalePlay() {
    if (this.state.currentScalePlayCount < this.settings.scalePlayCount) {
      this.doAfterPause(()=>{this.playScale();}, this.settings.pauseBetweenScalePlays);
    } else if (this.settings.readScaleName) {
      this.doAfterPause(()=>{this.readScale();} ,this.settings.pauseBeforeNameReading);
    } else{
      this.doAfterPause(()=>{this.onFinishEverything();}, this.settings.pauseBeforeEnd);
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
    if (this.state.currentExerciseRepeatCount < this.settings.repeatCount) {
      // repeat the whole performance
      this.setState({
        currentExerciseRepeatCount: this.state.currentExerciseRepeatCount + 1,
        currentScalePlayCount: 0
      });
      // start from beginning (maintaining the prep that was already done)
      this.doAfterPause(()=>{this.playScale();}, this.settings.pauseBeforeEnd);
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