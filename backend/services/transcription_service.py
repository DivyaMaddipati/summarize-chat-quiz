import whisper
from config import MODEL_CACHE_CONFIG

# Initialize Whisper model with caching
whisper_model = whisper.load_model(
    "base",
    download_root=MODEL_CACHE_CONFIG["cache_dir"]
)

def transcribe_audio(audio_file):
    """
    Transcribes audio file to text using Whisper
    """
    result = whisper_model.transcribe(audio_file)
    return result['text']