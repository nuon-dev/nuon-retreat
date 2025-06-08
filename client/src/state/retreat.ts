import { InOutInfo } from "@server/entity/retreat/inOutInfo"
import { RetreatAttend } from "@server/entity/retreat/retreatAttend"
import { atom } from "jotai"

export const ShowInOutInfoComponentAtom = atom<boolean | undefined>(undefined)

export const RetreatAttendAtom = atom<RetreatAttend | undefined>(undefined)

export const InOutInformationAtom = atom<InOutInfo[] | undefined>(undefined)
