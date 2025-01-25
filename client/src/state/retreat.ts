import { InOutInfo } from "@server/entity/inOutInfo"
import { RetreatAttend } from "@server/entity/retreatAttend"
import { atom } from "recoil"

export const ShowInOutInfoComponentAtom = atom<boolean | undefined>({
  key: "show-in-out-info",
  default: undefined,
})

export const RetreatAttendAtom = atom<RetreatAttend | undefined>({
  key: "retreat-attend",
  default: undefined,
})

export const InOutInformationAtom = atom<InOutInfo[] | undefined>({
  key: "in-out-information",
  default: undefined,
})
