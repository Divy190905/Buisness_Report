from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import UploadedFile
from .serializers import UploadedFileSerializer
from .logic.summarizer import get_business_summary
import logging

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
                'summary': summary
            })
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=400)
