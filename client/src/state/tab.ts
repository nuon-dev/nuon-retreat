import { atom } from "recoil"

export enum Tabs {
  Home,
  Etc,
  MyPage,
}

export const SelectedTab = atom({
  key: "selected-tab",
  default: Tabs.Home,
})
