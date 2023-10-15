export enum GameType {
  축구,
  해머,
  농구,
  남자,
  다트,
  레크레이션,
  두더지잡기,
  골프,
}

export class HappyFestivalScore {
  id: number
  gameType: GameType
  gender: string
  name: string
  score: number
}
