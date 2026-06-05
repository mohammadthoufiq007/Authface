@echo off
setlocal

:: Download portable CMake (no admin needed)
set CMAKE_ZIP=%USERPROFILE%\cmake.zip
set CMAKE_DIR=%USERPROFILE%\cmake

if not exist "%CMAKE_ZIP%" (
    echo Downloading CMake...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/Kitware/CMake/releases/download/v3.28.2/cmake-3.28.2-windows-x86_64.zip' -OutFile '%CMAKE_ZIP%'"
) else (
    echo CMake zip already downloaded.
)

if not exist "%CMAKE_DIR%\cmake-3.28.2-windows-x86_64" (
    echo Extracting CMake...
    powershell -Command "Expand-Archive -Path '%CMAKE_ZIP%' -DestinationPath '%CMAKE_DIR%' -Force"
) else (
    echo CMake already extracted.
)

set "CMAKE_BIN=%CMAKE_DIR%\cmake-3.28.2-windows-x86_64\bin"
set "PATH=%CMAKE_BIN%;%PATH%"

:: Install required Python packages (binary wheels only where possible)
echo Installing onnx==1.12.0 (binary if available)...
python -m pip install --upgrade pip
python -m pip install onnx==1.12.0 --only-binary=:all: || python -m pip install onnx==1.12.0

echo Installing onnx-tf and TensorFlow...
python -m pip install onnx-tf==1.9.0 tensorflow==2.14.0

:: Run the conversion script
echo Running conversion script...
python "C:\Users\Thoufiq\Downloads\Authface\scripts\convert_models.py"

endlocal
