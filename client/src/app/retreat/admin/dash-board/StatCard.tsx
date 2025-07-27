import { Box, Paper, Stack, Typography } from "@mui/material"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  color?: string
  backgroundColor?: string
  icon?: React.ReactNode
}

export default function StatCard({
  title,
  value,
  subtitle,
  color = "#333",
  backgroundColor = "#fff",
  icon,
}: StatCardProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2.5,
        m: 1,
        minWidth: 200,
        borderRadius: 2,
        backgroundColor,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {icon && <Box color="primary.main">{icon}</Box>}
        <Stack flex={1}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color={color} mt={0.5}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}
