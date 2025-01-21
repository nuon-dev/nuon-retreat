import { InOutInfo } from "@server/entity/inOutInfo"
import { RetreatAttend } from "@server/entity/retreatAttend"
import { atom } from "recoil"

export const StopRetreatBodyScrollAtom = atom<boolean>({
  key: "stop-scroll",
  default: false,
})

export const ShowInOutInfoComponentAtom = atom<boolean>({
  key: "show-in-out-info",
  default: false,
})

export const RetreatAttendAtom = atom<RetreatAttend | undefined>({
  key: "retreat-attend",
  default: undefined,
})

export const InOutInformationAtom = atom<InOutInfo[]>({
  key: "in-out-information",
  default: [],
})
