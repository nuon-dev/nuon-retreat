import { atom } from "recoil"

export enum Tabs {
  Home,
  Receipt,
  Info,
  MyPage,
}

export const SelectedTab = atom({
  key: "selected-tab",
  default: Tabs.Receipt,
})
