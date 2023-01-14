
import { User } from "@entity/user";
import { useEffect, useState } from "react";

function group () {
    const [unassignedUserList, setUnassignedUserList] = useState([] as Array<User>)
    const [roomList, setRoomList] = useState([] as Array<Array<User>>)
    const [selectedUser, setSelectedUser] = useState<User>()
    const [maxRoomNumber, setMaxRoomNumber] = useState(0)
     


    return 
}

export default group