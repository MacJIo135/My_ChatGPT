import json

import openai

from django.shortcuts import render, redirect

from .models import Message
from .forms import MessageForm

# Create your views here.

# Key API OpenAI
openai.api_key = "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"


def chat_view(request):
    if request.method == 'POST':

        content_type = request.META.get('CONTENT_TYPE', '')

        # Voice message
        if content_type == 'application/json':
            data = json.loads(request.body)

            # getting text from JSON
            received_text = data.get('text', '')

            if len(received_text) > 0:
                print(received_text)
                user_message = Message(user_message=received_text)

                user_message.save()

                # Getting answer from model openai
                response = handle_message(received_text)
                response_message = Message(model_response=response)
                response_message.save()

                form = MessageForm()

                messages = Message.objects.all().order_by('-timestamp')
                return render(request, 'chat.html', {'form': form, 'messages': messages, 'generated_response': response})
            else:
                return redirect('chat')

        # Text message
        elif content_type == 'application/x-www-form-urlencoded':
            content = request.POST.get('content')

            if len(content) > 0:
                print(content)

                # Save message from user to db
                user_message = Message(user_message=content)

                user_message.save()

                # Save message from model openai to db
                response = handle_message(content)
                response_message = Message(model_response=response)
                response_message.save()

                return redirect('chat')
            else:
                return redirect('chat')

    else:
        form = MessageForm()

    messages = Message.objects.all().order_by('-timestamp')

    return render(request, 'chat.html', {'form': form, 'messages': messages})


def handle_message(message_text):
    text = message_text
    response = openai.Completion.create(
        engine="gpt-3.5-turbo-instruct",
        prompt=f"Я: {text}\nVoiceGPT:",
        temperature=0.5,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    reply = response.choices[0].text.strip()
    return reply
