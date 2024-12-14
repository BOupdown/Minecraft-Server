# Use the base Ubuntu image
FROM ubuntu:latest

# Update and install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    sudo \
    && rm -rf /var/lib/apt/lists/*



# Install Docker in the container
RUN apt-get update && apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Install Minikube
RUN curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && \
    install minikube-linux-amd64 /usr/local/bin/minikube && \
    rm minikube-linux-amd64

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256" && \
    echo "$(cat kubectl.sha256) kubectl" | sha256sum --check && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
    apt-get install -y conntrack



# Add a non-root user (minikubeuser) and add it to the Docker group
RUN useradd -m -d /home/minikubeuser minikubeuser && \
    groupadd -g 999 docker || true && \
    usermod -aG docker minikubeuser && \
    mkdir -p /home/minikubeuser/.kube

# Copy all files into the /app directory in the container
COPY . /app/

# Give execution permissions to the start-kubectl.sh script
RUN chmod +x /app/start-kubectl.sh

# Define the command to run
CMD ["bash", "/app/start-kubectl.sh"]