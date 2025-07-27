"use client"

import { type Community } from "@server/entity/community"
import { Card, Input, Stack, Typography, Box, Avatar } from "@mui/material"
import { MouseEvent, ReactElement } from "react"

interface CommunityCardProps {
  community: Community
  depth?: number
  editMode: "All" | "Folder"
  communityList: Community[]
  selectedCommunity?: Community
  clickedCommunity?: Community
  isCommunityNameEditMode: boolean
  clickedCommunityName: string
  onDoubleClick: () => void
  onMouseUp: (e: MouseEvent) => void
  onMouseDown: (e: MouseEvent) => void
  onNameDoubleClick: (e: MouseEvent) => void
  onNameClick: (e: MouseEvent) => void
  onNameChange: (value: string) => void
  renderChildren: (parentId: number, depth: number) => ReactElement[]
}

export default function CommunityCard({
  community,
  depth = 0,
  editMode,
  communityList,
  selectedCommunity,
  clickedCommunity,
  isCommunityNameEditMode,
  clickedCommunityName,
  onDoubleClick,
  onMouseUp,
  onMouseDown,
  onNameDoubleClick,
  onNameClick,
  onNameChange,
  renderChildren,
}: CommunityCardProps) {
  if (depth > 10) {
    return null
  }

  const hasChildren =
    communityList.filter((c) => c.parent?.id === community.id).length > 0

  return (
    <Card
      onDoubleClick={onDoubleClick}
      sx={{
        border: "2px solid #e0e0e0",
        minHeight: "70px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        position: "relative",
        "&::before":
          depth > 0
            ? {
                content: '""',
                position: "absolute",
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                border: `2px solid ${
                  depth === 1
                    ? "#4caf50"
                    : depth === 2
                    ? "#ff9800"
                    : depth === 3
                    ? "#e91e63"
                    : "#9c27b0"
                }`,
                borderRadius: 2,
                zIndex: -1,
              }
            : {},
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transform: "translateY(-1px)",
          borderColor: "#1976d2",
        },
        ...(selectedCommunity?.id === community.id && {
          borderColor: "#1976d2",
          bgcolor: "#e3f2fd",
        }),
      }}
      key={community.id}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
    >
      <Stack m={1.5}>
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          py={1}
          onDoubleClick={onNameDoubleClick}
          onClick={onNameClick}
          sx={{
            borderBottom:
              editMode === "All" && hasChildren ? "2px solid #1976d2" : "none",
            pb: editMode === "All" && hasChildren ? 1.5 : 0,
            mb: editMode === "All" && hasChildren ? 1 : 0,
          }}
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: "0.75rem",
              bgcolor:
                depth === 0
                  ? "#1976d2"
                  : depth === 1
                  ? "#4caf50"
                  : depth === 2
                  ? "#ff9800"
                  : depth === 3
                  ? "#e91e63"
                  : "#9c27b0",
              fontWeight: "bold",
            }}
          >
            {community.name.charAt(0)}
          </Avatar>
          {isCommunityNameEditMode && clickedCommunity?.id === community.id ? (
            <Input
              value={clickedCommunityName}
              autoFocus
              onChange={(e) => onNameChange(e.target.value)}
              sx={{ flex: 1 }}
            />
          ) : (
            <Typography variant="body2" fontWeight="600" sx={{ flex: 1 }}>
              {community.name}
            </Typography>
          )}
        </Stack>
        {editMode === "All" && hasChildren && (
          <Box
            sx={{
              mt: 1,
              p: 1.5,
              bgcolor: "#f8f9fa",
              borderRadius: 2,
              border: "1px dashed #1976d2",
            }}
          >
            <Stack gap={1} direction="row" flexWrap="wrap">
              {renderChildren(community.id, depth + 1)}
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  )
}
