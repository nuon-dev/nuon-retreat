"use client"

import { type Community } from "@server/entity/community"
import { Button, Stack, Box, Typography } from "@mui/material"
import NavigationCommunity from "./NavigationCommunity"

enum EditMode {
  All,
  Folder,
}

interface CommunityControlPanelProps {
  editMode: EditMode
  communityStack: Community[]
  selectedCommunity?: Community
  onEditModeChange: () => void
  onAddCommunity: () => void
  onRemoveCommunity: () => void
  onStackUpdate: (newStack: Community[]) => void
  onMouseUp: (e: React.MouseEvent, community: Community) => void
  onMouseDown: (e: React.MouseEvent, community: Community) => void
  styles: any
}

export default function CommunityControlPanel({
  editMode,
  communityStack,
  selectedCommunity,
  onEditModeChange,
  onAddCommunity,
  onRemoveCommunity,
  onStackUpdate,
  onMouseUp,
  onMouseDown,
  styles,
}: CommunityControlPanelProps) {
  const getControlPanelStyles = () => ({
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    bgcolor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  })

  const getModeButtonText = () => (editMode === EditMode.All ? "폴더" : "전체")

  const renderNavigationItems = () => (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <NavigationCommunity
        community={{ id: 0, name: "전체" } as Community}
        communityStack={communityStack}
        selectedCommunity={selectedCommunity}
        onStackUpdate={onStackUpdate}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        styles={styles}
      />
      {communityStack.map((community) => (
        <NavigationCommunity
          key={community.id}
          community={community}
          communityStack={communityStack}
          selectedCommunity={selectedCommunity}
          onStackUpdate={onStackUpdate}
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          styles={styles}
        />
      ))}
    </Box>
  )

  const renderActionButtons = () => (
    <Stack direction="row" gap={1.5} alignItems="center">
      <Button
        variant="contained"
        onClick={onAddCommunity}
        sx={{ borderRadius: 2 }}
      >
        새로운 그룹 추가
      </Button>
      <Button
        variant="outlined"
        color="error"
        onMouseUp={onRemoveCommunity}
        className={selectedCommunity && styles.community_name}
        disabled={!selectedCommunity}
        sx={{ borderRadius: 2 }}
      >
        삭제
      </Button>
    </Stack>
  )

  return (
    <>
      <Typography variant="h5" fontWeight="bold" mb={2} color="text.primary">
        다락방 그룹 관리
      </Typography>

      <Stack
        direction="row"
        p={2}
        gap={2}
        sx={getControlPanelStyles()}
        justifyContent="space-between"
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Button
            variant={editMode === EditMode.All ? "contained" : "outlined"}
            onClick={onEditModeChange}
            sx={{ borderRadius: 2 }}
          >
            {getModeButtonText()} 모드로 변경
          </Button>
          {renderNavigationItems()}
        </Stack>
        {renderActionButtons()}
      </Stack>
    </>
  )
}
