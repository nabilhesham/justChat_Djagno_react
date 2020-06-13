from django.shortcuts import render, get_object_or_404
# from django.contrib.auth.decorators import login_required
# from django.utils.safestring import mark_safe
# import json


# def index(request):
#     return render(request, 'chat/index.html', {})


# @login_required
# def room(request, room_name):
#     return render(request, 'chat/room.html', {
#         'room_name_json': mark_safe(json.dumps(room_name)),
#         'username': mark_safe(json.dumps(request.user.username)),
#     })

from .models import Chat


# get the last 10 messages from a certian chat by it's id
def get_last_10_messages(chatId):
    chat = get_object_or_404(Chat, id=chatId)
    return chat.messages.order_by('-timestamp').all()[:10]
