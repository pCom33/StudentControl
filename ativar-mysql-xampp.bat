@echo off
echo ========================================================
echo   StudentControl - Configurador de MySQL para XAMPP
echo ========================================================
echo.
echo 1. A parar o servico conflitante MySQL84...
net stop MySQL84
sc config MySQL84 start= demand

echo.
echo 2. A verificar libertacao da porta 3306...
timeout /t 2 /nobreak > nul

echo.
echo 3. A iniciar o MySQL do XAMPP...
if exist "C:\xampp\mysql_start.bat" (
    start "" "C:\xampp\mysql_start.bat"
    echo MySQL do XAMPP iniciado com sucesso!
) else (
    echo Abra o painel do XAMPP Control Panel e clique em Start no MySQL.
)

echo.
echo ========================================================
echo Concluido! Agora o MySQL do XAMPP esta livre na porta 3306.
echo Pode abrir http://localhost/phpmyadmin e testar o sistema.
echo ========================================================
pause
