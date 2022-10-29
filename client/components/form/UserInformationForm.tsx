import styled from "@emotion/styled";
import { Button, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField, TextFieldProps } from "@mui/material";
import { Stack } from "@mui/system";
import { InOutInfo } from "@server/src/entity/inOutInfo";
import { User } from "@server/src/entity/user";
import { post } from "pages/api";
import { useEffect, useState } from "react";
import InOutFrom from "./InOutForm";

//Todo: server와 합치기
enum AttendType {
  full = 'full',
  half = 'half',
}

const enum MoveType {
  Together,
  driveCar,
  rideCar,
  goAlone,
}

interface IProps {
    user?: User
}

export default function UserInformationForm (props: IProps) {
    const [userInformation, setUserInformation] = useState(
      {
        name: 'test',
        password: '1234',
        attendType: AttendType.half
      } as User)
    const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])

    useEffect(() => {
        setUserInformation(props.user || {} as User)
    },[])

    const changeInformation = (type: string, data: string) => {
      setUserInformation({...userInformation, [type]: data})
    }

    const submit = async () => {
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
        {userInformation.attendType === AttendType.half &&
          <InOutFrom
            setInOutData={setInOutData}
            inOutData={inOutData}
          />
        }
            <RadioGroup
              onChange={e => changeInformation("howToMove", e.target.value.toString())}
            >
              <FormLabel>이동 방법</FormLabel>
              <FormControlLabel value={MoveType.Together} control={<Radio/>} label="같이 이동" />
              <FormControlLabel value={MoveType.driveCar} control={<Radio/>} label="자차 이동" />
              {userInformation.attendType !== AttendType.full 
                && <FormControlLabel value={MoveType.rideCar} control={<Radio/>} label="카풀 이동" />}
              {userInformation.attendType !== AttendType.full 
                && <FormControlLabel value={MoveType.goAlone} control={<Radio/>} label="대중교통" />}
              
          </RadioGroup>
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