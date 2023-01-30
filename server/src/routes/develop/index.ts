
import express, { Router } from "express";

import { User } from "../../entity/user";
import { AttendType } from "../../entity/types";
import { attendInfoDatabase, groupAssignmentDatabase, permissionDatabase, roomAssignmentDatabase, userDatabase } from "../../model/dataSource";
import { InOutInfo } from "../../entity/inOutInfo";

const router: Router = express.Router();

router.post('/insert-data', async (req, res) => {
    const body = req.body

    const tableName = body.tableName
    const data: string = body.data
    const list: Array<any> = body.list

    if(tableName === 'user'){
        const rows = data.split('\n')
        for(let index = 0; index < rows.length - 1; index++){
            const row = rows[index].split(',')
            const user = new User()
            user.id = Number.parseInt(row[0])
            user.name = row[1]
            user.password = row[2]
            user.age = Number.parseInt(row[3])
            user.sex = row[4]
            user.phone = row[5]
            user.attendType = row[6] as AttendType
            user.etc = row[7]
            user.firstCome = row[8] === 'true'
            user.deposit = row[9] === 'true'
            user.token = row[10]
            user.expire = new Date(row[11])
            user.isCancell = row[12] === 'true'
            user.howToGo = row[13]
            user.isSuperUser = row[14] === 'true'
            user.createAt = new Date(row[15])

            await userDatabase.save(user)
        }
    }else if(tableName === "info"){
        const rows = list as Array<InOutInfo>
        rows.forEach(async info => {
            await attendInfoDatabase.save(info)
        });
    }
    res.send('good')
})

router.get('/remove-duplicated-user-data', async (req, res) => {
    const allUser = await userDatabase.find()
    allUser.forEach(async user => {
        const cloneUser = JSON.parse(JSON.stringify(user))
        delete cloneUser.id
        delete cloneUser.password
        delete cloneUser.token
        delete cloneUser.createAt
        delete cloneUser.expire
        delete cloneUser.firstCome
        let result = await userDatabase.countBy(cloneUser)
        if(result > 1){
            const dubplList = await userDatabase.findBy(cloneUser)
            await deleteUser(dubplList[1])
        }

        result = await userDatabase.countBy(cloneUser)
        if(result > 1){
            const dubplList = await userDatabase.findBy(cloneUser)
            await deleteUser(dubplList[1])
        }
    })

    const count = await userDatabase.query('SELECT phone, COUNT(phone) FROM user GROUP BY phone HAVING COUNT(phone) > 1;')
    res.send(count)
})

router.get('/fix-createAt', async (req, res) => {
    const allUser = await userDatabase.find()
    allUser.forEach(async user => {
        const date = new Date(user.createAt)
        date.setDate(date.getDate() - 7)
        user.createAt = date
        await userDatabase.save(user)
    })

    res.send('good-createAt')
})

async function deleteUser(user){
    console.log(user)
    await attendInfoDatabase.delete({
        user: user
    })
    await permissionDatabase.delete({
        user: user
    })
    await userDatabase.delete(user)
    return
}

export default router