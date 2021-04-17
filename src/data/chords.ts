export interface ChordDefinition {
  id : string,
  label : string,
  intervals : number[]
};

export const chords : ChordDefinition[] = [
  // more info: https://en.wikipedia.org/wiki/Chord_(music)#Characteristics
  
  // triads
  
  {
    id : 'major',
    label : 'major',
    intervals : [4,3]
  },
  {
    id : 'minor',
    label : 'minor',
    intervals : [3,4]
  },
  {
    id : 'augmented',
    label : 'augmented',
    intervals : [4,4]
  },
  {
    id : 'diminished',
    label : 'diminished',
    intervals : [3,3]
  },


  // tetrads
  
  {
    id : 'major_sixth',
    label : 'major sixth',
    intervals : [4,3,2]
  },
  {
    id : 'dominant_seventh',
    label : 'dominant seventh',
    intervals : [4,3,3]
  },
  {
    id : 'major_seventh',
    label : 'major seventh',
    intervals : [4,3,4]
  },
  {
    id : 'augmented_seventh',
    label : 'augmented seventh',
    intervals : [4,4,2]
  },
  {
    id : 'minor_sixth',
    label : 'minor sixth',
    intervals : [3,4,2]
  },
  {
    id : 'minor_seventh',
    label : 'minor seventh',
    intervals : [3,4,3]
  },
  {
    id : 'minor_major_seventh',
    label : 'minor-major seventh',
    intervals : [3,4,4]
  },
  {
    id : 'diminished_seventh',
    label : 'diminished seventh',
    intervals : [3,3,3]
  },
  {
    id : 'half_diminished_seventh',
    label : 'half-diminished seventh',
    intervals : [3,3,4]
  }
];