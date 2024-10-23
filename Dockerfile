# Use a base image with curl and kubectl
FROM bitnami/kubectl:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy your Kubernetes deployment and service YAML files into the container
COPY deployment/deployment.yml ./deployment.yml
COPY deployment/service.yml ./service.yml

# Copy your entrypoint script directly with executable permissions
COPY --chmod=755 entrypoint.sh .

# Set the entrypoint to use sh to execute your script
ENTRYPOINT ["sh", "./entrypoint.sh"]
