package backend

import (
	"fmt"
	"strings"

	"github.com/xuri/excelize/v2"
)

// GetExcelSheets from excel file
func GetExcelSheets(excelpath string) ([]string, error) {
	file, err := excelize.OpenFile(excelpath)
	if err != nil {
		return nil, err
	}
	return file.GetSheetList(), nil
}

// GetDataFromExcel is to get data from excel file and sheet
func GetDataFromExcel(excelpath, sheet string) ([][]string, error) {
	file, err := excelize.OpenFile(excelpath)
	if err != nil {

	}
	return file.GetRows(sheet)
}

func WriteDataToExcel(excelpath, sheet string, data []*Employee) error {
	f, err := excelize.OpenFile(excelpath)
	if err != nil {
		return err
	}
	totalRows := 1000
	for i := 1; i < totalRows; i++ {
		badge, err := f.GetCellValue(sheet, fmt.Sprintf("A%v", i))
		if err != nil {
			continue
		}
		fmt.Println(badge)
		for d := range data {
			if strings.EqualFold(badge, data[d].EmployeeCode) {
				f.SetCellFloat(sheet, fmt.Sprintf("M%v", i), data[d].Score, 2, 64)
				f.SetCellInt(sheet, fmt.Sprintf("N%v", i), data[d].Rating)
				data = append(data[:d], data[d+1:]...)
				break
			}
		}
	}

	if err = f.Save(); err != nil {
		return err
	}

	return nil
}
