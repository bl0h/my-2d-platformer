@echo off

rem Start Go server
echo Starting Go server...
start cmd /c "cd backend && go run main.go"

rem Start React development server
echo Starting React development server...
start cmd /c "npm start"

pause
