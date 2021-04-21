import * as Tone from 'tone';
import NoteObject from './data/NoteObject';
import { ChordDefinition } from './data/chords';
import { MusicalScale } from './data/scales';
import { remapValue } from './randomUtil';

let enabledAudio = false;
let synth: Tone.PolySynth;

const VOLUME_MIN = -20;
const VOLUME_MAX = 20;


export function initSynth() {
  synth = new Tone.PolySynth().toDestination();
}

export function setMasterVolume(newVol: number) {
  Tone.getDestination().volume.value = remapValue(newVol, 0, 1, VOLUME_MIN, VOLUME_MAX);
}


export function enableAudio() {
  if (!enabledAudio) {
    Tone.start();
    enabledAudio = true;
  }
}


export function playNote(note: NoteObject) {
  enableAudio();
  synth.triggerAttackRelease(note.stringify(), "8n", Tone.now());
}

export function playNoteSequence(notes: NoteObject[], delay:number=0.5, noteLengths:number[]|number=0.5, velocities:number[]|number=0.8) {
  let totalNotes = notes.length;
  enableAudio();
  if (typeof noteLengths === 'number') {
    noteLengths = new Array(totalNotes).fill(noteLengths as number);
  } else if (noteLengths instanceof Array) {
    noteLengths = noteLengths as number[];
    if (noteLengths.length < totalNotes) {
      console.warn('Warning: there are more notes than noteLengths entered. Using a default value as fallback');
      while (noteLengths.length < totalNotes) {
        noteLengths.push(1);
      }
    }
  } else {
    throw new Error('noteLengths was provided as an unhandled type');
  }
  if (typeof velocities === 'number') {
    velocities = new Array(totalNotes).fill(velocities as number);
  } else if (velocities instanceof Array) {
    velocities = velocities as number[];
    if (velocities.length < totalNotes) {
      console.warn('Warning: there are more notes than velocities entered. Using a default value as fallback');
      while (velocities.length < totalNotes) {
        velocities.push(1);
      }
    }
  } else {
    throw new Error('velocities was provided as an unhandled type');
  }
  for (let i = 0; i < totalNotes; i++) {
    synth.triggerAttackRelease(notes[i].stringify(), noteLengths[i], Tone.now() + (delay * i), velocities[i]);
  }
}

export function getScaleNotes(rootNote: NoteObject, scale: MusicalScale) {
  let scaleNotes: NoteObject[] = [];
  let lastNote = rootNote.clone();
  let intervals = [0].concat(scale.intervals); // prepend 0 to include the root note in the intervals

  intervals.forEach((interval, index)=>{
    let nextNote = new NoteObject({value: lastNote.value + interval});
    scaleNotes.push(nextNote);
    lastNote = nextNote;
  });

  return scaleNotes;
}

export function getChordNotes(rootNote: NoteObject, chordType: ChordDefinition, inversion=0) {
  let chordNotes: NoteObject[] = [];
  let lastNote = rootNote.clone();
  let chordIntervals = [0].concat(chordType.intervals); // prepend 0 to include the root note in the intervals

  if (inversion >= chordIntervals.length) {
    console.warn(`chord inversion number (${inversion}) is > the number of tones (${chordIntervals.length})`)
  }
  if (inversion < 0) {
    console.warn(`chord inversion number (${inversion}) is < 0`)
  }
  inversion = inversion % chordIntervals.length;

  chordIntervals.forEach((interval, index)=>{
    let noteValue = lastNote.value + interval;
    let nextNote : NoteObject;
    if (index < inversion) {
      noteValue += 12; // bump "inverted" intervals up an octave, so they're higher
    }
    nextNote = new NoteObject({value: noteValue});
    chordNotes.push(nextNote);
    lastNote = nextNote;
  });

  // make sure notes are ordered low -> high, even after inversion (it's handy)
  chordNotes.sort((a,b) => {
    return a.value - b.value;
  });

  return chordNotes;
}
