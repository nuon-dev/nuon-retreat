import { useEffect, useState } from 'react'
import styles from './notification.module.css'
import { useRecoilState } from 'recoil'
import { ShowNotification } from 'state/notification'

export default function Notification(){
    const [show, setShow] = useState(true)
    const [showNotification, setShowNotification] = useRecoilState(ShowNotification)

    useEffect(() => {
        if(showNotification){
            setShow(true)
            setShowNotification(false)
        }
        setTimeout(() => {
            setShow(false)
        }, 3000);
    }, [showNotification])

    return (<div
        className={`${styles.notification} ${!show && styles['notification-off']}`}
>
        내용입니다. {show.toString()}
    </div>)
}

