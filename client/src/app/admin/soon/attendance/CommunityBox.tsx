"use client"

import { Stack } from "@mui/material"
import { Community } from "@server/entity/community"

interface CommunityProps {
  community: Community
  setSelectedCommunity: (community: Community) => void
}

export default function CommunityBox({
  community,
  setSelectedCommunity,
}: CommunityProps) {
  return (
    <Stack
      padding="8px"
      borderRadius="8px"
      border="1px solid #ccc"
      onClick={() => setSelectedCommunity(community)}
    >
      {community.name}
    </Stack>
  )
}
