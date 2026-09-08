#!/bin/bash
# Generuje mp3 czytanki przez ElevenLabs TTS.
# Uzycie: ./generuj.sh teksty/01-moje-lato-z-szablozebnym.txt
# Wynik laduje w ../public/audio/czytanki/<nazwa>.mp3
set -e
cd "$(dirname "$0")"

VOICE_ID="Bz1e1clEKwgN71Vx7cxj" # Asia - Warm and Friendly Native Polish
MODEL="eleven_multilingual_v2"

line=$(grep ELEVEN_LABS_API_KEY ../.env.local | tr -d '\r')
KEY="${line#*=}"; KEY="${KEY%\"}"; KEY="${KEY#\"}"

TXT="$1"
NAME=$(basename "$TXT" .txt)
OUT="../public/audio/czytanki/${NAME#[0-9][0-9]-}.mp3"
mkdir -p ../public/audio/czytanki

python - "$TXT" <<'EOF' > /tmp/tts-payload.json
import json, sys
text = open(sys.argv[1], encoding='utf-8').read()
json.dump({
    "text": text,
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.3, "speed": 0.95}
}, open('/tmp/tts-payload.json.tmp','w'))
print(open('/tmp/tts-payload.json.tmp').read())
EOF

curl -s -f -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128" \
  -H "xi-api-key: $KEY" -H "Content-Type: application/json" \
  --data @/tmp/tts-payload.json -o "$OUT"

ls -la "$OUT"
