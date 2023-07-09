import { atom } from "recoil";

export const ShowNotification = atom({
    key: "show-notification",
    default: false
})

export const NotificationMessage = atom({
    key: "notification-message",
    default: "",
})

