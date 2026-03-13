FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# H-5: Run as non-root user
RUN addgroup --system chipn && adduser --system --ingroup chipn chipn
RUN chown -R chipn:chipn /app
USER chipn

EXPOSE 8000

# Railway overrides this via railway.toml startCommand (uses $PORT)
# This fallback is used for local docker-compose only
CMD ["gunicorn", "app.main:app", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "-w", "4", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "60", \
     "--access-logfile", "-"]
