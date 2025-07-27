import { Box, Button, MenuItem, Stack, TextField } from "@mui/material"
import { User } from "@server/entity/user"

interface UserFormProps {
  selectedUser: User
  onDataChange: (key: string, value: string) => void
  onSave: () => void
  onDelete: () => void
  onClear: () => void
}

export default function UserForm({
  selectedUser,
  onDataChange,
  onSave,
  onDelete,
  onClear,
}: UserFormProps) {
  return (
    <Stack
      flex={1}
      gap="12px"
      p="16px"
      m="12px"
      border="1px solid #e0e0e0"
      borderRadius="12px"
      bgcolor="#ffffff"
      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          onClick={onClear}
          variant="outlined"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 2,
          }}
        >
          새로 입력
        </Button>
        <Box fontSize="14px" color="#666" fontWeight="500">
          {selectedUser.id ? "정보 수정 중.." : "새로 입력 중.."}
        </Box>
        <Stack direction="row" gap="8px">
          {selectedUser.id && (
            <Button
              variant="outlined"
              color="error"
              onClick={onDelete}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 2,
              }}
            >
              삭제
            </Button>
          )}
          <Button
            variant="contained"
            onClick={onSave}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 2,
              bgcolor: "#1976d2",
              "&:hover": {
                bgcolor: "#1565c0",
              },
            }}
          >
            저장
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" gap="12px">
        <Box width="80px" textAlign="right">
          이름 :{" "}
        </Box>
        <TextField
          value={selectedUser.name}
          onChange={(e) => onDataChange("name", e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap="12px">
        <Box width="80px" textAlign="right">
          생년 :{" "}
        </Box>
        <TextField
          value={selectedUser.yearOfBirth === 0 ? "" : selectedUser.yearOfBirth}
          onChange={(e) => onDataChange("yearOfBirth", e.target.value)}
          variant="outlined"
          size="small"
          type="number"
          placeholder="예: 1990"
          sx={{ flex: 1 }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap="12px">
        <Box width="80px" textAlign="right">
          연락처 :{" "}
        </Box>
        <TextField
          value={selectedUser.phone}
          onChange={(e) => onDataChange("phone", e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" gap="12px">
        <Box width="80px" textAlign="right">
          성별 :
        </Box>
        <TextField
          select
          value={selectedUser.gender}
          onChange={(e) => onDataChange("gender", e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        >
          <MenuItem value="man">남</MenuItem>
          <MenuItem value="woman">여</MenuItem>
        </TextField>
      </Stack>

      <Stack direction="row" alignItems="center" gap="12px">
        <Box width="80px" textAlign="right">
          기타 사항 :
        </Box>
        <TextField
          value={selectedUser.etc || ""}
          onChange={(e) => onDataChange("etc", e.target.value)}
          variant="outlined"
          size="small"
          multiline
          rows={3}
          sx={{ flex: 1 }}
        />
      </Stack>
    </Stack>
  )
}
