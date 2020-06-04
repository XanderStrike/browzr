package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	http.HandleFunc("/filelist", files)
	http.HandleFunc("/", index)

	fs := http.FileServer(http.Dir("./files"))
	http.Handle("/files/", http.StripPrefix("/files/", fs))

	log.Println("Server started on port 3000...")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Println(err)
	}
}

func files(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_, err := w.Write(fileJSON())
	if err != nil {
		log.Println(err)
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

func fileJSON() []byte {
	files := []string{}
	err := filepath.Walk("files/",
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return nil
			}
			files = append(files, path)
			return nil
		})
	if err != nil {
		log.Println(err)
	}

	filesJson, err := json.MarshalIndent(files, "", " ")
	if err != nil {
		log.Println(err)
	}
	return filesJson
}
