@echo off
REM 変換したいファイルを指定する
set "input_file=%~1"
set "output_file=%~dpn1.webp"

REM ffmpegコマンドを実行する
ffmpeg -i "%input_file%" "%output_file%"

REM 終了メッセージ
echo Conversion complete: "%output_file%"
pause
