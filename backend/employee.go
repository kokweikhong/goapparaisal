package backend

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"math/rand"
	"path/filepath"
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
	PeformanceSummary map[string]string       `json:"performanceSummary"`
	TrainingComment   string                  `json:"trainingComment"`
}

type ScoreDetail struct {
	Overall float64   `json:"overall"`
	Scores  []float64 `json:"scores"`
	Comment string    `json:"comment"`
}

var scoreDetailItems = []string{"jobKnowledge", "qualityOfWork",
	"quantityOfWork", "teamwork", "responsibility", "initiative", "safety", "attendance"}

var performanceSummaryItems = []string{"strenghtsOfEmployee", "weaknessOfEmployee", "improvementNeeds", "actionPlan"}

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
		employee.PeformanceSummary = make(map[string]string, len(performanceSummaryItems))
		for _, item := range performanceSummaryItems {
			employee.PeformanceSummary[item] = "Nil"
		}
		employee.TrainingComment = "Nil"
		employees = append(employees, employee)
	}
	return employees, nil
}

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

func GenerateAllEmployeeData(data []*Employee) []*Employee {
	for _, d := range data {
		d = GenerateAverageScores(d)
	}
	return data
}

func SaveEmployeeDataToJsonFile(data []*Employee, jsondir string) error {
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}
	date := time.Now().Format("02012006")
	jsonName := fmt.Sprintf("%v-nonexec-appraisal.json", date)
	filename := filepath.Join(jsondir, jsonName)
	if err = ioutil.WriteFile(filename, b, 0644); err != nil {
		return err
	}
	return nil
}

func ReadEmployeeDataFromJsonFile(jsonFile string) ([]*Employee, error) {
	var employees []*Employee
	b, err := ioutil.ReadFile(jsonFile)
	if err != nil {
		return nil, err
	}
	if err = json.Unmarshal(b, &employees); err != nil {
		return nil, err
	}
	return employees, nil
}

func GenerateAverageScores(data *Employee) *Employee {
	if data.Score < 1 && data.Rating < 1 {
		return data
	} else if data.Rating > 1 && data.Score < 1 {
		rand.Seed(time.Now().Unix())
		data.Score = GenerateScoreByRating(data.Rating)
		data.Score = float64(int64(data.Score/0.5+0.5)) * 0.5
	} else if data.Rating < 1 && data.Score > 1 {
		rand.Seed(time.Now().Unix())
		data.Rating = GenerateRatingByScore(data.Score)
	}
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

func GenerateRatingByScore(score float64) int {
	var rating int

	switch true {
	case score >= 90:
		rating = 5
	case score >= 80:
		rating = 4
	case score >= 70:
		rating = 3
	case score >= 50:
		rating = 2
	default:
		rating = 1
	}
	return rating

}

func GenerateScoreByRating(rating int) float64 {
	var min float64
	var max float64
	// v := float64(rand.Intn((maxRand-minRand)/0.05))*0.05 + minRand
	// var score float64
	switch rating {
	case 5:
		min = 90
		max = 100
	case 4:
		min = 80
		max = 89
	case 3:
		min = 70
		max = 79
	case 2:
		min = 50
		max = 69
	default:
		min = 40
		max = 49
	}
	return min + rand.Float64()*(max-min)
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
