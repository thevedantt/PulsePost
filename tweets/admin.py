from django.contrib import admin
from .models import Tweet

# Register your models here.

@admin.register(Tweet)
class TweetAdmin(admin.ModelAdmin):
    # Specify which fields to display in the list view
    list_display = ('user', 'text_preview', 'created_at')
    
    # Enable filtering by user and date
    list_filter = ('user', 'created_at')
    
    # Enable searching by tweet text and username
    search_fields = ('text', 'user__username')

    def text_preview(self, obj):
        # Return a short snippet of the text for the list view
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    
    text_preview.short_description = 'Tweet'
