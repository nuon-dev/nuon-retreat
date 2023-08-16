export class Team {
  id: number
  teamName: string
  teamScore: TeamScoreData[]
}

export class TeamScoreData {
  id: number
  gameNumber: number
  score: number
}
