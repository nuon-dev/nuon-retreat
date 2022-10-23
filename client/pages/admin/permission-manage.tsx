import { useEffect } from "react"
import { get } from "pages/api";


function PermissionManage () {

    useEffect(() => {
        get('/admin/get-all-user-name')
        
    }, [])

    return (<>

    </>)
}

export default PermissionManage