# chat/forms.py
from django import forms


class MessageForm(forms.Form):
    content = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Введіть ваше повідомлення'}))
    voice_message = forms.FileField(required=False)
    input_type = forms.CharField(widget=forms.HiddenInput())  # Тип введення (текст або голос)
