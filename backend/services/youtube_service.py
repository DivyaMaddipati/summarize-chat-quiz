from yt_dlp import YoutubeDL
import os
from config import YDL_OPTS

def youtube_to_audio(youtube_url):
    """
    Downloads YouTube video and converts it to audio
    """
    try:
        with YoutubeDL(YDL_OPTS) as ydl:
            info = ydl.extract_info(youtube_url, download=True)
            filename = ydl.prepare_filename(info)
            base_filename = os.path.splitext(filename)[0]
            return f"{base_filename}.mp3"
    except Exception as e:
        raise Exception(f"Error downloading audio: {str(e)}")