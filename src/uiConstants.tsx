import { ToggleItemGroupType, ToggleItemType } from "./components/AnyAllNoneToggleSet";
import { pitches } from "./data/pitches";
import { scales } from "./data/scales";
import { ScaleNameExercise } from "./exercises/ScaleNameExercise";

export const exerciseList: ToggleItemType[] = [ // move this to uiConstants and make contents ToggleItems
  {
    label: 'scales', 
    value: new ScaleNameExercise()
  }
];

export const rootPitchCollection = pitches.map((pitch)=>{
  return {
    label: pitch.names[0],
    value: pitch
  }
});

export const scalesCollection = ( () : ToggleItemGroupType[] => {
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
