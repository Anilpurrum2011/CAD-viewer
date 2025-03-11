from django.db import models

class ModelFile(models.Model):
    file = models.FileField(upload_to="models/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
