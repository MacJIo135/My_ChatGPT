from django.db import models

# Create your models here.


class Message(models.Model):
    content = models.TextField()
    user_message = models.TextField()
    model_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
