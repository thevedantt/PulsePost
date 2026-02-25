from django.contrib import admin
from .models import Tweet, TweetImage, Profile, Follow

# Register your models here.


class TweetImageInline(admin.TabularInline):
    """
    Inline admin for TweetImage — shows images directly inside the Tweet admin page.
    Extra=1 means one blank slot is shown by default for adding a new image.
    """
    model = TweetImage
    extra = 1
    readonly_fields = ('created_at',)


@admin.register(Tweet)
class TweetAdmin(admin.ModelAdmin):
    # Specify which fields to display in the list view
    list_display = ('user', 'text_preview', 'image_count', 'created_at')

    # Enable filtering by user and date
    list_filter = ('user', 'created_at')

    # Enable searching by tweet text and username
    search_fields = ('text', 'user__username')

    # Show images inline inside the Tweet detail page
    inlines = [TweetImageInline]

    def text_preview(self, obj):
        # Return a short snippet of the text for the list view
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Tweet'

    def image_count(self, obj):
        """Show how many images are attached to this tweet."""
        return obj.images.count()
    image_count.short_description = 'Images'


@admin.register(TweetImage)
class TweetImageAdmin(admin.ModelAdmin):
    """Standalone admin view for browsing all tweet images."""
    list_display = ('id', 'tweet', 'image', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('tweet__text', 'tweet__user__username')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio_preview', 'created_at')
    search_fields = ('user__username', 'bio')
    list_filter = ('created_at',)

    def bio_preview(self, obj):
        if not obj.bio:
            return "(no bio)"
        return obj.bio[:50] + "..." if len(obj.bio) > 50 else obj.bio

    bio_preview.short_description = 'Bio'


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    """Admin view for managing follow relationships."""
    list_display = ('follower', 'following', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('follower__username', 'following__username')
