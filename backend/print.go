package backend

import (
	"os/exec"
	"strings"

	"github.com/jadefox10200/goprint"
)

func GetPrinterSettings() (interface{}, error) {
	name, _ := goprint.GetDefaultPrinterName()
	handle, err := goprint.OpenPrinter(name)
	if err != nil {
		return nil, err
	}
	dev, err := handle.DocumentPropertiesGet(name)
	if err != nil {
		return nil, err
	}

	orientation, _ := dev.GetOrientation()
	isOrientation := false
	if orientation == 2 {
		isOrientation = true
	}
	duplex, _ := dev.GetDuplex()
	isDuplex := false
	if duplex == 3 {
		isDuplex = true
	}
	size, _ := dev.GetPaperSize()
	isSize := false
	if size == 9 {
		isSize = true
	}
	printerName := dev.GetDeviceName()
	isPrinterName := false
	if strings.Contains(printerName, "E720") {
		isPrinterName = true
	}
	info := map[string]interface{}{
		"printerName": map[string]interface{}{
			"value":   printerName,
			"isValid": isPrinterName,
		},
		"paperSize": map[string]interface{}{
			"value":   size,
			"isValid": isSize,
		},
		"orientation": map[string]interface{}{
			"value":   orientation,
			"isValid": isOrientation,
		},
		"duplex": map[string]interface{}{
			"value":   duplex,
			"isValid": isDuplex,
		},
	}
	return info, nil

}

func PrintPDF(app, file, printerName string) error {
	cmd := exec.Command(app, "-print-to", printerName, file)
	return cmd.Run()
}
