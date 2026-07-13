from django.db import models

class Application(models.Model):
    # Badala ya ForeignKey, tunahifadhi tu ID za namba
    job_id = models.IntegerField(help_text="ID ya kazi kutoka jobs service")
    freelancer_id = models.IntegerField(help_text="ID ya mwanafunzi/freelancer kutoka accounts service")
    bid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    proposal = models.TextField(help_text="Eleza kwanini wewe unafaa kwa kazi hii")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application {self.id} for Job ID {self.job_id} by Freelancer ID {self.freelancer_id}"