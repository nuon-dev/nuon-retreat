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
import { NotificationMessage } from "state/notification";
import { useSetRecoilState } from "recoil";
import { HowToGo, MoveType } from "types";
interface IProps {
    user: User
    inOutData: Array<InOutInfo>
}

export default function UserInformationForm (props: IProps) {
    const [userInformation, setUserInformation] = useState(new User())
    const [inOutData, setInOutData] = useState<Array<InOutInfo>>([])
    const [showItems, setShowItems] = useState(false)
    const setNotificationMessage = useSetRecoilState(NotificationMessage)

    useEffect(() => {
      setUserInformation(props.user || {} as User)
      setInOutData(props.inOutData || {} as Array<InOutInfo>)
      if(props.user && props.user.id){
        setShowItems(true)
      }
    },[props.user])

    const changeInformation = (type: string, data: string) => {
      setUserInformation({...userInformation, [type]: data})
    }

    const submit = async () => {
        if(!userInformation.name){
          setNotificationMessage('이름을 입력해주세요.')
          return
        }else if(!userInformation.age){
          setNotificationMessage('나이를 입력해주세요.')
          return
        }else if(!userInformation.attendType){
          setNotificationMessage('전참 여부를 선택해주세요.')
          return
        }else if(!userInformation.sex){
          setNotificationMessage('성별을 선택해주세요.')
          return
        }else if(!userInformation.phone){
          setNotificationMessage('전화번호를 입력해주세요.')
          return
        }else if(userInformation.attendType === AttendType.full && !userInformation.howToGo){
          setNotificationMessage('이동 방법을 선택해주세요.')
          return
        }

        const url = '/auth/edit-user'

        const saveResult = await post(url, userInformation)
        let attendTimeResult;
          // @ts-ignore 
          if(inOutData.length > 0 && userInformation.howToGo !== HowToGo.together){
            attendTimeResult = await post('/info/save-attend-time', {
              userId: saveResult.userId,
              inOutData,
            })
          }

          if(saveResult.result === "success"){
            localStorage.setItem('token', saveResult.token)
          }else{
            setNotificationMessage('접수중 오류가 발생하였습니다.\n다시 시도해주세요.')
            return
          }

          if(attendTimeResult && attendTimeResult.result !== "success"){
            setNotificationMessage('참가 일정 내역 저장중에 문제가 발생하였습니다.\n시간, 장소. 이동방법을 모두 입력해주세요.')
            return
          }
          setNotificationMessage(`신청 내역이 저장이 되었습니다.`)
    }

    function getInputGap(){
      return <Stack margin="6px" />
    }

    function getLabelGap(){
      return <Stack margin="2px" />
    }

    return (<Stack
        padding="6px"
        minWidth="360px"
      >
        <Stack>
          {getInputGap()}
          <Stack>
            이름
          </Stack>
          {getLabelGap()}
          <TextField
              fullWidth={true}
              value={userInformation.name}
              placeholder="이름을 입력하세요."
              onChange={e => changeInformation("name", e.target.value)}
            />
        </Stack>
        {getInputGap()}
        <Stack>
          <Stack 
            width="80px"
            justifyContent="center"
          >
            나이
          </Stack>
          {getLabelGap()}
          <TextField
            type="number"
            fullWidth={true}
            placeholder="나이를 입력하세요."
            value={userInformation.age}
            onChange={e => changeInformation("age", e.target.value)}
          />
          </Stack>
          {getInputGap()}
          <Stack>
          <Stack 
            width="80px"
            justifyContent="center"
          >
            성별
          </Stack>
          {getLabelGap()}
          <FormControl
            fullWidth={true}>
            {// @ts-ignore 
              showItems &&
              <Select
                value={userInformation.sex}
                defaultValue={userInformation.sex}
                placeholder="성별을 선택하세요."
                onChange={e => changeInformation("sex", e.target.value)}
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
        {getInputGap()}
        <Stack>
          {// @ts-ignore 
            showItems &&
          <Stack >
            <Stack minWidth="100px" justifyContent="center">
              전참 / 부참
            </Stack>
            {getLabelGap()}
            <Select
              fullWidth={true}
              value={userInformation.attendType}
              defaultValue={userInformation.attendType}
              placeholder="참여 시간을 선택하세요."
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
          {// @ts-ignore 
            userInformation.attendType === AttendType.full &&
            <Stack ml="10px">
              {getInputGap()}
              <Stack minWidth="100px" justifyContent="center" >
                이동 방법
              </Stack>
              {getLabelGap()}
              <Select 
                fullWidth={true}
                defaultValue={userInformation.howToGo}
                value={userInformation.howToGo}
                onChange={e => changeInformation("howToGo", e.target.value.toString())}
              >  
                <MenuItem value={HowToGo.together.toString()}>
                  교회 버스로만 이동
                </MenuItem>
                <MenuItem value={HowToGo.car.toString()}>
                  기타 (카풀 이용 또는 제공)
                </MenuItem>
              </Select>
            </Stack>
          }
          {// @ts-ignore 
            (userInformation.howToGo === HowToGo.car.toString() || userInformation.attendType === AttendType.half )&&
            <Stack ml="10px">
              <InOutFrom
                setInOutData={setInOutData}
                inOutData={inOutData}
              />
            </Stack>
          }
        </Stack>
        {getInputGap()}
        <Stack>
          <Stack 
            width="80px"
            justifyContent="center"
          >
            전화번호
          </Stack>
          {getLabelGap()}
          <TextField
            fullWidth={true}
            value={userInformation.phone}
            placeholder="전화번호를 입력하세요."
            onChange={e => changeInformation("phone", e.target.value)}
            />
        </Stack>
        {getInputGap()}
        <Stack >
          <Stack 
            width="80px"
            justifyContent="center"
          >
            기타사항
          </Stack>
          {getLabelGap()}
          <TextField
            fullWidth={true}
            value={userInformation.etc}
            placeholder="기타사항이 있을 경우 입력하세요."
            onChange={e => changeInformation("etc", e.target.value)}
          />
        </Stack>
        {getInputGap()}
          
        <Stack marginTop="10px">
          <Button
              variant="contained"
              onClick={submit}
            >
                저장
            </Button> 
        </Stack>
    </Stack>)
}