package backend

import "github.com/xuri/excelize/v2"

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
