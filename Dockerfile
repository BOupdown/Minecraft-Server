# Use the base Ubuntu image
FROM ubuntu:latest

# Create a non-root user (minikubeuser)
RUN useradd -m minikubeuser

# Install Minikube
RUN curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && \
    install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
# Switch to root user for chmod
USER root

# Add minikubeuser to the Docker group
RUN groupadd -g 999 docker && usermod -aG docker minikubeuser

# Switch back to minikubeuser
USER minikubeuser
# Copy all files into the /app directory in the container
COPY . /app/


# Give execution permissions to the start-kubectl.sh script
RUN chmod +x /app/start-kubectl.sh

# Switch back to non-root user
USER minikubeuser

# Define the command to run
CMD ["bash", "/app/start-kubectl.sh"]

# Switch back to root to modify user groups
USER root


