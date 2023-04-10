package main

import (
	"changeme/backend"
	"context"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) OpenDirForExcelFile() (string, error) {
	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Appraisal Excel File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Excel (*.xlsx;*.xlsm;*.xls)",
				Pattern:     "*.xlsx;*.xlsm;*.xls",
			},
		},
	})
}

func (a *App) GetDataFromExcel(excelpath, sheet string) ([][]string, error) {
	return backend.GetDataFromExcel(excelpath, sheet)
}

func (a *App) GetExcelSheets(excelpath string) ([]string, error) {
	return backend.GetExcelSheets(excelpath)
}

func (a *App) InitEmployeeData(excelpath, sheet string) ([]*backend.Employee, error) {
	rows, err := backend.GetDataFromExcel(excelpath, sheet)
	if err != nil {
		return nil, err
	}
	return backend.InitEmployeeData(rows)
}

func (a *App) GenerateAverageScores(data *backend.Employee) *backend.Employee {
	return backend.GenerateAverageScores(data)
}

func (a *App) ResetScoreDetails(scoreDetail interface{}) (*backend.ScoreDetail, error) {
	return backend.ResetScoreDetails(scoreDetail)
}

func (a *App) GenerateScoreDetails(scoreDetail interface{}) (*backend.ScoreDetail, error) {
	return backend.GenerateScoreDetails(scoreDetail)
}

func (a *App) GenerateAllEmployeeData(data []*backend.Employee) []*backend.Employee {
	return backend.GenerateAllEmployeeData(data)
}
