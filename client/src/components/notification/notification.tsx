import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { NotificationMessage } from "@/state/notification"
import {
  Alert,
  Snackbar,
  Stack,
  Slide,
  Fade,
  Box,
  Typography,
} from "@mui/material"
import { TransitionProps } from "@mui/material/transitions"
import React from "react"

// Slide transition component for smoother animations
function SlideTransition(
  props: TransitionProps & { children: React.ReactElement }
) {
  return <Slide {...props} direction="left" />
}

interface NotificationItem {
  id: number
  content: string
  isVisible: boolean
  severity?: "success" | "info" | "warning" | "error"
}

export default function Notification() {
  const [notificationMessage, setNotificationMessage] =
    useAtom(NotificationMessage)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [nextId, setNextId] = useState(1)

  // Add new notification when message changes
  useEffect(() => {
    if (notificationMessage.trim().length > 0) {
      const newNotification: NotificationItem = {
        id: nextId,
        content: notificationMessage,
        isVisible: true,
        severity: "success",
      }

      setNotifications((prev) => [...prev, newNotification])
      setNextId(nextId + 1)
      setNotificationMessage("")

      // Auto remove after 4 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === newNotification.id
              ? { ...notif, isVisible: false }
              : notif
          )
        )

        // Remove from array after fade out animation
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((notif) => notif.id !== newNotification.id)
          )
        }, 300)
      }, 4000)
    }
  }, [notificationMessage, nextId])

  const handleClose = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isVisible: false } : notif
      )
    )

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    }, 300)
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 80,
        right: 20,
        zIndex: 9999,
        minWidth: 320,
        maxWidth: 400,
      }}
    >
      <Stack spacing={1}>
        {notifications.map((notification) => (
          <Fade key={notification.id} in={notification.isVisible} timeout={300}>
            <Box>
              <Alert
                severity={notification.severity}
                onClose={() => handleClose(notification.id)}
                sx={{
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  },
                  "& .MuiAlert-action": {
                    padding: 0,
                  },
                  background:
                    notification.severity === "success"
                      ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)"
                      : undefined,
                  color:
                    notification.severity === "success" ? "white" : undefined,
                  "& .MuiAlert-icon, & .MuiIconButton-root": {
                    color:
                      notification.severity === "success" ? "white" : undefined,
                    fontSize:
                      notification.severity === "success" ? "1.2rem" : "1.2rem",
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {notification.content}
                </Typography>
              </Alert>
            </Box>
          </Fade>
        ))}
      </Stack>
    </Box>
  )
}
