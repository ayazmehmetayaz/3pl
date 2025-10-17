#!/bin/bash

echo "========================================"
echo "  AYAZ 3PL MOBILE APK BUILDER"
echo "========================================"
echo

echo "[1/4] El Terminali APK'si build ediliyor..."
cd el-terminal
npm install
npm run build-android
if [ $? -ne 0 ]; then
    echo "HATA: El Terminali build başarısız!"
    exit 1
fi
echo "El Terminali APK hazır: el-terminal/android/app/build/outputs/apk/release/app-release.apk"
echo

echo "[2/4] Şoför App APK'si build ediliyor..."
cd ../sofor-app
npm install
npm run build-android
if [ $? -ne 0 ]; then
    echo "HATA: Şoför App build başarısız!"
    exit 1
fi
echo "Şoför App APK hazır: sofor-app/android/app/build/outputs/apk/release/app-release.apk"
echo

echo "[3/4] APK dosyaları kopyalanıyor..."
mkdir -p dist
cp "el-terminal/android/app/build/outputs/apk/release/app-release.apk" "dist/ayaz-el-terminal.apk"
cp "sofor-app/android/app/build/outputs/apk/release/app-release.apk" "dist/ayaz-sofor-app.apk"
echo

echo "[4/4] Build tamamlandı!"
echo
echo "========================================"
echo "  BUILD SONUÇLARI"
echo "========================================"
echo "El Terminali: dist/ayaz-el-terminal.apk"
echo "Şoför App:    dist/ayaz-sofor-app.apk"
echo
echo "APK dosyaları 'dist' klasöründe hazır!"
echo
