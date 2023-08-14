export class GroupScore {
  id: number
  groupName: string
  groupScore: GroupScoreData[]
}

export class GroupScoreData {
  id: number
  gameNumber: number
  score: number
}
