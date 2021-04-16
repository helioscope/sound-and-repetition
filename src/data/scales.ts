export interface MusicalScale {
  id : string,
  name : string,
  intervals : Number[],
  mode? : Number | undefined,
  info? : string | undefined
};

// maybe split these all into
export const scales : MusicalScale[] = [
  // chromatic (all 12 tones)
  {
    id : "chromatic",
    name : "chromatic",
    intervals: [1,1,1,1,1,1,1,1,1,1,1,1,1],
    info: "all half-tones, aka the 'twelve tone' scale",
  },

  // heptatonic (7 tones)
  {
    id : "aeoliean",
    name : "aeoliean",
    mode : 1,
    intervals : [2,1,2,2,1,2,2],
    info: "(aka the 'natural minor' scale)"
  },
  {
    id : "harmonic_minor",
    name : "harmonic minor",
    // mode : 1, // derived from natural minor
    intervals : [2,1,2,2,1,3,1],
    info: "(aka the 'aeolian #7' scale)"
  },
  {
    id : "melodic_minor_asc",
    name : "melodic minor (ascending)",
    // mode : 1, // also derived from natural minor
    intervals : [2,1,2,2,2,2,1],
    info: "the spacing of the notes changes whether ascending or descending. this is technically the ascending scale. should this be listed as two scales?"
  },
  {
    id : "locrian",
    name : "locrian",
    mode : 2,
    intervals : [1,2,2,1,2,2,2],
    info: ""
  },
  {
    id : "ionian",
    name : "ionian",
    mode : 3,
    intervals : [2,2,1,2,2,2,1],
    info: "(aka the 'major' scale)"
  },
  {
    id : "dorian",
    name : "dorian",
    mode : 4,
    intervals : [2,1,2,2,2,1,2],
    info: ""
  },
  {
    id : "phrygian",
    name : "phrygian",
    mode : 5,
    intervals : [1,2,2,2,1,2,2],
    info: ""
  },
  {
    id : "lydian",
    name : "lydian",
    mode : 6,
    intervals : [2,2,2,1,2,2,1],
    info: ""
  },
  {
    id : "mixolydian",
    name : "mixolydian",
    mode : 7,
    intervals : [2,2,1,2,2,1,2],
    info: ""
  },
  // note: these are just the 'Heptatonia prima'; there are more: https://en.wikipedia.org/wiki/Heptatonic_scale
  
  // pentatonic (five tones)
  {
    id : "minor",
    name : "minor",
    mode : 1,
    intervals : [3,2,2,3,2]
  },
  {
    id : "major",
    name : "major",
    mode : 2,
    intervals : [2,2,3,2,3]
  },
  {
    id : "egyptian_sus",
    name : "egyptian sus",
    mode : 3,
    intervals : [2,3,2,3,2]
  },
  {
    id : "blues_minor",
    name : "blues minor",
    mode : 4,
    intervals : [3,2,3,2,2]
  },
  {
    id : "blues_major",
    name : "blues major",
    mode : 5,
    intervals : [2,3,2,2,3]
  }
  // note: there are more: https://en.wikipedia.org/wiki/Scale_(music)
];
