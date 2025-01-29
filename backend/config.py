import os

# Configuration settings
OUTPUT_DIRECTORY = "./audio_output"
CACHE_DIRECTORY = "./model_cache"

# Create necessary directories
os.makedirs(OUTPUT_DIRECTORY, exist_ok=True)
os.makedirs(CACHE_DIRECTORY, exist_ok=True)

# YouTube download options
YDL_OPTS = {
    "format": "bestaudio/best",
    "postprocessors": [{
        "key": "FFmpegExtractAudio",
        "preferredcodec": "mp3",
        "preferredquality": "192",
    }],
    "outtmpl": os.path.join(OUTPUT_DIRECTORY, "%(title)s.%(ext)s"),
}

# Model cache settings
MODEL_CACHE_CONFIG = {
    "cache_dir": CACHE_DIRECTORY,
    "local_files_only": False  # Set to True to only use cached files
}