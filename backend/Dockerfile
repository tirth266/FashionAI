FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for FAISS and OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create necessary directories
RUN mkdir -p uploads dataset saved_models

EXPOSE 5000

# Run with 1 worker and 2 threads to stay within 512MB RAM.
# Bind to $PORT environment variable for Render.
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 1 --threads 2 --timeout 120 'app:create_app()'"]
