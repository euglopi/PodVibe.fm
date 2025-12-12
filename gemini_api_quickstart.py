from google import genai

# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="Explain how AI works in a few words"
)
print(response.text)


# ffmpeg command to cut a segment of an audio file with timestamp + offset
# ffmpeg -ss 60 -i input.mp3 -t 120 -c copy output.mp3
