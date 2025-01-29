from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from services.youtube_service import youtube_to_audio
from services.transcription_service import transcribe_audio
from services.text_service import summarize_text, answer_question, generate_quiz
from services.translation_service import process_transcript

app = Flask(__name__)
CORS(app)

@app.route('/api/summarize', methods=['POST'])
def get_summary():
    try:
        data = request.get_json()
        youtube_url = data.get('url')
        video_language = data.get('language', 'en')
        
        if not youtube_url:
            return jsonify({'error': 'No URL provided'}), 400
            
        # Download and convert to audio
        audio_file = youtube_to_audio(youtube_url)
        
        # Transcribe audio
        transcription = transcribe_audio(audio_file)
        
        # Translate if needed
        english_transcription = process_transcript(transcription, video_language)
        
        # Generate summary
        summary = summarize_text(english_transcription)
        
        # Clean up audio file
        if os.path.exists(audio_file):
            os.remove(audio_file)
            
        return jsonify({
            'summary': summary,
            'transcription': english_transcription
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_about_summary():
    try:
        data = request.get_json()
        question = data.get('question')
        summary = data.get('summary')
        
        if not question or not summary:
            return jsonify({'error': 'Missing required parameters'}), 400

        response = answer_question(question, summary)
        return jsonify({
            'response': response
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/quiz', methods=['POST'])
def generate_quiz_route():
    try:
        data = request.get_json()
        summary = data.get('summary')
        
        if not summary:
            return jsonify({'error': 'Missing summary'}), 400
            
        questions = generate_quiz(summary)
        return jsonify({'questions': questions})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)