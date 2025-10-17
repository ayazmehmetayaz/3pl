@echo off
echo ========================================
echo   AYAZ 3PL MOBILE APK BUILDER
echo ========================================
echo.

echo [1/4] El Terminali APK'si build ediliyor...
cd el-terminal
call npm install
call npm run build-android
if %errorlevel% neq 0 (
    echo HATA: El Terminali build basarisiz!
    pause
    exit /b 1
)
echo El Terminali APK hazir: el-terminal/android/app/build/outputs/apk/release/app-release.apk
echo.

echo [2/4] Sofor App APK'si build ediliyor...
cd ../sofor-app
call npm install
call npm run build-android
if %errorlevel% neq 0 (
    echo HATA: Sofor App build basarisiz!
    pause
    exit /b 1
)
echo Sofor App APK hazir: sofor-app/android/app/build/outputs/apk/release/app-release.apk
echo.

echo [3/4] APK dosyalari kopyalaniyor...
if not exist "dist" mkdir dist
copy "el-terminal\android\app\build\outputs\apk\release\app-release.apk" "dist\ayaz-el-terminal.apk"
copy "sofor-app\android\app\build\outputs\apk\release\app-release.apk" "dist\ayaz-sofor-app.apk"
echo.

echo [4/4] Build tamamlandi!
echo.
echo ========================================
echo   BUILD SONUCLARI
echo ========================================
echo El Terminali: dist\ayaz-el-terminal.apk
echo Sofor App:    dist\ayaz-sofor-app.apk
echo.
echo APK dosyalari 'dist' klasorunde hazir!
echo.
pause
