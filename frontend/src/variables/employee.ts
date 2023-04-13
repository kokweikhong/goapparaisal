import { Dispatch, SetStateAction } from "react"

export interface IScoreDetails {
  overall: number
  scores: number[]
  comment: string
}

export interface IEmployee {
  dateJoin: string
  department: string
  designation: string
  division: string
  employeeCode: string
  employeeName: string
  periodUnderReview: string
  rating: number
  score: number
  supervisor: string
  scoreDetails: {
    initiative: IScoreDetails
    jobKnowledge: IScoreDetails
    qualityOfWork: IScoreDetails
    quantityOfWork: IScoreDetails
    responsibility: IScoreDetails
    safety: IScoreDetails
    teamwork: IScoreDetails
    attendance: IScoreDetails
  }
  performanceSummary: {
    strengthsOfEmployee: string
    weaknessOfEmployee: string
    improvementNeeds: string
    actionPlan: string
  }
  trainingComment: string
}

export interface IEmployeeProps {
  data: {
    raw: IEmployee[]
    filtered: IEmployee[]
  }
  setData: Dispatch<SetStateAction<IEmployeeProps>>
}

export const initialEmployeeData: IEmployee = {
  "employeeCode": "NA",
  "employeeName": "NA",
  "designation": "NA",
  "dateJoin": "NA",
  "division": "NA",
  "department": "NA",
  "supervisor": "NA",
  "periodUnderReview": "NA",
  "score": 0,
  "rating": 0,
  "scoreDetails": {
    "initiative": {
      "overall": 0,
      "scores": [
        0,
        0,
        0
      ],
      "comment": "Nil"
    },
    "jobKnowledge": {
      "overall": 0,
      "scores": [
        0,
        0,
        0,
        0,
        0
      ],
      "comment": "Nil"
    },
    "qualityOfWork": {
      "overall": 0,
      "scores": [
        0,
        0,
        0
      ],
      "comment": "Nil"
    },
    "quantityOfWork": {
      "overall": 0,
      "scores": [
        0,
        0,
        0
      ],
      "comment": "Nil"
    },
    "responsibility": {
      "overall": 0,
      "scores": [
        0,
        0,
        0
      ],
      "comment": "Nil"
    },
    "safety": {
      "overall": 0,
      "scores": [
        0,
        0,
        0,
        0
      ],
      "comment": "Nil"
    },
    "teamwork": {
      "overall": 0,
      "scores": [
        0,
        0,
        0
      ],
      "comment": "Nil"
    },
    "attendance": {
      "overall": 0,
      "scores": [
        0,
        0,
        0
      ],
      "comment": "Nil"
    }
  },
  "performanceSummary": {
    "strengthsOfEmployee": "Nil",
    "weaknessOfEmployee": "Nil",
    "improvementNeeds": "Nil",
    "actionPlan": "Nil",
  },
  "trainingComment": "Nil",
}
