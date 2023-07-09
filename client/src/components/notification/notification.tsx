import { useEffect, useState } from 'react'
import styles from './notification.module.css'
import { useRecoilState, useRecoilValue } from 'recoil'
import { NotificationMessage, ShowNotification } from 'state/notification'

export default function Notification(){
    const [show, setShow] = useState(false)
    const [showNotification, setShowNotification] = useRecoilState(ShowNotification)
    const notificationMessage = useRecoilValue(NotificationMessage)

    useEffect(() => {
        if(showNotification){
            setShow(true)
            setShowNotification(false)
        }
        setTimeout(() => {
            setShow(false)
        }, 3000);
    }, [showNotification])

    useEffect(() => {
        setShowNotification(true)
    }, [notificationMessage])

    return (<div>
        {notificationMessage &&
            <div 
                className={`${styles.notification} ${!show && styles['notification-off']}`}
            >
            {notificationMessage}
        </div>
        }
    </div>)
}

