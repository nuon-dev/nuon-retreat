import { Button, 
  MenuItem, 
  InputLabel,
  Select, 
  FormControl,
  TextField, } from "@mui/material";
import { Stack } from "@mui/system";
import { InOutInfo } from "@entity/inOutInfo";
import { User } from "@entity/user";
import { post } from "../../pages/api";
import { useEffect, useState } from "react";
import { AttendType } from "@entity/types";
import InOutFrom from "./InOutForm";
interface IProps {
    user?: User
    inOutData: Array<InOutInfo>
}

export default function UserInformationForm (props: IProps) {
    const [userInformation, setUserInformation] = useState(new User())
    const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])
    const [showItems, setShowItems] = useState(false)

    useEffect(() => {
      setUserInformation(props.user || {} as User)
      setInOutData(props.inOutData || {} as Array<InOutInfo>)
      setShowItems(true)
    },[])

    const changeInformation = (type: string, data: string) => {
      setUserInformation({...userInformation, [type]: data})
    }

    const submit = async () => {
        if(!userInformation.name){
          alert('이름을 입력해주세요.')
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
        }else if(userInformation.attendType === AttendType.full && !userInformation.howToGo){
          alert('이동 방법을 선택해주세요.')
          return
        }

        const url = userInformation.id ? '/auth/edit-user' : '/auth/join'

        const saveResult = await post(url, userInformation)
        let attendTimeResult;
          // @ts-ignore 
          if(inOutData.length > 0){
            attendTimeResult = await post('/info/save-attend-time', {
              userId: saveResult.userId,
              inOutData,
            })
          }

          if(saveResult.result === "success"){
            localStorage.setItem('token', saveResult.token)
          }else{
            alert('접수중 오류가 발생하였습니다.\n다시 시도해주세요.')
            return
          }

          if(attendTimeResult && attendTimeResult.result !== "success"){
            alert('참가 일정 내역 저장중에 문제가 발생하였습니다.\n시간, 장소. 이동방법을 모두 입력해주세요.')
            return
          }

          if(userInformation.id){
            alert(`수정 완료되었습니다.`)
          }else{
            alert(`접수에 성공하였습니다!.\n선착순에 ${saveResult.firstCome ? "성공" : "실패"}하셨습니다!\n페이지를 닫으셔도 됩니다.`)
          }
          location.reload()
    }

    const validation = {
      name: userInformation?.name?.length === 0,
      password: userInformation?.password?.length === 0,
    }

    return (<Stack>
        <Stack marginTop="12px"/>
        <Stack direction="row">
          <Stack 
            width="80px"
            justifyContent="center"
            style={{
              marginLeft: "12px"
            }}
          >
            이름
          </Stack>
          <TextField
              fullWidth={true}
              value={userInformation.name}
              error={validation.name}
              helperText={validation.name && "이름을 입력하세요"}
              onChange={e => changeInformation("name", e.target.value)}
            />
        </Stack>
          <Stack margin="6px"/>
        {!userInformation.id && (
        <Stack direction="row">
          <Stack 
            width="80px"
            justifyContent="center"
            style={{
              marginLeft: "12px"
            }}
          >
            비밀번호
          </Stack>
          <TextField
            fullWidth={true}
            type="password"
            error={validation.password}
            helperText={validation.password && "비밀번호를 입력하세요"}
            onChange={e => changeInformation("password", e.target.value)}
          />
        </Stack>
        )}
        <Stack margin="6px"/>

        <Stack direction="row">
          <Stack 
            width="80px"
            justifyContent="center"
            style={{
              marginLeft: "12px"
            }}
          >
            나이
          </Stack>
          <TextField
            type="number"
            fullWidth={true}
            value={userInformation.age}
            onChange={e => changeInformation("age", e.target.value)}
          />
          </Stack>
        <Stack margin="6px"/>
        <Stack direction="row">
          <Stack 
            width="80px"
            justifyContent="center"
            style={{
              marginLeft: "12px"
            }}
          >
            성별
          </Stack>
          <FormControl
            fullWidth={true}>
            {// @ts-ignore 
              showItems &&
              <Select
                value={userInformation.sex}
                defaultValue={userInformation.sex}
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
              </Select>}
          </FormControl>
        </Stack>
        <Stack margin="6px"/>
        <Stack>
          {// @ts-ignore 
            showItems &&
          <Stack direction="row" marginTop="10px">
            <Stack minWidth="100px" justifyContent="center" margin="5px">
              전참 / 부참
            </Stack>
            <Select
              fullWidth={true}
              defaultValue={userInformation.attendType}
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
          </Stack>}
        <Stack margin="6px"/>
          {// @ts-ignore 
            userInformation.attendType === AttendType.full &&
            <Stack direction="row">
              <Stack minWidth="100px" justifyContent="center" margin="5px">
                이동 방법
              </Stack>
              <Select 
                fullWidth={true}
                defaultValue={userInformation.howToGo}
                value={userInformation.howToGo}
                label="이동 방법"
                onChange={e => changeInformation("howToGo", e.target.value.toString())}
              >  
                <MenuItem value="together">
                  교회 버스로만 이동
                </MenuItem>
                <MenuItem value="car">
                  기타 (카풀 이용 또는 제공)
                </MenuItem>
              </Select>
            </Stack>
          }
          {// @ts-ignore 
            (userInformation.howToGo === "car" || userInformation.attendType === AttendType.half )&&
            <InOutFrom
              setInOutData={setInOutData}
              inOutData={inOutData}
            />
          }
        </Stack>
        <Stack margin="12px"/>

        <Stack direction="row">
          <Stack 
            width="80px"
            justifyContent="center"
            style={{
              marginLeft: "12px"
            }}
          >
            전화번호
          </Stack>
          <TextField
            fullWidth={true}
            value={userInformation.phone}
            onChange={e => changeInformation("phone", e.target.value)}
            />
        </Stack>
        <Stack margin="6px"/>
        <Stack direction="row">
          <Stack 
            width="80px"
            justifyContent="center"
            style={{
              marginLeft: "12px"
            }}
          >
            기타사항
          </Stack>
          <TextField
            fullWidth={true}
            value={userInformation.etc}
            onChange={e => changeInformation("etc", e.target.value)}
          />
        </Stack>

        <Stack marginTop="10px">
          <Button
              variant="contained"
              onClick={submit}
            >
                저장
            </Button> 
        </Stack>
        <Stack alignItems="center" textAlign="center" marginTop="10px">
          KB국민은행 63290201441173 (윤대영)
          <br/>전참 5만 / 부참 3만 / 선착 4만
          <br/>접수 후 3시간 이내로 입금해주세요!
          <br/>
          <br/>선착순 80명 4만원
          <br/>(신청하시면 선착순 성공 여부가 뜹니다.
          <br/>못 보셨을 경우 정보 수정으로 들어가주세요.)
          <br/>
          <br/>궁금한 점은 순장에게 문의하세요
        </Stack>
    </Stack>)
}