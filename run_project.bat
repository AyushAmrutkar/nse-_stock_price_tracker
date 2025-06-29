@echo off
start cmd /k "uvicorn backend:app --reload"
timeout /t 5
start chrome http://127.0.0.1:8000
start chrome frontend/index.html
