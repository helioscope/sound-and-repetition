import { EarExerciseBase, EarExercise } from './EarExerciseBase';
import NoteObject from "../data/NoteObject";
import { Pitch, pitches } from "../data/pitches";
import { ChordDefinition, chords } from '../data/chords';
import { randomPickOne } from "../util/chanceUtil";
import { getChordNotes, playNoteSequence, playNotesTogether } from "../util/musicUtil";
import { startSpeech } from "../util/speechSynthesisUtil";

export type ChordExerciseSettings = {
  // primary
  rootPitchSelections: Pitch[],
  chordSelections: ChordDefinition[],

  // secondary
  examplePlaySpeed: number,
  examplePlayCount: number,
  playInSequence: boolean,
  pauseBetweenExamplePlays: number,
  readChordName: boolean,
  pauseBeforeNameReading: number,
  pauseBeforeEnd: number,
  repeatCount: number,
  // intervalPlayMode: 'ascending' | 'descending' | 'random', // later?
  // intervalOctaveRange: number, // later? (+/- interval note this number * semitones-per-octave)
  // randomizeNoteVelocities: boolean, // later?
}
export type ChordExerciseState = {
  isPlaying : boolean,
  currentPitch: Pitch | null,
  currentChord: ChordDefinition | null,
  currentExamplePlayCount: number,
  currentExerciseRepeatCount: number
}

export const chordExerciseDefaultSettings : ChordExerciseSettings = {
  rootPitchSelections: [pitches[0]],
  chordSelections: [chords.find((chord)=>{return chord.id === 'major';}) || chords[0]],
  examplePlaySpeed: 1,
  playInSequence: true,
  examplePlayCount: 1,
  pauseBetweenExamplePlays: 1.5,
  readChordName: true,
  pauseBeforeNameReading: 2,
  pauseBeforeEnd: 1,
  repeatCount: 0
}
export const chordExerciseDefaultState : ChordExerciseState = {
  isPlaying: false,
  currentPitch: null,
  currentChord: null,
  currentExamplePlayCount: 0,
  currentExerciseRepeatCount: 0
}

export class ChordExercise 
    extends EarExerciseBase<ChordExerciseSettings, ChordExerciseState> 
    implements EarExercise<ChordExerciseSettings, ChordExerciseState> {
  constructor() {
    super(chordExerciseDefaultSettings, chordExerciseDefaultState);
  }
  start() {
    this.prep();
    if (this.state.currentPitch && this.state.currentChord) {
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
    const selectedChords = this.settings.chordSelections;
    let chord : ChordDefinition | undefined;
    let pitch : Pitch | undefined;
    
    if (selectedChords.length > 0) {
      chord = randomPickOne(selectedChords);
    }

    if (selectedPitches.length > 0) {
      pitch = randomPickOne(selectedPitches);
    }

    if (chord && pitch) {
      this.setState({
        currentChord: chord,
        currentPitch: pitch,
        currentExamplePlayCount: 0,
        currentExerciseRepeatCount: 0
      });
    } else {
      this.setState({
        currentChord: null,
        currentPitch: null,
        currentExamplePlayCount: 0,
        currentExerciseRepeatCount: 0
      });
    }
  }
  playExample() {
    let chord : ChordDefinition | null = this.state.currentChord;
    let pitch : Pitch | null = this.state.currentPitch;

    if (chord && pitch) {
      let playDuration: number; // use seconds
      const rootNote = new NoteObject({pitch: pitch as Pitch, octave: 3});
      const noteInterval = 0.35 / this.settings.examplePlaySpeed;
      const noteLength = noteInterval * 0.8;
      const noteVelocity = 0.75;
      const notes : NoteObject[] = getChordNotes(rootNote, chord);
      
      playDuration = noteInterval * notes.length;

      this.setState({
        currentExamplePlayCount: this.state.currentExamplePlayCount + 1
      });
      if (this.settings.playInSequence) {
        playNoteSequence(notes, noteInterval, noteLength, noteVelocity);
      } else {
        playNotesTogether(notes, noteLength, noteVelocity);
      }
      this.doAfterPause(()=>{this.onFinishScalePlay();}, playDuration);
    }
  }
  onFinishScalePlay() {
    if (this.state.currentExamplePlayCount < this.settings.examplePlayCount) {
      this.doAfterPause(()=>{this.playExample();}, this.settings.pauseBetweenExamplePlays);
    } else if (this.settings.readChordName) {
      this.doAfterPause(()=>{this.readScale();} ,this.settings.pauseBeforeNameReading);
    } else{
      this.doAfterPause(()=>{this.onFinishEverything();}, this.settings.pauseBeforeEnd);
    }
  }
  readScale() {
    const currentPitch = this.state.currentPitch;
    const currentChord = this.state.currentChord;

    if (currentPitch && currentChord) {
      let spokenName = currentChord.label;
      startSpeech(spokenName, {
        onComplete: ()=>{this.onFinishNameRead();}
      });
    } else {
      throw new Error('currentPitch and currentChord must be assigned to read them out');
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