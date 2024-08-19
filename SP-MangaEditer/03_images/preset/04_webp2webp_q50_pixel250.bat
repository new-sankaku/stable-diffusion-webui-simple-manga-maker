@echo off
setlocal enabledelayedexpansion

REM 品質設定（0-100の範囲。デフォルトは75）
set "quality=80"

REM 目標とする長辺のサイズ（ピクセル）
set "target_size=250"

REM ドロップされたディレクトリを取得
set "input_dir=%~1"

REM ディレクトリ内のすべてのWebPファイルを処理
for %%F in ("%input_dir%\*.webp") do (
    set "input_file=%%F"
    set "output_file=%%~dpnF_resized.webp"
    
    REM 画像の情報を取得
    for /f "tokens=1,2" %%A in ('ffprobe -v error -select_streams v:0 -show_entries stream^=width^,height -of csv^=s^=x:p^=0 "!input_file!"') do (
        set "width=%%A"
        set "height=%%B"
    )
    
    REM アスペクト比を維持しながら、長辺を250pxにリサイズ
    if !width! geq !height! (
        set "filter_complex=scale=%target_size%:-1"
    ) else (
        set "filter_complex=scale=-1:%target_size%"
    )
    
    REM ffmpegコマンドを実行する（リサイズと品質設定を含む）
    ffmpeg -i "!input_file!" -vf "!filter_complex!" -c:v libwebp -quality !quality! "!output_file!"
    
    REM 変換完了メッセージ
    echo Conversion complete: "!output_file!"
)

echo All WebP files have been resized and re-encoded with quality setting of %quality%.
pause