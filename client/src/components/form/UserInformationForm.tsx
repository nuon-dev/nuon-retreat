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
    inOutData: Array<InOutInfo>
}

export default function UserInformationForm (props: IProps) {
    const [userInformation, setUserInformation] = useState(
      {
        name: '',
        password: '',
        attendType: AttendType.full,
      } as User)
    const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])

    useEffect(() => {
      setUserInformation(props.user || {} as User)
      setInOutData(props.inOutData || {} as Array<InOutInfo>)
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
        }else if(!userInformation.phone){
          alert('전화번호를 입력해주세요.')
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
            alert(`접수에 성공하였습니다!.\n선착순에 ${saveResult.firstCome ? "성공" : "실패"}하셨습니다!\n페이지를 닫으셔도 됩니다.`)
          }else{
            alert('접수중 오류가 발생하였습니다.')
          }

          localStorage.setItem('token', saveResult.token)
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
          <Stack direction="row" marginTop="10px">
            <Stack minWidth="100px" justifyContent="center" margin="5px">
              전참 / 부참
            </Stack>
          <Select
            fullWidth="true"
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

        <Stack marginTop="10px">
          <Button
              variant="contained"
              onClick={submit}
            >
                저장
            </Button> 
        </Stack>
        <Stack marginTop="10px">
          KB국민은행 63290201441173 (윤대영)
          <br/> 전참 5만 / 부참 3만 / 선착 4만
          <br/> 접수 후 3시간 이내로 입금해주세요!
          <br/>
          <br/> 서비스 이용중 문제 발생시 
          <br/>010-8768-3842로 연락 부탁드립니다.
        </Stack>
    </Stack>)
}


const Field = styled(TextField)({
    marginTop: '12px'
  })