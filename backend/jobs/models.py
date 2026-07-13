from django.db import models

class Job(models.Model):
    # Badala ya ForeignKey, tunahifadhi tu ID ya mteja kama namba ya kawaida
    client_id = models.IntegerField(help_text="ID ya mteja kutoka accounts service")
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    skills_required = models.TextField(help_text="Weka skills zikitenganishwa na mkato mfano: React, Python")
    
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title