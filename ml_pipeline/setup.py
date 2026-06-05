from setuptools import setup, find_packages

setup(
    name="offaceface",
    version="1.0.0",
    description="Offline facial recognition and liveness detection for Datalake 3.0",
    packages=find_packages(),
    python_requires=">=3.8",
    entry_points={
        "console_scripts": [
            "offaceface=offaceface.cli:main",
        ],
    },
)