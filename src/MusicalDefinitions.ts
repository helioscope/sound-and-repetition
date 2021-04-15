// todo: define interfaces & types, etc
// also: clean up scales -- no need for tone-count divisions

export const pitchClasses = [
  {
    index : 0,
    names : ["C","B#"] // "B#" seems extremely unusual
  },
  {
    index : 1,
    names : ["C#","Db"]
  },
  {
    index : 2,
    names : ["D"]
  },
  {
    index : 3,
    names : ["D#","Eb"]
  },
  {
    index : 4,
    names : ["E","Fb"] // "Fb" seems extremely unusual
  },
  {
    index : 5,
    names : ["F","E#"] // "E#" seems extremely unusual
  },
  {
    index : 6,
    names : ["F#","Gb"]
  },
  {
    index : 7,
    names : ["G"]
  },
  {
    index : 8,
    names : ["G#","Ab"]
  },
  {
    index : 9,
    names : ["A"]
  },
  {
    index : 10,
    names : ["A#","Bb"]
  },
  {
    index : 11,
    names : ["B","Cb"] // "Cb" seems extremely unusual
  },
];

export const scales = {
  chromatic : {
    chromatic : {
      intervals: [1,1,1,1,1,1,1,1,1,1,1,1,1],
      notes: "all half-tones, aka the 'twelve tone' scale",
    }
  },
  heptatonic : { // heptatonic just means there's 7 tones
    aeoliean : {
      mode : 1,
      intervals : [2,1,2,2,1,2,2],
      notes: "(aka the 'natural minor' scale)"
    },
    harmonic_minor : {
      // mode : 1, // derived from natural minor
      intervals : [2,1,2,2,1,3,1],
      notes: "(aka the 'aeolian #7' scale)"
    },
    // melodic_minor : {
    //   // mode : 1, // also derived from natural minor
    //   intervals : [2,1,2,2,2,2,1],
    //   notes: "the spacing of the notes changes whether ascending or descending? so maybe this should be listed as two scales? or maybe I shouldn't use 'scale' as the term here?"
    // },
    locrian : {
      mode : 2,
      intervals : [1,2,2,1,2,2,2],
      notes: ""
    },
    ionian : {
      mode : 3,
      intervals : [2,2,1,2,2,2,1],
      notes: "(aka the 'major' scale)"
    },
    dorian : {
      mode : 4,
      intervals : [2,1,2,2,2,1,2],
      notes: ""
    },
    phrygian : {
      mode : 5,
      intervals : [1,2,2,2,1,2,2],
      notes: ""
    },
    lydian : {
      mode : 6,
      intervals : [2,2,2,1,2,2,1],
      notes: ""
    },
    mixolydian : {
      mode : 7,
      intervals : [2,2,1,2,2,1,2],
      notes: ""
    }

    // note: these are just the 'Heptatonia prima'; there are more: https://en.wikipedia.org/wiki/Heptatonic_scale
  },
  pentatonic : { // pentatonic just means there's five tones
    minor : {
      mode : 1,
      intervals : [3,2,2,3,2]
    },
    major : {
      mode : 2,
      intervals : [2,2,3,2,3]
    },
    egyptian_sus : {
      mode : 3,
      intervals : [2,3,2,3,2]
    },
    blues_minor : {
      mode : 4,
      intervals : [3,2,3,2,2]
    },
    blues_major : {
      mode : 5,
      intervals : [2,3,2,2,3]
    }
    // note: there are more: https://en.wikipedia.org/wiki/Scale_(music)
  }
};
export const chords = {
  // more info: https://en.wikipedia.org/wiki/Chord_(music)#Characteristics
  
  // triads
  
  major : {
    key : 'major',
    label : 'major',
    intervals : [4,3]
  },
  minor : {
    key : 'minor',
    label : 'minor',
    intervals : [3,4]
  },
  augmented : {
    key : 'augmented',
    label : 'augmented',
    intervals : [4,4]
  },
  diminished : {
    key : 'diminished',
    label : 'diminished',
    intervals : [3,3]
  },


  // tetrads
  
  major_sixth : {
    key : 'major_sixth',
    label : 'major sixth',
    intervals : [4,3,2]
  },
  dominant_seventh : {
    key : 'dominant_seventh',
    label : 'dominant seventh',
    intervals : [4,3,3]
  },
  major_seventh : {
    key : 'major_seventh',
    label : 'major seventh',
    intervals : [4,3,4]
  },
  augmented_seventh : {
    key : 'augmented_seventh',
    label : 'augmented seventh',
    intervals : [4,4,2]
  },
  minor_sixth : {
    key : 'minor_sixth',
    label : 'minor sixth',
    intervals : [3,4,2]
  },
  minor_seventh : {
    key : 'minor_seventh',
    label : 'minor seventh',
    intervals : [3,4,3]
  },
  minor_major_seventh : {
    key : 'minor_major_seventh',
    label : 'minor-major seventh',
    intervals : [3,4,4]
  },
  diminished_seventh : {
    key : 'diminished_seventh',
    label : 'diminished seventh',
    intervals : [3,3,3]
  },
  half_diminished_seventh : {
    key : 'half_diminished_seventh',
    label : 'half-diminished seventh',
    intervals : [3,3,4]
  }
}

export const intervalNames = {
  1 :  {
    label: "Minor Second",
    value: 1
  },
  2 :  {
    label: "Major Second",
    value: 2
  },
  3 :  {
    label: "Minor Third",
    value: 3
  },
  4 :  {
    label: "Major Third",
    value: 4
  },
  5 :  {
    label: "Perfect Fourth",
    value: 5
  },
  6 :  {
    label: "Augmented Fourth",
    value: 6
  },
  7 :  {
    label: "Perfect Fifth",
    value: 7
  },
  8 :  {
    label: "Minor Sixth",
    value: 8
  },
  9 :  {
    label: "Major Sixth",
    value: 9
  },
  10 : {
    label: "Minor Seventh",
    value: 10
  },
  11 : {
    label: "Major Seventh",
    value: 11
  },
  12 : {
    label: "Octave",
    value: 12
  },
};
