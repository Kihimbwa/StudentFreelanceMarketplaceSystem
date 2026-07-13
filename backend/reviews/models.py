from django.db import models

class Review(models.Model):
    # Tunahifadhi ID za namba ili kuepuka ForeignKey errors
    reviewer_id = models.IntegerField(help_text="ID ya anayetoa review kutoka accounts service")
    reviewee_id = models.IntegerField(help_text="ID ya anayepokea review kutoka accounts service")
    job_id = models.IntegerField(help_text="ID ya kazi husika kutoka jobs service")
    rating = models.PositiveSmallIntegerField(help_text="Weka nyota 1 hadi 5")
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review {self.id}: {self.rating} Stars for User ID {self.reviewee_id}"