package backend

import (
	"bytes"
	"embed"
	"fmt"
	"io"
	"log"
	"path/filepath"
	"strings"

	"github.com/signintech/gopdf"
)

//go:embed appraisal_template.pdf
var templateAppraisal embed.FS

//go:embed Roboto-Regular.ttf
var roboto embed.FS

func GenerateNonExecAppraisalPDF(data *Employee, dir string) error {
	pdf := &gopdf.GoPdf{}
	pdf.Start(gopdf.Config{
		PageSize: gopdf.Rect{W: 841.89, H: 595.28},
	})

	pdf.AddPage()
    font, err := roboto.ReadFile("Roboto-Regular.ttf")
    if err != nil {
        log.Fatal(err)
    }
	if err = pdf.AddTTFFontData("Roboto", font); err != nil {
        return err
    }
	pdf.SetFont("Roboto", "", 7)

	b, err := templateAppraisal.ReadFile("appraisal_template.pdf")
	if err != nil {
        return err
	}

	tplSeeker := io.ReadSeeker(bytes.NewReader(b))

	tpl := pdf.ImportPageStream(&tplSeeker, 1, "/MediaBox")
	pdf.UseImportedTemplate(tpl, 0, 0, 841.89, 595.28)

    pdf.SetFontSize(7)
	addPage1(pdf, data)
	addPage4(pdf, data)

	pdf.AddPage()
	tpl2 := pdf.ImportPageStream(&tplSeeker, 2, "/MediaBox")
	pdf.UseImportedTemplate(tpl2, 0, 0, 841.89, 595.28)

    pdf.SetFontSize(7)
	addPage2(pdf, data)
	addPage3(pdf, data)

	restricted := []string{"~", "\"", "#", "%", "&", "*", ":", "<", ">", "?", "/", "\\", "{", "|", "}", "."}
	editedName := data.EmployeeName
	for _, r := range restricted {
		editedName = strings.ReplaceAll(editedName, r, "")
	}
    year := "unknown"
    if len(data.PeriodUnderReview) > 4 {
        year = data.PeriodUnderReview[len(data.PeriodUnderReview)-4:]
    }

    // year = data.PeriodUnderReview[len(data.PeriodUnderReview)-3:]
    filename, err := filepath.Abs(filepath.Join(filepath.Clean(dir), fmt.Sprintf("%v-%v-%v.pdf",year, data.EmployeeCode, editedName)))
    if err != nil {
        return err
    }

	if err = pdf.WritePdf(filename); err != nil {
        return err
    }

    return nil
}

func addPage1(pdf *gopdf.GoPdf, data *Employee) {
	pdf.SetFontSize(7)
	pdf.SetXY(480, 55)
	names := splitTextToWordWrap(pdf, data.EmployeeName, 150)
	if len(names) < 2 {
		pdf.SetXY(480, 63)
		pdf.Text(data.EmployeeName)
	} else {
		for _, t := range splitTextToWordWrap(pdf, data.EmployeeName, 150) {
			pdf.Text(t)
			pdf.SetY(pdf.GetY() + 0.5)
		}
	}

	pdf.SetXY(480, 77)
	pdf.Text(data.Designation)

	pdf.SetXY(480, 91)
	pdf.Text(data.Division)

	pdf.SetXY(490, 105)
	pdf.Text(data.PeriodUnderReview)

	pdf.SetXY(690, 63)
	pdf.Text(data.EmployeeCode)

	pdf.SetXY(690, 77)
	pdf.Text(data.DateJoin)

	pdf.SetXY(690, 91)
	pdf.Text(data.Department)

	pdf.SetFontSize(8)

	jobKnowledge := data.ScoreDetails["jobKnowledge"]
	pdf.SetXY(621, 211)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[0]))
	pdf.SetXY(621, 232)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[1]))
	pdf.SetXY(621, 253)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[2]))
	pdf.SetXY(621, 275)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[3]))
	pdf.SetXY(621, 295)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[4]))
	pdf.SetXY(621, 320)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Overall))
	var totalScore float64
	for _, s := range jobKnowledge.Scores {
		totalScore += s
	}
	pdf.SetXY(576, 320)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))

	pdf.SetXY(650, 200)
	comments := splitTextToWordWrap(pdf, jobKnowledge.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(650, pdf.GetY()+10)
	}

	qualityOfWork := data.ScoreDetails["qualityOfWork"]
	pdf.SetXY(621, 369)
	pdf.Text(fmt.Sprintf("%.2f", qualityOfWork.Scores[0]))
	pdf.SetXY(621, 390)
	pdf.Text(fmt.Sprintf("%.2f", qualityOfWork.Scores[1]))
	pdf.SetXY(621, 411)
	pdf.Text(fmt.Sprintf("%.2f", qualityOfWork.Scores[2]))
	pdf.SetXY(621, 433)
	pdf.Text(fmt.Sprintf("%.2f", qualityOfWork.Overall))
	totalScore = 0
	for _, s := range qualityOfWork.Scores {
		totalScore += s
	}
	pdf.SetXY(576, 432)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(650, 365)
	comments = splitTextToWordWrap(pdf, qualityOfWork.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(650, pdf.GetY()+10)
	}

	quantityOfWork := data.ScoreDetails["quantityOfWork"]
	pdf.SetXY(621, 498)
	pdf.Text(fmt.Sprintf("%.2f", quantityOfWork.Scores[0]))
	pdf.SetXY(621, 519)
	pdf.Text(fmt.Sprintf("%.2f", quantityOfWork.Scores[1]))
	pdf.SetXY(621, 540)
	pdf.Text(fmt.Sprintf("%.2f", quantityOfWork.Scores[2]))
	pdf.SetXY(621, 562)
	pdf.Text(fmt.Sprintf("%.2f", quantityOfWork.Overall))
	totalScore = 0
	for _, s := range quantityOfWork.Scores {
		totalScore += s
	}
	pdf.SetXY(576, 562)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(650, 495)
	comments = splitTextToWordWrap(pdf, quantityOfWork.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(650, pdf.GetY()+10)
	}
}


func addPage2(pdf *gopdf.GoPdf, data *Employee) {

	teamwork := data.ScoreDetails["teamwork"]
	pdf.SetXY(214, 70)
	pdf.Text(fmt.Sprintf("%.2f", teamwork.Scores[0]))
	pdf.SetXY(214, 92)
	pdf.Text(fmt.Sprintf("%.2f", teamwork.Scores[1]))
	pdf.SetXY(214, 116)
	pdf.Text(fmt.Sprintf("%.2f", teamwork.Scores[2]))
	pdf.SetXY(214, 143)
	pdf.Text(fmt.Sprintf("%.2f", teamwork.Overall))
	var totalScore float64
	for _, s := range teamwork.Scores {
		totalScore += s
	}
	pdf.SetXY(163, 143)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(250, 65)
	comments := splitTextToWordWrap(pdf, teamwork.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(250, pdf.GetY()+10)
	}

	responsibility := data.ScoreDetails["responsibility"]
	pdf.SetXY(214, 205)
	pdf.Text(fmt.Sprintf("%.2f", responsibility.Scores[0]))
	pdf.SetXY(214, 229)
	pdf.Text(fmt.Sprintf("%.2f", responsibility.Scores[1]))
	pdf.SetXY(214, 252)
	pdf.Text(fmt.Sprintf("%.2f", responsibility.Scores[2]))
	pdf.SetXY(214, 277)
	pdf.Text(fmt.Sprintf("%.2f", responsibility.Overall))
	totalScore = 0
	for _, s := range teamwork.Scores {
		totalScore += s
	}
	pdf.SetXY(163, 277)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(250, 200)
	comments = splitTextToWordWrap(pdf, responsibility.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(250, pdf.GetY()+10)
	}

	initiative := data.ScoreDetails["initiative"]
	pdf.SetXY(214, 334)
	pdf.Text(fmt.Sprintf("%.2f", initiative.Scores[0]))
	pdf.SetXY(214, 357)
	pdf.Text(fmt.Sprintf("%.2f", initiative.Scores[1]))
	pdf.SetXY(214, 382)
	pdf.Text(fmt.Sprintf("%.2f", initiative.Scores[2]))
	pdf.SetXY(214, 412)
	pdf.Text(fmt.Sprintf("%.2f", initiative.Overall))
	totalScore = 0
	for _, s := range initiative.Scores {
		totalScore += s
	}
	pdf.SetXY(163, 412)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(250, 330)
	comments = splitTextToWordWrap(pdf, initiative.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(250, pdf.GetY()+10)
	}

	safety := data.ScoreDetails["safety"]
	pdf.SetXY(214, 465)
	pdf.Text(fmt.Sprintf("%.2f", safety.Scores[0]))
	pdf.SetXY(214, 489)
	pdf.Text(fmt.Sprintf("%.2f", safety.Scores[1]))
	pdf.SetXY(214, 512)
	pdf.Text(fmt.Sprintf("%.2f", safety.Scores[2]))
	pdf.SetXY(214, 535)
	pdf.Text(fmt.Sprintf("%.2f", safety.Scores[3]))
	pdf.SetXY(214, 560)
	pdf.Text(fmt.Sprintf("%.2f", safety.Overall))
	totalScore = 0
	for _, s := range safety.Scores {
		totalScore += s
	}
	pdf.SetXY(163, 560)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(250, 462)
	comments = splitTextToWordWrap(pdf, safety.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(250, pdf.GetY()+10)
	}
}

func addPage3(pdf *gopdf.GoPdf, data *Employee) {

	attendance := data.ScoreDetails["attendance"]
	pdf.SetXY(602, 66)
	pdf.Text(fmt.Sprintf("%.2f", attendance.Scores[0]))
	pdf.SetXY(602, 92)
	pdf.Text(fmt.Sprintf("%.2f", attendance.Scores[1]))
	pdf.SetXY(602, 116)
	pdf.Text(fmt.Sprintf("%.2f", attendance.Scores[2]))
	pdf.SetXY(602, 143)
	pdf.Text(fmt.Sprintf("%.2f", attendance.Overall))
	var totalScore float64
	for _, s := range attendance.Scores {
		totalScore += s
	}
	pdf.SetXY(552, 143)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(635, 61)
	comments := splitTextToWordWrap(pdf, attendance.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(635, pdf.GetY()+10)
	}

	totalScore = 0
	for _, v := range data.ScoreDetails {
		totalScore += v.Overall
	}
	pdf.SetXY(672, 175)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))

	pdf.SetXY(752, 175)
	pdf.Text(fmt.Sprintf("%.2f", data.Score))

	pdf.SetXY(440, 257)
	comment := data.PeformanceSummary["strenghtsOfEmployee"]
	comments = splitTextToWordWrap(pdf, comment, 330)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(440, pdf.GetY()+10)
	}

	pdf.SetXY(440, 337)
	comment = data.PeformanceSummary["weaknessOfEmployee"]
	comments = splitTextToWordWrap(pdf, comment, 330)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(440, pdf.GetY()+10)
	}

	pdf.SetXY(440, 427)
	comment = data.PeformanceSummary["improvementNeeds"]
	comments = splitTextToWordWrap(pdf, comment, 300)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(440, pdf.GetY()+10)
	}

	pdf.SetXY(440, 514)
	comment = data.PeformanceSummary["actionPlan"]
	comments = splitTextToWordWrap(pdf, comment, 300)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(440, pdf.GetY()+10)
	}
}

func addPage4(pdf *gopdf.GoPdf, data *Employee) {

	pdf.SetXY(60, 50)
	pdf.Text(data.TrainingComment)

	pdf.SetFontSize(20)
	tick := "√"
	switch data.Rating {
	case 5:
		pdf.SetXY(65, 185)
	case 4:
		pdf.SetXY(65, 210)
	case 3:
		pdf.SetXY(65, 235)
	case 2:
		pdf.SetXY(225, 185)
	default:
		pdf.SetXY(225, 210)
	}
	pdf.Text(tick)

    pdf.SetFontSize(7)
    pdf.SetXY(62, 495)
    pdf.Text(data.Supervisor)

}

func splitTextToWordWrap(pdf *gopdf.GoPdf, text string, width float64) []string {
	wordWrap, err := pdf.SplitTextWithWordWrap(text, width)
	if err != nil {
		log.Println(err)
		return []string{}
	}
	return wordWrap
}
