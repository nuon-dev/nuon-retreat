"use client"

import { type Community } from "@server/entity/community"
import { Card, Stack, Box, Typography } from "@mui/material"
import { MouseEvent } from "react"

interface NavigationCommunityProps {
  community: Community
  communityStack: Community[]
  selectedCommunity?: Community
  onStackUpdate: (newStack: Community[]) => void
  onMouseUp: (e: MouseEvent, community: Community) => void
  onMouseDown: (e: MouseEvent, community: Community) => void
  styles: any
}

export default function NavigationCommunity({
  community,
  communityStack,
  selectedCommunity,
  onStackUpdate,
  onMouseUp,
  onMouseDown,
  styles,
}: NavigationCommunityProps) {
  const handleClick = () => {
    const myIndex = communityStack.findIndex((g) => g.id === community.id)
    onStackUpdate(communityStack.slice(0, myIndex + 1))
  }

  const getCardStyles = () => ({
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: "#1976d2",
      bgcolor: "#f5f5f5",
    },
  })

  const getContentStyles = () => ({
    cursor: "pointer",
    borderRadius: 1,
    "&:hover": {
      bgcolor: "#e3f2fd",
    },
  })

  return (
    <Card sx={getCardStyles()}>
      <Stack m={1}>
        <Box
          py={0.75}
          px={1}
          onMouseUp={(e) => onMouseUp(e, community)}
          onMouseDown={(e) => onMouseDown(e, community)}
          className={selectedCommunity && styles.community_name}
          onClick={handleClick}
          sx={getContentStyles()}
        >
          <Typography variant="body2" fontWeight="500" textAlign="center">
            {community.name}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )
}
