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

	pdf.SetXY(695, 63)
	pdf.Text(data.EmployeeCode)

	pdf.SetXY(695, 77)
	pdf.Text(data.DateJoin)

	pdf.SetXY(695, 91)
	pdf.Text(data.Department)

	jobKnowledge := data.ScoreDetails["jobKnowledge"]
	pdf.SetXY(626, 211)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[0]))
	pdf.SetXY(626, 232)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[1]))
	pdf.SetXY(626, 253)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[2]))
	pdf.SetXY(626, 275)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[3]))
	pdf.SetXY(626, 295)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Scores[4]))
	pdf.SetXY(626, 320)
	pdf.Text(fmt.Sprintf("%.2f", jobKnowledge.Overall))
	var totalScore float64
	for _, s := range jobKnowledge.Scores {
		totalScore += s
	}
	pdf.SetXY(581, 320)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))

	pdf.SetXY(655, 200)
	comments := splitTextToWordWrap(pdf, jobKnowledge.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(655, pdf.GetY()+10)
	}

	qualityOfWork := data.ScoreDetails["qualityOfWork"]
	pdf.SetXY(626, 369)
	pdf.Text(fmt.Sprintf("%.2f", qualityOfWork.Scores[0]))
	pdf.SetXY(626, 390)
	pdf.Text(fmt.Sprintf("%.2f", qualityOfWork.Scores[1]))
	pdf.SetXY(626, 411)
	pdf.Text(fmt.Sprintf("%.2f", qualityOfWork.Scores[2]))
	pdf.SetXY(626, 433)
	pdf.Text(fmt.Sprintf("%.2f", qualityOfWork.Overall))
	totalScore = 0
	for _, s := range qualityOfWork.Scores {
		totalScore += s
	}
	pdf.SetXY(581, 432)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(655, 365)
	comments = splitTextToWordWrap(pdf, qualityOfWork.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(655, pdf.GetY()+10)
	}

	quantityOfWork := data.ScoreDetails["quantityOfWork"]
	pdf.SetXY(626, 498)
	pdf.Text(fmt.Sprintf("%.2f", quantityOfWork.Scores[0]))
	pdf.SetXY(626, 519)
	pdf.Text(fmt.Sprintf("%.2f", quantityOfWork.Scores[1]))
	pdf.SetXY(626, 540)
	pdf.Text(fmt.Sprintf("%.2f", quantityOfWork.Scores[2]))
	pdf.SetXY(626, 562)
	pdf.Text(fmt.Sprintf("%.2f", quantityOfWork.Overall))
	totalScore = 0
	for _, s := range quantityOfWork.Scores {
		totalScore += s
	}
	pdf.SetXY(581, 562)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(655, 495)
	comments = splitTextToWordWrap(pdf, quantityOfWork.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(655, pdf.GetY()+10)
	}
}


func addPage2(pdf *gopdf.GoPdf, data *Employee) {

	teamwork := data.ScoreDetails["teamwork"]
	pdf.SetXY(212, 70)
	pdf.Text(fmt.Sprintf("%.2f", teamwork.Scores[0]))
	pdf.SetXY(212, 92)
	pdf.Text(fmt.Sprintf("%.2f", teamwork.Scores[1]))
	pdf.SetXY(212, 116)
	pdf.Text(fmt.Sprintf("%.2f", teamwork.Scores[2]))
	pdf.SetXY(212, 143)
	pdf.Text(fmt.Sprintf("%.2f", teamwork.Overall))
	var totalScore float64
	for _, s := range teamwork.Scores {
		totalScore += s
	}
	pdf.SetXY(161, 143)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(248, 65)
	comments := splitTextToWordWrap(pdf, teamwork.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(248, pdf.GetY()+10)
	}

	responsibility := data.ScoreDetails["responsibility"]
	pdf.SetXY(212, 205)
	pdf.Text(fmt.Sprintf("%.2f", responsibility.Scores[0]))
	pdf.SetXY(212, 229)
	pdf.Text(fmt.Sprintf("%.2f", responsibility.Scores[1]))
	pdf.SetXY(212, 252)
	pdf.Text(fmt.Sprintf("%.2f", responsibility.Scores[2]))
	pdf.SetXY(212, 277)
	pdf.Text(fmt.Sprintf("%.2f", responsibility.Overall))
	totalScore = 0
	for _, s := range teamwork.Scores {
		totalScore += s
	}
	pdf.SetXY(161, 277)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(248, 200)
	comments = splitTextToWordWrap(pdf, responsibility.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(248, pdf.GetY()+10)
	}

	initiative := data.ScoreDetails["initiative"]
	pdf.SetXY(212, 334)
	pdf.Text(fmt.Sprintf("%.2f", initiative.Scores[0]))
	pdf.SetXY(212, 357)
	pdf.Text(fmt.Sprintf("%.2f", initiative.Scores[1]))
	pdf.SetXY(212, 382)
	pdf.Text(fmt.Sprintf("%.2f", initiative.Scores[2]))
	pdf.SetXY(212, 412)
	pdf.Text(fmt.Sprintf("%.2f", initiative.Overall))
	totalScore = 0
	for _, s := range initiative.Scores {
		totalScore += s
	}
	pdf.SetXY(161, 412)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(248, 330)
	comments = splitTextToWordWrap(pdf, initiative.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(248, pdf.GetY()+10)
	}

	safety := data.ScoreDetails["safety"]
	pdf.SetXY(212, 465)
	pdf.Text(fmt.Sprintf("%.2f", safety.Scores[0]))
	pdf.SetXY(212, 489)
	pdf.Text(fmt.Sprintf("%.2f", safety.Scores[1]))
	pdf.SetXY(212, 512)
	pdf.Text(fmt.Sprintf("%.2f", safety.Scores[2]))
	pdf.SetXY(212, 535)
	pdf.Text(fmt.Sprintf("%.2f", safety.Scores[3]))
	pdf.SetXY(212, 560)
	pdf.Text(fmt.Sprintf("%.2f", safety.Overall))
	totalScore = 0
	for _, s := range safety.Scores {
		totalScore += s
	}
	pdf.SetXY(161, 560)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(248, 462)
	comments = splitTextToWordWrap(pdf, safety.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(248, pdf.GetY()+10)
	}
}

func addPage3(pdf *gopdf.GoPdf, data *Employee) {

	attendance := data.ScoreDetails["attendance"]
	pdf.SetXY(605, 66)
	pdf.Text(fmt.Sprintf("%.2f", attendance.Scores[0]))
	pdf.SetXY(605, 92)
	pdf.Text(fmt.Sprintf("%.2f", attendance.Scores[1]))
	pdf.SetXY(605, 116)
	pdf.Text(fmt.Sprintf("%.2f", attendance.Scores[2]))
	pdf.SetXY(605, 143)
	pdf.Text(fmt.Sprintf("%.2f", attendance.Overall))
	var totalScore float64
	for _, s := range attendance.Scores {
		totalScore += s
	}
	pdf.SetXY(554, 143)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))
	pdf.SetXY(637, 61)
	comments := splitTextToWordWrap(pdf, attendance.Comment, 150)
	for _, c := range comments {
		pdf.Text(c)
		pdf.SetXY(637, pdf.GetY()+10)
	}

	totalScore = 0
	for _, v := range data.ScoreDetails {
		totalScore += v.Overall
	}
	pdf.SetXY(677, 175)
	pdf.Text(fmt.Sprintf("%.2f", totalScore))

	pdf.SetXY(758, 175)
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

	pdf.SetXY(55, 50)
	pdf.Text(data.TrainingComment)

	pdf.SetFontSize(20)
	tick := "√"
	switch data.Rating {
	case 5:
		pdf.SetXY(63, 185)
	case 4:
		pdf.SetXY(63, 210)
	case 3:
		pdf.SetXY(63, 235)
	case 2:
		pdf.SetXY(223, 185)
	default:
		pdf.SetXY(223, 210)
	}
	pdf.Text(tick)

    pdf.SetFontSize(7)
    pdf.SetXY(60, 495)
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
