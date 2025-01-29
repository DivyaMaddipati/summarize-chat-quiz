from transformers import pipeline, AutoModelForQuestionAnswering, AutoTokenizer
from config import MODEL_CACHE_CONFIG

# Initialize models with caching
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    cache_dir=MODEL_CACHE_CONFIG["cache_dir"]
)

model_name = "deepset/roberta-base-squad2"
model = AutoModelForQuestionAnswering.from_pretrained(
    model_name,
    cache_dir=MODEL_CACHE_CONFIG["cache_dir"]
)
tokenizer = AutoTokenizer.from_pretrained(
    model_name,
    cache_dir=MODEL_CACHE_CONFIG["cache_dir"]
)
qa_pipeline = pipeline(
    "question-answering",
    model=model,
    tokenizer=tokenizer
)

def summarize_text(text):
    """
    Generates a summary of the input text
    """
    max_len = min(150, int(len(text.split()) * 0.8))  # 80% of input length
    summary = summarizer(text, max_length=max_len, min_length=10, do_sample=False)
    return summary[0]['summary_text']

def answer_question(question, context):
    """
    Answers a question based on the given context
    """
    qa_result = qa_pipeline({
        'question': question,
        'context': context
    })
    return qa_result['answer']

def generate_quiz(summary):
    """
    Generates quiz questions based on the summary
    """
    questions = [
        {
            'question': 'What is the main topic discussed in the summary?',
            'options': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            'correctAnswer': 0
        },
        {
            'question': 'What is a key point mentioned in the summary?',
            'options': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            'correctAnswer': 1
        }
    ]
    return questions