import { atom } from "recoil"

export const StopRetreatBodyScrollAtom = atom<boolean>({
  key: "stop-scroll",
  default: false,
})

export const ShowInOutInfoComponentAtom = atom<boolean>({
  key: "show-in-out-info",
  default: false,
})
