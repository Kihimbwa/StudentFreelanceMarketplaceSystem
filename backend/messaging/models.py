from django.db import models

class Message(models.Model):
    # Tunahifadhi tu ID za namba badala ya ForeignKey za kuvuka database
    sender_id = models.IntegerField(help_text="ID ya mtumaji kutoka accounts service")
    receiver_id = models.IntegerField(help_text="ID ya mpokeaji kutoka accounts service")
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message {self.id}: From {self.sender_id} to {self.receiver_id}"