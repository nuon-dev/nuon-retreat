import { Router } from "express"
import { Request, Response } from "express"
import { Between, In, Not, IsNull } from "typeorm"
import { AttendData } from "../../entity/attendData"
import { AttendStatus } from "../../entity/types"
import {
  userDatabase,
  communityDatabase,
  attendDataDatabase,
  worshipScheduleDatabase,
} from "../../model/dataSource"

const router = Router()

// 날짜 유틸리티 함수들
const getWeekStart = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

const getWeekEnd = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + 6
  return new Date(d.setDate(diff))
}

const getMonthStart = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getMonthEnd = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// 새가족 판별 함수 (등반 후 6개월)
const isNewFamily = (createAt: Date) => {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  return new Date(createAt) >= sixMonthsAgo
}

// GET /admin/dashboard - 대시보드 데이터 조회
router.get("/", async (req: Request, res: Response) => {
  try {
    const now = new Date()

    // 이번 주/달 범위 계산
    const weekStart = getWeekStart(now)
    const weekEnd = getWeekEnd(now)
    const monthStart = getMonthStart(now)
    const monthEnd = getMonthEnd(now)

    // 3주 전 날짜
    const threeWeeksAgo = new Date()
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21)

    // 기본 통계 (이름이 null이 아닌 사용자만)
    const totalUsers = await userDatabase.count({
      where: {
        name: Not(IsNull()),
      },
    })
    const totalCommunities = await communityDatabase.count()

    // 이번 주 예배 일정 조회
    const weeklySchedules = await worshipScheduleDatabase.find({
      where: {
        date: Between(
          weekStart.toISOString().split("T")[0],
          weekEnd.toISOString().split("T")[0]
        ),
      },
    })

    // 이번 달 예배 일정 조회
    const monthlySchedules = await worshipScheduleDatabase.find({
      where: {
        date: Between(
          monthStart.toISOString().split("T")[0],
          monthEnd.toISOString().split("T")[0]
        ),
      },
    })

    // 이번 주 출석 데이터
    const weeklyAttendance =
      weeklySchedules.length > 0
        ? await attendDataDatabase.find({
            relations: ["worshipSchedule", "user"],
            where: {
              worshipSchedule: {
                id: In(weeklySchedules.map((s) => s.id)),
              },
            },
          })
        : []

    // 이번 달 출석 데이터
    const monthlyAttendance =
      monthlySchedules.length > 0
        ? await attendDataDatabase.find({
            relations: ["worshipSchedule", "user"],
            where: {
              worshipSchedule: {
                id: In(monthlySchedules.map((s) => s.id)),
              },
            },
          })
        : []

    // 통계 계산 함수
    const calculateStats = (attendanceData: AttendData[]) => {
      const attendCount = attendanceData.filter(
        (a) => a.isAttend === AttendStatus.ATTEND
      ).length
      const absentCount = attendanceData.filter(
        (a) => a.isAttend === AttendStatus.ABSENT
      ).length
      const etcCount = attendanceData.filter(
        (a) => a.isAttend === AttendStatus.ETC
      ).length
      const total = attendanceData.length

      const attendPercent =
        total > 0 ? Math.round((attendCount / total) * 100) : 0

      // 성비 계산
      const maleCount = attendanceData.filter(
        (a) => a.user.gender === "man"
      ).length
      const femaleCount = attendanceData.filter(
        (a) => a.user.gender === "woman"
      ).length
      const genderTotal = maleCount + femaleCount
      const malePercent =
        genderTotal > 0 ? Math.round((maleCount / genderTotal) * 100) : 0
      const femalePercent =
        genderTotal > 0 ? Math.round((femaleCount / genderTotal) * 100) : 0

      // 새가족 비율
      const newFamilyCount = attendanceData.filter((a) =>
        isNewFamily(a.user.createAt)
      ).length
      const newFamilyPercent =
        total > 0 ? Math.round((newFamilyCount / total) * 100) : 0

      return {
        attendCount,
        absentCount,
        etcCount,
        attendPercent,
        genderRatio: { male: malePercent, female: femalePercent },
        newFamilyPercent,
      }
    }

    const weeklyStats = calculateStats(weeklyAttendance)
    const monthlyStats = calculateStats(monthlyAttendance)

    // 다락방별 출석 현황 (부모가 있는 커뮤니티만)
    const communities = await communityDatabase.find({
      relations: ["users", "parent"],
      where: {
        parent: Not(IsNull()),
      },
    })

    const communityStats = await Promise.all(
      communities.map(async (community) => {
        // 해당 커뮤니티의 이번 주 출석 데이터
        const communityAttendance =
          weeklySchedules.length > 0
            ? await attendDataDatabase.find({
                relations: ["worshipSchedule", "user", "user.community"],
                where: {
                  worshipSchedule: {
                    id: In(weeklySchedules.map((s) => s.id)),
                  },
                  user: {
                    community: {
                      id: community.id,
                    },
                  },
                },
              })
            : []

        const attendCount = communityAttendance.filter(
          (a) => a.isAttend === AttendStatus.ATTEND
        ).length
        const totalMembers = community.users.length

        return {
          communityName: community.name,
          parentName: community.parent?.name,
          attendCount,
          totalMembers,
          attendanceRate:
            totalMembers > 0
              ? Math.round((attendCount / totalMembers) * 100)
              : 0,
        }
      })
    )

    // 최근 3주간 예배 일정 조회
    const recentSchedules = await worshipScheduleDatabase.find({
      where: {
        date: Between(
          threeWeeksAgo.toISOString().split("T")[0],
          now.toISOString().split("T")[0]
        ),
      },
      order: {
        date: "DESC",
      },
    })

    // 최근 3주간 결석한 인원 조회
    const recentAbsentees =
      recentSchedules.length > 0
        ? await attendDataDatabase.find({
            relations: ["worshipSchedule", "user", "user.community"],
            where: {
              isAttend: AttendStatus.ABSENT,
              worshipSchedule: {
                id: In(recentSchedules.map((s) => s.id)),
              },
            },
            order: {
              worshipSchedule: {
                date: "DESC",
              },
            },
          })
        : []

    // 결석자 정보 정리
    const absenteeInfo = recentAbsentees.map((attend) => ({
      name: attend.user.name,
      yearOfBirth: attend.user.yearOfBirth,
      gender: attend.user.gender,
      community: attend.user.community?.name,
      date: attend.worshipSchedule.date,
      memo: attend.memo,
    }))

    const dashboardData = {
      totalUsers,
      totalCommunities,
      statistics: {
        weekly: weeklyStats,
        monthly: monthlyStats,
      },
      communityStats,
      recentAbsentees: absenteeInfo,
      lastUpdated: new Date().toISOString(),
    }

    res.json(dashboardData)
  } catch (error) {
    console.error("Dashboard data fetch error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /admin/dashboard/stats - 통계 데이터 조회
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const now = new Date()

    // 간단한 통계 정보만 반환 (이름이 null이 아닌 사용자만)
    const userCount = await userDatabase.count({
      where: {
        name: Not(IsNull()),
      },
    })
    const communityCount = await communityDatabase.count()

    // 이번 주 출석률 계산
    const weekStart = getWeekStart(now)
    const weekEnd = getWeekEnd(now)

    const weeklySchedules = await worshipScheduleDatabase.find({
      where: {
        date: Between(
          weekStart.toISOString().split("T")[0],
          weekEnd.toISOString().split("T")[0]
        ),
      },
    })

    const weeklyAttendance =
      weeklySchedules.length > 0
        ? await attendDataDatabase.find({
            relations: ["worshipSchedule"],
            where: {
              worshipSchedule: {
                id: In(weeklySchedules.map((s) => s.id)),
              },
            },
          })
        : []

    const attendCount = weeklyAttendance.filter(
      (a) => a.isAttend === AttendStatus.ATTEND
    ).length
    const totalCount = weeklyAttendance.length
    const attendanceRate =
      totalCount > 0 ? Math.round((attendCount / totalCount) * 100) : 0

    // 활성 사용자 수 (최근 한달 내 출석한 사용자)
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const monthlySchedules = await worshipScheduleDatabase.find({
      where: {
        date: Between(
          oneMonthAgo.toISOString().split("T")[0],
          now.toISOString().split("T")[0]
        ),
      },
    })

    const activeAttendance =
      monthlySchedules.length > 0
        ? await attendDataDatabase.find({
            relations: ["user"],
            where: {
              isAttend: AttendStatus.ATTEND,
              worshipSchedule: {
                id: In(monthlySchedules.map((s) => s.id)),
              },
            },
          })
        : []

    // 중복 제거를 위해 Set 사용
    const uniqueActiveUsers = new Set(activeAttendance.map((a) => a.user.id))
    const activeUsers = uniqueActiveUsers.size

    const stats = {
      userCount,
      communityCount,
      activeUsers,
      attendanceRate,
    }

    res.json(stats)
  } catch (error) {
    console.error("Stats fetch error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
