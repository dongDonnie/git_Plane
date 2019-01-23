@echo off
xcopy ".\openDataContext" "E:\trunk\weplaneclt\build\wechatgame\src\myOpenDataContext" /E /I /Y
xcopy ".\wx-downloader.js" "E:\trunk\weplaneclt\build\wechatgame\libs\wx-downloader.js" /E /I /Y
xcopy ".\game.json" "E:\trunk\weplaneclt\build\wechatgame\game.json" /E /I /Y

pause
echo 移动已完成
