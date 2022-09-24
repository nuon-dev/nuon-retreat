import styled from "@emotion/styled";
import { Button, MenuItem, Select, TextField, TextFieldProps } from "@mui/material";
import { Stack } from "@mui/system";
import { User } from "@server/src/entity/user";
import { post } from "pages/api";
import { useEffect, useState } from "react";

interface IProps {
    user: User
}

export default function UserInformationForm (props: IProps) {
    const [userInformation, setUserInformation] = useState({} as User)

    useEffect(() => {
        setUserInformation(props.user)
    },[])

    const changeInformation = (type: string, data: string) => {
        setUserInformation({...userInformation, [type]: data})
    }

    const submit = () => {
        if(userInformation.id){
            post('/auth/edit-user', userInformation)
        }else{
            //Todo: 구현해야함
        }
    }

    return (<Stack>
        <Field
            label="이름"
            value={userInformation.name}
            onChange={e => changeInformation("name", e.target.value)}
        />
    
        <Field
          label="비밀번호"
          type="password"
          onChange={e => changeInformation("password", e.target.value)}
        />
        <Field
          label="나이"
          type="number"
          value={userInformation.age}
          onChange={e => changeInformation("age", e.target.value)}
          />
          <Select
            value={userInformation.sex}
            label="성별"
            onChange={e => changeInformation("sex", e.target.value)}
            sx={{
              mt: '12px'
            }}
          >
            <MenuItem value={'man'}>
              남
            </MenuItem>
            <MenuItem value={'woman'}>
              여
            </MenuItem>
          </Select>
        <Field
          label="전화번호"
          value={userInformation.phone}
          onChange={e => changeInformation("phone", e.target.value)}
          />

          <Button
            onClick={submit}
          >
              저장
          </Button>
    </Stack>)
}


const Field = styled(TextField)({
    marginTop: '12px'
  })