export interface ToneInterval {
  value: number,
  label: string
};

export const toneIntervals : ToneInterval[] = [
  {
    value: 0,
    label: "Identical"
  },
  {
    value: 1,
    label: "Minor Second"
  },
  {
    value: 2,
    label: "Major Second"
  },
  {
    value: 3,
    label: "Minor Third"
  },
  {
    value: 4,
    label: "Major Third"
  },
  {
    value: 5,
    label: "Perfect Fourth"
  },
  {
    value: 6,
    label: "Augmented Fourth"
  },
  {
    value: 7,
    label: "Perfect Fifth"
  },
  {
    value: 8,
    label: "Minor Sixth"
  },
  {
    value: 9,
    label: "Major Sixth"
  },
  {
    value: 10,
    label: "Minor Seventh"
  },
  {
    value: 11,
    label: "Major Seventh"
  },
  {
    value: 12,
    label: "Octave"
  }
];
