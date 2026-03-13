FROM python:3.12-slim

WORKDIR /app

# Copy and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# H-5: Run as non-root user
RUN addgroup --system chipn && adduser --system --ingroup chipn chipn
RUN chown -R chipn:chipn /app
USER chipn

EXPOSE 8000

# Railway overrides PORT via environment variable
CMD ["sh", "-c", "gunicorn app.main:app -k uvicorn.workers.UvicornWorker -w 4 --bind 0.0.0.0:${PORT:-8000} --timeout 60 --access-logfile -"]
