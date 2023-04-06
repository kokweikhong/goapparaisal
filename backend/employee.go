package backend

import (
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"strconv"
	"strings"
	"time"
)

type Employee struct {
	EmployeeCode      string                  `json:"employeeCode"`
	EmployeeName      string                  `json:"employeeName"`
	Designation       string                  `json:"designation"`
	DateJoin          string                  `json:"dateJoin"`
	Division          string                  `json:"division"`
	Department        string                  `json:"department"`
	Supervisor        string                  `json:"supervisor"`
	PeriodUnderReview string                  `json:"periodUnderReview"`
	Score             float64                 `json:"score"`
	Rating            int                     `json:"rating"`
	ScoreDetails      map[string]*ScoreDetail `json:"scoreDetails"`
}

type ScoreDetail struct {
	Overall float64   `json:"overall"`
	Scores  []float64 `json:"scores"`
	Comment string    `json:"comment"`
}

var scoreDetailItems = []string{"jobKnowledge", "qualityOfWork",
	"quantityOfWork", "teamwork", "responsibility", "initiative", "safety", "attendance"}

// InitEmployeeData is to initialize data and data cleaning
func InitEmployeeData(rows [][]string) ([]*Employee, error) {
	var employees []*Employee
	for _, row := range rows {
		if len(row) < 3 || len(row[0]) < 3 || len(row[1]) < 3 || len(row[10]) < 3 || strings.Contains(row[10], "Apprai") {
			continue
		}
		employee := &Employee{}
		for k := range row {
			switch k {
			case 0:
				employee.EmployeeCode = row[k]
			case 1:
				employee.EmployeeName = row[k]
			case 2:
				employee.Division = row[k]
			case 3:
				employee.Department = row[k]
			case 6:
				employee.Designation = row[k]
			case 8:
				employee.DateJoin = row[k]
			case 10:
				employee.Supervisor = row[k]
			case 12:
				employee.Score, _ = strconv.ParseFloat(row[k], 64)
			case 13:
				employee.Rating, _ = strconv.Atoi(row[k])
			}
		}
		employee.ScoreDetails = make(map[string]*ScoreDetail, len(scoreDetailItems))
		for _, item := range scoreDetailItems {
			employee.ScoreDetails[item] = &ScoreDetail{}
			employee.ScoreDetails[item].Overall = 0
			employee.ScoreDetails[item].Comment = "Nil"
			switch item {
			case "jobKnowledge":
				employee.ScoreDetails[item].Scores = []float64{0, 0, 0, 0, 0}
			case "safety":
				employee.ScoreDetails[item].Scores = []float64{0, 0, 0, 0}
			default:
				employee.ScoreDetails[item].Scores = []float64{0, 0, 0}

			}
		}
		employees = append(employees, employee)
	}
	return employees, nil
}

// func GenerateAverageScores(overall float64, total int) []float64 {
// 	scores := make([]float64, total)
// 	var accumulateScore float64
// 	for i := 0; i < len(scores); i++ {
// 		score := (overall - accumulateScore) / float64((len(scores) - i))
// 		if i == len(scores)-1 {
// 			scores[i] = math.Round((overall-accumulateScore)*10) / 10
// 		} else if i < len(scores) {
// 			scores[i] = math.Round(score*10) / 10
// 		}
// 		accumulateScore += math.Round(score*10) / 10
// 	}
// 	return scores
// }

const (
	COMMENT_JOBKNOWLEDGE = iota + 1
	COMMENT_QUALITYOFWORK
	COMMENT_QUANTITYOFWORK
	COMMENT_INITIATIVE
	COMMENT_TEAMWORK
	COMMENT_RESPONSIBILITY
	COMMENT_SAFETY
	COMMENT_ATTENDANCE
)

func GenerateAverageScores(data *Employee) *Employee {
	totalScore := data.Score * 0.8
	var totalSkip int = 0
	for k, v := range data.ScoreDetails {
		if v.Overall < 1 {
			averageScore := totalScore / float64(len(data.ScoreDetails)-totalSkip)
			v.Overall = math.Round(averageScore*10) / 10
		}
		for s := range v.Scores {
			v.Scores[s] = v.Overall
		}
		totalScore -= v.Overall
		totalSkip++
		switch true {
		case strings.Contains(strings.ToLower(k), "jobknow"):
			v.Comment = GetScoreDetailComment(v.Overall, COMMENT_JOBKNOWLEDGE)
		case strings.Contains(strings.ToLower(k), "quality"):
			v.Comment = GetScoreDetailComment(v.Overall, COMMENT_QUALITYOFWORK)
		case strings.Contains(strings.ToLower(k), "quantity"):
			v.Comment = GetScoreDetailComment(v.Overall, COMMENT_QUANTITYOFWORK)
		case strings.Contains(strings.ToLower(k), "teamwork"):
			v.Comment = GetScoreDetailComment(v.Overall, COMMENT_TEAMWORK)
		case strings.Contains(strings.ToLower(k), "initiative"):
			v.Comment = GetScoreDetailComment(v.Overall, COMMENT_INITIATIVE)
		case strings.Contains(strings.ToLower(k), "safe"):
			v.Comment = GetScoreDetailComment(v.Overall, COMMENT_SAFETY)
		case strings.Contains(strings.ToLower(k), "responsi"):
			v.Comment = GetScoreDetailComment(v.Overall, COMMENT_RESPONSIBILITY)
		case strings.Contains(strings.ToLower(k), "attendance"):
			v.Comment = GetScoreDetailComment(v.Overall, COMMENT_ATTENDANCE)
        default:
            v.Comment = "Nil"
		}
	}
	return data
}

func GetScoreDetailComment(score float64, category int) string {
	var comments Comment
	result := "Nil"
	switch category {
	case COMMENT_JOBKNOWLEDGE:
		comments = ScoreComments.JobKnowledge
	case COMMENT_RESPONSIBILITY:
		comments = ScoreComments.Responsiblity
	case COMMENT_SAFETY:
		comments = ScoreComments.Safety
	case COMMENT_TEAMWORK:
		comments = ScoreComments.Teamwork
	case COMMENT_ATTENDANCE:
		comments = ScoreComments.Attendance
	case COMMENT_INITIATIVE:
		comments = ScoreComments.Initiative
	case COMMENT_QUALITYOFWORK:
		comments = ScoreComments.QualityOfWork
	case COMMENT_QUANTITYOFWORK:
		comments = ScoreComments.QuantityOfWork
	default:
		return result
	}
	var commentsByGrade = []string{}
	switch true {
	case score >= 9:
		commentsByGrade = comments.Grade5
	case score >= 8:
		commentsByGrade = comments.Grade4
	case score >= 7:
		commentsByGrade = comments.Grade3
	case score >= 5:
		commentsByGrade = comments.Grade2
	default:
		commentsByGrade = comments.Grade1
	}
	// set seed
	// generate random number and print on console
	if len(commentsByGrade) > 1 {
		rand.Seed(time.Now().Unix())
		// index := rand.Intn(len(commentsByGrade))
		index := rand.Int() % len(commentsByGrade)
		result = commentsByGrade[index]
        fmt.Println(result)
	}
    fmt.Println(result)
	return result
}

func ResetScoreDetails(data interface{}) (*ScoreDetail, error) {
	var scoreDetail *ScoreDetail
	b, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	if err = json.Unmarshal(b, &scoreDetail); err != nil {
		return nil, err
	}
	scoreDetail.Overall = 0
	for k := range scoreDetail.Scores {
		scoreDetail.Scores[k] = 0
	}
	scoreDetail.Comment = "Nil"
	return scoreDetail, nil
}

func GenerateScoreDetails(data interface{}) (*ScoreDetail, error) {
	fmt.Println(data)
	var scoreDetail *ScoreDetail
	b, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}
	if err = json.Unmarshal(b, &scoreDetail); err != nil {
		return nil, err
	}
	totalScore := scoreDetail.Overall * float64(len(scoreDetail.Scores))
	var skip []int
	// for k, score := range scoreDetail.Scores {
	// 	if score > 0 {
	// 		totalScore -= score
	// 		skip = append(skip, k)
	// 	}
	// }
	for k := range scoreDetail.Scores {
		if scoreDetail.Scores[k] > 0 {
			totalScore -= scoreDetail.Scores[k]
			skip = append(skip, k)
			continue
		}
		averageScore := totalScore / float64(len(scoreDetail.Scores)-len(skip))
		scoreDetail.Scores[k] = math.Round(averageScore*100) / 100
		totalScore -= math.Round(averageScore*100) / 100
		skip = append(skip, k)
	}
	fmt.Println(scoreDetail)
	return scoreDetail, nil
}
