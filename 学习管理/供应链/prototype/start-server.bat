@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo 智链 SCM 原型 - 本地预览
echo 浏览器访问: http://localhost:8080/
echo 按 Ctrl+C 可停止服务
echo ========================================
py -m http.server 8080
pause
