from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os

from .models import ModelFile
from .serializers import ModelFileSerializer

class UploadModelView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if "file" not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES["file"]
        file_path = default_storage.save(f"models/{uploaded_file.name}", ContentFile(uploaded_file.read()))

        # Save file details in the database
        model_instance = ModelFile.objects.create(file=file_path)

        return Response({
            "message": "File uploaded successfully",
            "file_id": model_instance.id,
            "file_path": settings.MEDIA_URL + file_path
        }, status=status.HTTP_201_CREATED)


class RetrieveModelView(APIView):
    def get(self, request, file_id):
        try:
            model_file = ModelFile.objects.get(id=file_id)
            file_path = os.path.join(settings.MEDIA_ROOT, str(model_file.file))
            
            if not os.path.exists(file_path):
                return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response({"file_url": settings.MEDIA_URL + str(model_file.file)})
        
        except ModelFile.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
