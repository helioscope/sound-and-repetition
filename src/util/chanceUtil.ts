type RNGFunction = ()=>number;
type RangeTuple = [number, number];

let rand: RNGFunction = Math.random;

export function getRandomValue(scale = 1) {
  return rand() * scale;
}

export function randomOdds(chance:number) {
  // assumes chance is between 0 and 1, so 0.5 is 50% odds
  return rand() < chance;
}

export function randomPickOne(optionsArr: any[]) {
  return optionsArr[randomRangeInt(0, optionsArr.length - 1)];
}
export function randomPickMultiple(optionsArr: any[], numPicks: number) {
  const lastIndex = optionsArr.length - 1;
  let picks = [];

  for (let i = 0; i < numPicks; i++) {
    picks.push(optionsArr[randomRangeInt(0, lastIndex)]);
  }
  
  return picks;
}
export function randomPull(optionsArr: any[], numPicks: number, mutate=false) {
  if (numPicks > optionsArr.length) {
    console.warn("WARNING: can't pull more than are in the list")
    numPicks = optionsArr.length;
  }
  
  if (mutate === false) {
    optionsArr = optionsArr.slice();
  }

  let lastIndex = optionsArr.length - 1;
  let picks = [];

  for (let i = 0; i < numPicks; i++) {
    let randomIndex = randomRangeInt(0, lastIndex);
    picks.push(optionsArr[randomIndex]);
    optionsArr.splice(randomIndex, 1);
    lastIndex--;
  }
  
  return picks;
}

export function randomRange(min: number, max: number) {
  const range = max - min;
  return (rand() * range) + min;
}
export function randomRangeFromArray(rangeArr: RangeTuple) {
  return randomRange(rangeArr[0],rangeArr[1]);
}

export function randomRangeInt(min: number, max: number) {
  const range = max - min + 1; // add 1 to be inclusive of the max value
  return Math.floor((rand() * range) + min);
}
export function randomRangeIntFromArray(rangeArr: RangeTuple) {
  return randomRangeInt(rangeArr[0],rangeArr[1]);
}

export function remapValue(inValue:  number, inRangeMin: number, inRangeMax: number, outRangeMin: number, outRangeMax: number) {
  // remap inValue from its initial range ("in" min and max) to a new range ("out" min & max)
  const inRange = inRangeMax - inRangeMin;
  const outRange = outRangeMax - outRangeMin
  return outRange * ((inValue - inRangeMin) / inRange) + outRangeMin;
}
export function remapValueFromArrays(inValue: number, inRangeArr:RangeTuple, outRangeArr:RangeTuple) {
  return remapValue(inValue, inRangeArr[0], inRangeArr[1], outRangeArr[0], outRangeArr[1]);
}

export function shuffleArray(arr: any[], times=1) {
  let length = arr.length;
  let lastIndex = length - 1;
  let index = -1;
  while (++index < length) {
      let rand = randomRange(index, lastIndex);
      let value = arr[rand];
      arr[rand] = arr[index];
      arr[index] = value;
  }
  return arr;
}

type WeightedOddsChoice = {
  value: any,
  weight: number,
  upperLimit?: number
}
export class WeightedOddsPicker {
  totalWeight: number
  choices: WeightedOddsChoice[]
  
  constructor(choicesArray: WeightedOddsChoice[]) {
    this.totalWeight = 0;
    this.choices = [];

    choicesArray.forEach((choice)=>{
      this.addChoice(choice);
    });
  }

  addChoice(choice:WeightedOddsChoice) {
    let storedChoice = Object.assign({}, choice);
    
    this.totalWeight += choice.weight;
    storedChoice.upperLimit = this.totalWeight;
    this.choices.push(storedChoice);
  }

  pickOne() {
    let odds = rand() * this.totalWeight;
    let choices = this.choices;
    let imax = choices.length;
    for (let i = 0; i < imax; i++) {
      let choice = choices[i];
      if (choice.upperLimit !== undefined && odds < choice.upperLimit) {
        return choice.value;
      }
    }
    console.warn("weighted picker odds overran choices? this shouldn't happen! egad!", odds, this.totalWeight);
    return choices[choices.length - 1].value;
  }
}

