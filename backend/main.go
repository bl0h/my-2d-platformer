package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

type HighScore struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
}

var highScores []HighScore
var mu sync.Mutex

func apiHandler(w http.ResponseWriter, r *http.Request) {
	response := map[string]string{"message": "Hello from the API!"}
	json.NewEncoder(w).Encode(response)
}

func getHighScoresHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()
	json.NewEncoder(w).Encode(highScores)
}

func postHighScoreHandler(w http.ResponseWriter, r *http.Request) {
	var newScore HighScore
	json.NewDecoder(r.Body).Decode(&newScore)
	mu.Lock()
	highScores = append(highScores, newScore)
	mu.Unlock()
	w.WriteHeader(http.StatusCreated)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api", apiHandler).Methods("GET")
	r.HandleFunc("/api/highscores", getHighScoresHandler).Methods("GET")
	r.HandleFunc("/api/highscores", postHighScoreHandler).Methods("POST")
	fmt.Println("Server running on port 8080")
	http.ListenAndServe(":8080", r)
}
