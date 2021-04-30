import { cancelNotesPlayback } from "../util/musicUtil";
import { cancelSpeech } from "../util/speechSynthesisUtil";

export interface EarExercise<SettingsType, StateType> {
  start: ()=>void,
  cancel: ()=>void,
  updateSettings: (settings: SettingsType)=>void,
  getSettings: ()=>SettingsType,
  onStart: ((state: StateType) => void) | undefined
  onFinish: ((state: StateType) => void) | undefined
}

export class EarExerciseBase<SettingsType, StateType> {
  // provides common elements for ear exercises, and most (but not all) implemention of the EarExercise interface
  
  playTimeout: number | null = null
  state: StateType
  settings: SettingsType
  onStart: ((state: StateType) => void) | undefined
  onFinish: ((state: StateType) => void) | undefined

  constructor(settings: SettingsType, state: StateType) {
    this.state = Object.assign({}, state);
    this.settings = Object.assign({}, settings);
  }

  cancel() {
    this.cancelTimeout();
    cancelNotesPlayback();
    cancelSpeech();
  }
  cancelTimeout() {
    if (this.playTimeout !== null) {
      clearTimeout(this.playTimeout);
      this.playTimeout = null;
    }
  }
  doAfterPause(action:()=>void, delayInSeconds: number) {
    this.playTimeout = window.setTimeout(action, delayInSeconds * 1000);
  }
  updateSettings(updatedSettings: Partial<SettingsType>) {
    this.settings = Object.assign({}, this.settings, updatedSettings);
  }
  getSettings() {
    return this.settings;
  }
  setState(updatedState: Partial<StateType>) {
    this.state = Object.assign({}, this.state, updatedState);
  }
}