import { Button, Stack, Typography, Breadcrumbs } from "@mui/material"
import { Community } from "@server/entity/community"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import HomeIcon from "@mui/icons-material/Home"

interface CommunityNavigationProps {
  communityStack: Community[]
  handleBackClick: () => void
}

export default function CommunityNavigation({
  communityStack,
  handleBackClick,
}: CommunityNavigationProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        disabled={communityStack.length === 0}
        size="small"
      >
        뒤로
      </Button>

      <Breadcrumbs separator="›" sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <HomeIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="primary">
            최상위
          </Typography>
        </Stack>
        {communityStack.map((community) => (
          <Typography key={community.id} variant="body2" color="text.primary">
            {community.name}
          </Typography>
        ))}
      </Breadcrumbs>
    </Stack>
  )
}
