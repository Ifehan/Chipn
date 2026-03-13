FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# H-5: Run as non-root user — limits blast radius if the app is compromised
RUN addgroup --system chipn && adduser --system --ingroup chipn chipn
RUN chown -R chipn:chipn /app
USER chipn

EXPOSE 8000

# L-4: Use Gunicorn with uvicorn workers in production (4 workers)
CMD ["gunicorn", "app.main:app", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "-w", "4", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "60", \
     "--access-logfile", "-"]
