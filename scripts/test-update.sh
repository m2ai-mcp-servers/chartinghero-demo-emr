#!/bin/bash
# Test script to verify Supabase -> Dashboard flow
# Run this while watching https://pointcare-emr-demo.netlify.app/visit/VN-30001
#
# SETUP: Set these environment variables before running:
#   export SUPABASE_URL="https://your-project.supabase.co"
#   export SUPABASE_KEY="your-anon-key"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "ERROR: Set SUPABASE_URL and SUPABASE_KEY environment variables first."
  echo ""
  echo "  export SUPABASE_URL=\"https://your-project.supabase.co\""
  echo "  export SUPABASE_KEY=\"your-anon-key\""
  exit 1
fi

echo "==========================================="
echo "PointCare EMR - Supabase Update Test"
echo "==========================================="
echo ""
echo "Open this URL in your browser FIRST:"
echo "https://pointcare-emr-demo.netlify.app/visit/VN-30001"
echo ""
echo "Press ENTER when ready to send update..."
read

# Generate random vitals to show change
BP_SYS=$((130 + RANDOM % 20))
BP_DIA=$((75 + RANDOM % 15))
HR=$((70 + RANDOM % 20))
O2=$((95 + RANDOM % 5))
TEMP=$(echo "scale=1; 97.5 + $(($RANDOM % 20)) / 10" | bc)
GLUCOSE=$((120 + RANDOM % 40))

echo ""
echo "Sending vitals update to Supabase..."
echo "  BP: ${BP_SYS}/${BP_DIA} mmHg"
echo "  HR: ${HR} bpm"
echo "  O2: ${O2}%"
echo "  Temp: ${TEMP}F"
echo "  Glucose: ${GLUCOSE} mg/dL"
echo ""

curl -s -X PATCH "${SUPABASE_URL}/rest/v1/visits?id=eq.VN-30001" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{
    \"vital_signs\": {
      \"bloodPressureSystolic\": ${BP_SYS},
      \"bloodPressureDiastolic\": ${BP_DIA},
      \"heartRate\": ${HR},
      \"oxygenSaturation\": ${O2},
      \"temperature\": ${TEMP},
      \"temperatureUnit\": \"F\",
      \"respiratoryRate\": 16,
      \"painLevel\": 2,
      \"weight\": 156,
      \"weightUnit\": \"lbs\",
      \"bloodGlucose\": ${GLUCOSE},
      \"glucoseUnit\": \"mg/dL\",
      \"glucoseTiming\": \"fasting\"
    }
  }" | head -c 200

echo ""
echo ""
echo "Update sent! Watch the dashboard - vitals should highlight yellow."
echo ""
echo "Press ENTER to send another update, or Ctrl+C to exit..."

while true; do
  read

  BP_SYS=$((130 + RANDOM % 20))
  BP_DIA=$((75 + RANDOM % 15))
  HR=$((70 + RANDOM % 20))
  O2=$((95 + RANDOM % 5))
  GLUCOSE=$((120 + RANDOM % 40))

  echo "Sending new vitals: BP ${BP_SYS}/${BP_DIA}, HR ${HR}, O2 ${O2}%, Glucose ${GLUCOSE}..."

  curl -s -X PATCH "${SUPABASE_URL}/rest/v1/visits?id=eq.VN-30001" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{
      \"vital_signs\": {
        \"bloodPressureSystolic\": ${BP_SYS},
        \"bloodPressureDiastolic\": ${BP_DIA},
        \"heartRate\": ${HR},
        \"oxygenSaturation\": ${O2},
        \"temperature\": 98.4,
        \"temperatureUnit\": \"F\",
        \"respiratoryRate\": 16,
        \"painLevel\": 2,
        \"weight\": 156,
        \"weightUnit\": \"lbs\",
        \"bloodGlucose\": ${GLUCOSE},
        \"glucoseUnit\": \"mg/dL\",
        \"glucoseTiming\": \"fasting\"
      }
    }" > /dev/null

  echo "Sent! Watch the dashboard..."
  echo ""
done
