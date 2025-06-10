from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from .logic.summarizer import get_business_summary
from .logic.visualiser import run_code_and_save
from .logic.query_processor import get_query_answer
from .logic.query_processor import process_query

import logging
import pandas as pd
import re
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)


class FileUploadAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        logger.info(f"Incoming FILES: {request.FILES}")
        logger.info(f"Incoming DATA: {request.data}")

        serializer = UploadedFileSerializer(data=request.data)
        if serializer.is_valid():
            uploaded_file = serializer.save()
            file_path = uploaded_file.file.path
            summary = get_business_summary(file_path)
            return Response({
                'file': uploaded_file.file.url,
                'file_id': uploaded_file.id,  # ✅ Return file ID
                'summary': summary
            })

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=400)


class QueryGraphAPIView(APIView):
    def post(self, request, *args, **kwargs):
        file_id = request.data.get("file_id")
        query = request.data.get("query", "")

        if not file_id or not query:
            return Response({"error": "file_id and query are required."}, status=400)

        try:
            uploaded_file = UploadedFile.objects.get(id=file_id)
            file_path = uploaded_file.file.path
        except UploadedFile.DoesNotExist:
            return Response({"error": "File not found."}, status=404)

        try:
            df = pd.read_csv(file_path)
            df.columns = df.columns.str.strip()
        except Exception as e:
            return Response({"error": f"Failed to read CSV: {str(e)}"}, status=400)

        try:
            result = process_query(file_path, query)
            
            # Handle "done" command response
            if isinstance(result, str) and result.strip().lower() == "conversation context has been reset.":
                return Response({"message": result})
            
            # Handle normal dictionary response
            if isinstance(result, dict) and result.get("image"):
                return Response({"code": result["code"], "image_path": result["image"]})
            else:
                return Response({"error": "No plot generated."}, status=500)

        except Exception as e:
            logger.error(f"Error during query processing: {e}")
            return Response({"error": str(e)}, status=500)


class QueryAnswerAPIView(APIView):
    def post(self, request):
        file_id = request.data.get('file_id')
        question = request.data.get('question')

        if not file_id or not question:
            return Response({'error': 'file_id and question are required'}, status=400)

        try:
            uploaded_file = UploadedFile.objects.get(id=file_id)
        except UploadedFile.DoesNotExist:
            return Response({'error': 'File not found'}, status=404)

        file_path = uploaded_file.file.path

        try:
            answer = get_query_answer(question, file_path)
            return Response({'answer': answer})
        except Exception as e:
            return Response({'error': str(e)}, status=500)