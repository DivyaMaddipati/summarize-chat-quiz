# Backend Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask application:
```bash
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

- POST `/api/summarize`: Summarize YouTube video
- POST `/api/chat`: Chat about the summary
- POST `/api/quiz`: Generate quiz questions

## Requirements

- Python 3.8+
- FFmpeg (for audio processing)