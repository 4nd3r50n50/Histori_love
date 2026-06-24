@echo off
chcp 65001 > nul
title Histori Love - Subir Cambios a GitHub
color 0D
echo =======================================================
echo     🌸 SUBIR CAMBIOS AUTOMÁTICAMENTE A GITHUB 🌸
echo =======================================================
echo.

:: Verificar si hay cambios
git status --porcelain | findstr /R "^" > nul
if %errorlevel% neq 0 (
    echo [Info] No hay cambios locales para subir. Todo está al día.
    echo.
    pause
    exit /b
)

echo Cambios detectados en tu carpeta local:
git status -s
echo.

:: Preguntar por mensaje de commit
set /p msg="Ingresa una breve descripción de los cambios (o ENTER para 'Actualización rápida'): "
if "%msg%"=="" set msg=Actualización rápida

echo.
echo -------------------------------------------------------
echo [1/3] Añadiendo archivos principales e imágenes (PNG/JPG)...
:: Añadir archivos base y solo imágenes .png y .jpg (evita videos e imágenes pesadas .HEIC de iPhone)
git add index.html
git add manifest.json >nul 2>&1
git add sw.js >nul 2>&1
git add imagenes/*.png >nul 2>&1
git add imagenes/*.jpg >nul 2>&1
git add imagenes/*.jpeg >nul 2>&1

echo [2/3] Creando el punto de restauración (Commit)...
git commit -m "%msg%"

echo [3/3] Subiendo cambios a GitHub...
git push origin main

echo -------------------------------------------------------
echo.
echo =======================================================
echo    🎉 ¡ÉXITO! Los cambios han sido subidos a GitHub.
echo    Si activaste GitHub Pages, se actualizará en tu 
echo    teléfono en aproximadamente 1 minuto.
echo =======================================================
echo.
pause
