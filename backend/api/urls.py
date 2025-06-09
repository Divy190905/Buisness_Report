from django.urls import path
from .views import FileUploadAPIView, QueryGraphAPIView,QueryAnswerAPIView

urlpatterns = [
    path('upload/', FileUploadAPIView.as_view(), name='upload'),
    path('query-graph/', QueryGraphAPIView.as_view(), name='query-graph'),
    path('query-answer/', QueryAnswerAPIView.as_view(), name='query-answer'),
]