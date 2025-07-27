import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Stack,
} from "@mui/material"
import { User } from "@server/entity/user"

interface UserTableProps {
  userList: User[]
  filteredUserList: User[]
  orderProperty: keyof User
  direction: "asc" | "desc"
  onSortClick: (property: keyof User) => void
  onUserSelect: (user: User) => void
}

export default function UserTable({
  userList,
  filteredUserList,
  orderProperty,
  direction,
  onSortClick,
  onUserSelect,
}: UserTableProps) {
  return (
    <Stack
      width="50%"
      flex={1}
      border="1px solid #ccc"
      maxHeight="calc(100vh - 100px)"
      overflow="auto"
    >
      <Box p="8px" bgcolor="#f5f5f5" fontSize="14px">
        총 {filteredUserList.length}명 (전체 {userList.length}명)
      </Box>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderProperty === "name"}
                direction={direction}
                onClick={() => onSortClick("name")}
              >
                이름
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderProperty === "gender"}
                direction={direction}
                onClick={() => onSortClick("gender")}
              >
                성별
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderProperty === "yearOfBirth"}
                direction={direction}
                onClick={() => onSortClick("yearOfBirth")}
              >
                생년
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderProperty === "phone"}
                direction={direction}
                onClick={() => onSortClick("phone")}
              >
                전화번호
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUserList.map((user) => (
            <TableRow
              key={user.id}
              onClick={() => onUserSelect(user)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.gender === "man" ? "남" : "여"}</TableCell>
              <TableCell>
                {user.yearOfBirth === 0 ? "" : user.yearOfBirth}
              </TableCell>
              <TableCell>{user.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}
