import warnings
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from config import MODEL_CACHE_CONFIG

warnings.filterwarnings('ignore')

# Translation models and tokenizers setup with caching
nllb_model_name = "facebook/nllb-200-distilled-1.3B"
nllb_tokenizer = AutoTokenizer.from_pretrained(
    nllb_model_name,
    cache_dir=MODEL_CACHE_CONFIG["cache_dir"]
)
nllb_model = AutoModelForSeq2SeqLM.from_pretrained(
    nllb_model_name,
    cache_dir=MODEL_CACHE_CONFIG["cache_dir"]
)

def split_text_into_chunks(text, max_tokens, tokenizer):
    """Split text into chunks based on token limit"""
    tokens = tokenizer.encode(text)
    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i + max_tokens]
        chunks.append(tokenizer.decode(chunk_tokens, skip_special_tokens=True))
    return chunks

def translate_chunks(chunks, translation_function):
    """Translate text chunks and join them"""
    translated_chunks = [translation_function(chunk) for chunk in chunks]
    return " ".join(translated_chunks)

def translate_large_text(text, translation_function, tokenizer, max_tokens=512):
    """Handle translation of large text by chunking"""
    chunks = split_text_into_chunks(text, max_tokens, tokenizer)
    translated_text = translate_chunks(chunks, translation_function)
    return translated_text

def translate_to_english(text, source_lang):
    """Translate text from source language to English"""
    src_lang_code = {
        'te': 'tel_Telu',
        'hi': 'hin_Deva'
    }.get(source_lang)
    
    if not src_lang_code:
        return text  # Return original text if language not supported
        
    tgt_lang = "eng_Latn"
    nllb_tokenizer.src_lang = src_lang_code
    
    inputs = nllb_tokenizer(text, return_tensors="pt", padding=True)
    outputs = nllb_model.generate(**inputs, forced_bos_token_id=nllb_tokenizer.convert_tokens_to_ids(tgt_lang))
    return nllb_tokenizer.decode(outputs[0], skip_special_tokens=True)

def process_transcript(transcript, source_lang):
    """Process transcript by translating if needed"""
    if source_lang in ['te', 'hi']:
        return translate_large_text(
            transcript,
            lambda x: translate_to_english(x, source_lang),
            nllb_tokenizer
        )
    return transcript