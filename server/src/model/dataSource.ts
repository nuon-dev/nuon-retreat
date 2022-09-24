import { DataSource } from "typeorm";
import { User } from "../entity/user";

const dataSource = new DataSource(require('../../ormconfig.json'))

export const userDatabase = dataSource.getRepository(User)
export default dataSource

