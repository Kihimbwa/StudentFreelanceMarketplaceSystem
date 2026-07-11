from django.db import models
from django.contrib.auth import get_user_model
from jobs.models import Job

User = get_user_model()

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    proposal = models.TextField(help_text="Eleza kwanini wewe unafaa kwa kazi hii")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.freelancer.username} - {self.job.title}"