package backend_test

import (
	"changeme/backend"
	"encoding/json"
	"io/ioutil"
	"log"
	"testing"
)

func TestPDF(t *testing.T) {
	t.Parallel()
	var employees []*backend.Employee
	f, err := ioutil.ReadFile("data.json")
	if err != nil {
		log.Fatal(err)
	}
	if err = json.Unmarshal(f, &employees); err != nil {
		log.Fatal(err)
	}
	backend.GenerateNonExecAppraisalPDF(employees[0], "./")
}
