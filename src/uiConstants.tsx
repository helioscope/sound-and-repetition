import { ToggleItemGroup, ToggleItem } from "./components/AnyAllNoneToggleSet";
import { ChordDefinition, chords } from "./data/chords";
import { Pitch, pitches } from "./data/pitches";
import { MusicalScale, scales } from "./data/scales";
import { ToneInterval, toneIntervals } from "./data/toneIntervals";

export const rootPitchCollection : ToggleItem<Pitch>[] = pitches.map((pitch)=>{
  return {
    label: pitch.names[0],
    value: pitch
  }
});

export const intervalsCollection : ToggleItem<ToneInterval>[] = toneIntervals.map((interval) => {
  return {
    label: interval.label,
    value: interval
  }
});

export const chordsCollection : ToggleItem<ChordDefinition>[] = chords.map((chord) => {
  return {
    label: chord.label,
    value: chord
  }
});

export const scalesCollection = ( () : ToggleItemGroup<MusicalScale>[] => {
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
