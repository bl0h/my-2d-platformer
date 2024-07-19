package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Response struct {
	Message string `json:"message"`
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	response := Response{Message: "Hello from the API!"}
	json.NewEncoder(w).Encode(response)
}

func main() {
	http.HandleFunc("/api", apiHandler)
	fmt.Println("Server running on port 8080")
	http.ListenAndServe(":8080", nil)
}
