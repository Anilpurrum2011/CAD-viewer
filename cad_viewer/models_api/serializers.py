from rest_framework import serializers
from .models import ModelFile

class ModelFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelFile
        fields = '__all__'
