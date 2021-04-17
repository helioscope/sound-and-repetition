import {Pitch, PitchName, pitches} from './pitches';

const TONE_COUNT = 12;

export default class NoteObject {
  value: number
  constructor(data: {value?: number, pitch?: Pitch, octave?: number, toneIndex?: number, pitchName?: PitchName}) {
    if (data.value) {
      this.value = data.value;
    }
    else if (data.pitch && data.octave) {
      this.value = data.octave * TONE_COUNT + data.pitch.index;
    }
    else if (data.toneIndex !== undefined && data.octave !== undefined) {
      console.log('setting from octave + tone index');
      this.value = data.octave * TONE_COUNT + data.toneIndex;
    }
    else if (data.pitchName && data.octave) {
      const foundPitch = pitches.find((pitchData)=>{
        return pitchData.names.find((pitchName) => {
          return pitchName === data.pitchName;
        });
      });
      if (foundPitch) {
        this.value = data.octave * TONE_COUNT + foundPitch.index;
      } else {
        throw new Error("unsupported pitch name: " + data.pitchName);
      }
    }
    else {
      console.error('created NoteObject without any data', data);
      this.value = 0;
    }
  }
  
  getToneIndex() : number {
    return this.value % pitches.length;
  }

  getOctave() : number {
    return Math.floor(this.value / TONE_COUNT);
  }

  getPitchData() : Pitch {
    return pitches[this.value % TONE_COUNT];
  }

  getDefaultName() : string {
    return this.getPitchData().names[0];
  }

  stringify() : string {
    return this.getDefaultName() + this.getOctave();
  }

  clone() : NoteObject {
    return new NoteObject({
      value : this.value
    });
  }
}