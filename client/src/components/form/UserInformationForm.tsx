import styled from "@emotion/styled";
import { Button, 
  FormControlLabel, 
  FormLabel,
  MenuItem, 
  Radio,
  RadioGroup, 
  InputLabel,
  Select, 
  FormControl,
  TextField, } from "@mui/material";
import { Stack } from "@mui/system";
import { InOutInfo } from "@entity/inOutInfo";
import { User } from "@entity/user";
import { post } from "pages/api";
import { useEffect, useState } from "react";
import { AttendType, MoveType } from "types";
import InOutFrom from "./InOutForm";

interface IProps {
    user?: User
}

export default function UserInformationForm (props: IProps) {
    const [userInformation, setUserInformation] = useState(
      {
        name: '',
        password: '',
      } as User)
    const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])

    useEffect(() => {
        setUserInformation(props.user || {} as User)
    },[])

    const changeInformation = (type: string, data: string) => {
      setUserInformation({...userInformation, [type]: data})
    }

    const submit = async () => {
        if(!userInformation.name){
          alert('이름을 입력해주세요.')
          return
        }else if(!userInformation.password){
          alert('비밀번호를 입력해주세요.')
          return
        }else if(!userInformation.age){
          alert('나이를 입력해주세요.')
          return
        }else if(!userInformation.attendType){
          alert('전참 여부를 선택해주세요.')
          return
        }else if(!userInformation.sex){
          alert('성별을 선택해주세요.')
          return
        }else if(!userInformation.phone && userInformation.attendType === AttendType.half){
          alert('부분 참석자는 전화번호가 필수입니다.')
          return
        }

        if(userInformation.id){
          await post('/auth/edit-user', userInformation)
        }else{
          const saveResult = await post('/auth/join', userInformation)
          if(userInformation.attendType !== AttendType.full){
            await post('/info/save-attend-time', {
              userId: saveResult.userId,
              inOutData,
            })
          }
          if(saveResult.result === "success"){
            alert('접수에 성공하였습니다. 페이지를 닫으셔도 됩니다.')
          }else{
            alert('접수중 오류가 발생하였습니다.')
          }
        }
    }

    const validation = {
      name: userInformation?.name?.length === 0,
      password: userInformation?.password?.length === 0,
    }

    return (<Stack>
        <Field
            label="이름"
            value={userInformation.name}
            error={validation.name}
            helperText={validation.name && "이름을 입력하세요"}
            onChange={e => changeInformation("name", e.target.value)}
        />
    
        <Field
          label="비밀번호"
          type="password"
          error={validation.password}
          helperText={validation.password && "비밀번호를 입력하세요"}
          onChange={e => changeInformation("password", e.target.value)}
        />
        <Field
          label="나이"
          type="number"
          value={userInformation.age}
          onChange={e => changeInformation("age", e.target.value)}
          />
        <FormControl>
          <InputLabel id="demo-simple-select-helper-label">성별</InputLabel>
          <Select
            value={userInformation.sex}
            label="성별"
            onChange={e => changeInformation("sex", e.target.value)}
            defaultValue={userInformation.sex}
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
        </FormControl>

        <Stack>
          <Stack direction="row">
          전참 / 부참
          <Select
            value={userInformation.attendType}
            label="참석형태"
            onChange={e => changeInformation("attendType", e.target.value.toString())}
          >
            <MenuItem value={AttendType.full}>
              전참
            </MenuItem>
            <MenuItem value={AttendType.half}>
              부분 참석
            </MenuItem>
          </Select>
        </Stack>
        {userInformation.attendType === AttendType.half &&
          <InOutFrom
            setInOutData={setInOutData}
            inOutData={inOutData}
          />
        }
        </Stack>
        <Field
          label="전화번호"
          value={userInformation.phone}
          onChange={e => changeInformation("phone", e.target.value)}
          />

        <Field
          label="기타사항"
          value={userInformation.etc}
          onChange={e => changeInformation("etc", e.target.value)}
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