import { WorshipKind } from "@server/entity/worshipSchedule"

export function worshipKr(kind: WorshipKind): string {
  switch (kind) {
    case WorshipKind.SundayService:
      return "주일예배"
    case WorshipKind.FridayService:
      return "금요철야"
    default:
      return "알 수 없는 종류"
  }
}
