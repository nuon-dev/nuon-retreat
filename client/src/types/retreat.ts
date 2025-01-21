export interface Chat extends ChatContent {
  time: string
}

export interface ChatContent {
  type: "bot" | "my"
  content: string
  buttons?: ChatButton[]
}

export interface ChatButton {
  content: string
  onClick: () => void
}
