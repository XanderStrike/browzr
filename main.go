package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type FileInfo struct {
	Path string `json:"path"`
	Size string `json:"size"`
}

func main() {
	http.HandleFunc("/filelist", files)
	http.HandleFunc("/styles.css", styles)
	http.HandleFunc("/script.js", script)
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

func styles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/css")
	http.ServeFile(w, r, "styles.css")
}

func script(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/javascript")
	http.ServeFile(w, r, "script.js")
}

func index(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

func fileJSON() []byte {
	files := []FileInfo{}
	err := filepath.Walk("files/",
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return nil
			}
			files = append(files, FileInfo{
				Path: path,
				Size: humanizeBytes(info.Size()),
			})
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

func humanizeBytes(bytes int64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%dB", bytes)
	}
	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f%cB", float64(bytes)/float64(div), "KMGTPE"[exp])
}
