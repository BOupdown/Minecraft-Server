from fastapi import FastAPI
from kubernetes import client, config
from typing import Dict
import subprocess

app = FastAPI()

# Initialize Kubernetes client
config.load_kube_config()  # Load from the kubeconfig file

namespace = "default"  # Specify the Kubernetes namespace
minecraft_deployment_name = "minecraft-server"  # Replace with your deployment name


@app.post("/start")
async def start_server():
    """Starts the Minecraft server."""
    try:
        api = client.AppsV1Api()
        # Patch the deployment to scale replicas to 1
        api.patch_namespaced_deployment_scale(
            name=minecraft_deployment_name,
            namespace=namespace,
            body={"spec": {"replicas": 1}}
        )
        return {"message": "Minecraft server started."}
    except Exception as e:
        return {"error": str(e)}


@app.post("/stop")
async def stop_server():
    """Stops the Minecraft server."""
    try:
        api = client.AppsV1Api()
        # Patch the deployment to scale replicas to 0
        api.patch_namespaced_deployment_scale(
            name=minecraft_deployment_name,
            namespace=namespace,
            body={"spec": {"replicas": 0}}
        )
        return {"message": "Minecraft server stopped."}
    except Exception as e:
        return {"error": str(e)}


@app.get("/logs")
async def get_logs():
    """Fetches logs from the Minecraft server pod."""
    try:
        api = client.CoreV1Api()
        pods = api.list_namespaced_pod(namespace=namespace, label_selector=f"app={minecraft_deployment_name}")
        if not pods.items:
            return {"message": "No running pods found for the Minecraft server."}

        pod_name = pods.items[0].metadata.name
        logs = api.read_namespaced_pod_log(name=pod_name, namespace=namespace, tail_lines=100)
        return {"logs": logs}
    except Exception as e:
        return {"error": str(e)}
