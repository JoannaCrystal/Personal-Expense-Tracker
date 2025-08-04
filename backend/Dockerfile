FROM python:3.11

WORKDIR /app

# First, copy the requirements file separately (leverages cache)
COPY ./requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r /app/requirements.txt

# Then copy the rest of your backend code
COPY . /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
