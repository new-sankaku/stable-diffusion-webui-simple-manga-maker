@echo off
setlocal enabledelayedexpansion
REM ドロップされたディレクトリを取得
set "input_dir=%~1"
REM ディレクトリ内のすべてのPNGファイルを処理
for %%F in ("%input_dir%\*.png") do (
    set "input_file=%%F"
    set "output_file=%%~dpnF.webp"
    
    REM ffmpegコマンドを実行する - scaleオプションで半分のサイズに
    ffmpeg -i "!input_file!" -vf "scale=iw/2:ih/2" "!output_file!"
    
    REM 変換完了メッセージ
    echo Conversion complete: "!output_file!"
)
echo All PNG files have been converted to WebP.
pause