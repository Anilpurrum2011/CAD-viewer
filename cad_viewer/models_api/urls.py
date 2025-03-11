from django.urls import path
from .views import UploadModelView, RetrieveModelView

urlpatterns = [
    path("upload/", UploadModelView.as_view(), name="upload-model"),
    path("retrieve/<int:file_id>/", RetrieveModelView.as_view(), name="retrieve-model"),
]
