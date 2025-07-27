import { Button, Stack } from "@mui/material"
import { Community } from "@server/entity/community"

interface CommunityNavigationProps {
  communityStack: Community[]
  handleBackClick: () => void
}

export default function CommunityNavigation({
  communityStack,
  handleBackClick
}: CommunityNavigationProps) {
  return (
    <Stack
      gap="16px"
      margin="4px"
      padding="8px"
      direction="row"
      alignItems="center"
    >
      <Button
        variant="outlined"
        onClick={handleBackClick}
        disabled={communityStack.length === 0}
      >
        Back
      </Button>
      최상위
      {communityStack.map((community) => (
        <Stack key={community.id}>&gt; {community.name}</Stack>
      ))}
    </Stack>
  )
}