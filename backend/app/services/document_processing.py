





import os
import tempfile
from typing import Dict, Union
from pdfminer.high_level import extract_text as extract_pdf_text
from docx import Document as DocxDocument
import pytesseract
from PIL import Image
import requests
from bs4 import BeautifulSoup

def process_document(content: bytes, content_type: str, filename: str) -> Dict[str, Union[str, None]]:
    """
    Process different document types and extract text content.
    """
    if content_type == "application/pdf":
        return process_pdf(content)
    elif content_type in ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
        return process_word(content)
    elif content_type in ["text/plain", "text/markdown"]:
        return process_text(content.decode('utf-8'))
    elif content_type.startswith("image/"):
        return process_image(content)
    else:
        return {"content": None, "metadata": None}

def process_pdf(pdf_content: bytes) -> Dict[str, Union[str, None]]:
    """Extract text from PDF using pdfminer"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(pdf_content)
            tmp_file_path = tmp_file.name

        text = extract_pdf_text(tmp_file_path)
        os.unlink(tmp_file_path)

        return {"content": text, "metadata": {"file_type": "pdf"}}
    except Exception as e:
        return {"content": None, "metadata": {"error": str(e)}}

def process_word(word_content: bytes) -> Dict[str, Union[str, None]]:
    """Extract text from Word document using python-docx"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp_file:
            tmp_file.write(word_content)
            tmp_file_path = tmp_file.name

        doc = DocxDocument(tmp_file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        os.unlink(tmp_file_path)

        return {"content": text, "metadata": {"file_type": "docx"}}
    except Exception as e:
        return {"content": None, "metadata": {"error": str(e)}}

def process_text(text_content: str) -> Dict[str, Union[str, None]]:
    """Process plain text or markdown content"""
    return {"content": text_content, "metadata": {"file_type": "text"}}

def process_image(image_content: bytes) -> Dict[str, Union[str, None]]:
    """Process image using OCR (pytesseract)"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp_file:
            tmp_file.write(image_content)
            tmp_file_path = tmp_file.name

        img = Image.open(tmp_file_path)
        text = pytesseract.image_to_string(img)
        os.unlink(tmp_file_path)

        return {"content": text, "metadata": {"file_type": "image"}}
    except Exception as e:
        return {"content": None, "metadata": {"error": str(e)}}

def process_url(url: str) -> Dict[str, Union[str, None]]:
    """Fetch and parse content from a URL"""
    try:
        response = requests.get(url)
        if response.status_code != 200:
            return {"content": None, "metadata": {"error": "Failed to fetch URL"}}

        soup = BeautifulSoup(response.content, 'html.parser')
        text = soup.get_text(separator="\n")

        return {"content": text, "metadata": {"file_type": "url", "url": url}}
    except Exception as e:
        return {"content": None, "metadata": {"error": str(e)}}





