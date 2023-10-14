import { User } from "./user"

export enum status {
  worry,
  confirm,
}

export class ANewLaity {
  id: number
  user: User
  newMemberName: string
  status: status
}
