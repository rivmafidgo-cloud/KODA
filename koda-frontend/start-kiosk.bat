@echo off
title KODA Kiosk Launcher
echo ==========================================
echo    KODA INDUSTRIAL KIOSK - AVVIO
echo ==========================================

:: Verifica se node_modules esiste
if not exist "node_modules" (
    echo Installazione dipendenze in corso...
    call npm install
)

:: Avvia il server Angular in una finestra separata ridotta a icona
echo Avvio del server Angular (ng serve)...
start /min "KODA-Server" cmd /c "npm start"

echo In attesa che il server sia pronto (circa 20-30 secondi)...
echo Puoi chiudere questa finestra una volta che il browser si e aperto.

:: Attesa per dare il tempo ad Angular di compilare (regolabile)
timeout /t 25 /nobreak > nul

:: Cerca l'eseguibile di Chrome nei percorsi comuni
set CHROME_PATH=""
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set CHROME_PATH="%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set CHROME_PATH="%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set CHROME_PATH="%LocalAppData%\Google\Chrome\Application\chrome.exe"

echo Apertura del browser in modalita Kiosk...

if not %CHROME_PATH% == "" (
    start "" %CHROME_PATH% --kiosk --user-data-dir="%temp%\koda_kiosk" --no-first-run --disable-features=TranslateUI --disable-pinch --overscroll-history-navigation=0 http://localhost:4200
) else (
    echo Chrome non trovato. Provo ad avviare Microsoft Edge...
    start msedge --kiosk http://localhost:4200 --edge-kiosk-type=fullscreen --no-first-run --user-data-dir="%temp%\koda_kiosk_edge"
)

echo Avvio completato.
exit
