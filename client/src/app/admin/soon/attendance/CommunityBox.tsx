"use client"

import { Card, CardContent, Typography, Box } from "@mui/material"
import { Community } from "@server/entity/community"
import GroupIcon from "@mui/icons-material/Group"

interface CommunityProps {
  community: Community
  setSelectedCommunity: (community: Community) => void
}

export default function CommunityBox({
  community,
  setSelectedCommunity,
}: CommunityProps) {
  return (
    <Card
      sx={{
        minWidth: 100,
        height: 50,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
      onClick={() => setSelectedCommunity(community)}
    >
      <CardContent sx={{ textAlign: "center", px: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GroupIcon sx={{ fontSize: 16, color: "#1976d2", mr: 0.5 }} />
          <Typography variant="body2" fontWeight="bold">
            {community.name}
          </Typography>
        </Box>
        {community.users && (
          <Typography variant="caption" color="text.secondary">
            {community.users.length}명
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
