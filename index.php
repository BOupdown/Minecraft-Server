<?php
if (isset($_POST['execute'])) {
    // Commandes à exécuter sur localhost
    $output1 = shell_exec('kubectl apply -f deployment/deployment.yml 2>&1');
    $output2 = shell_exec('kubectl apply -f deployment/service.yml 2>&1');
    $output3 = shell_exec('kubectl port-forward service/demominecraft 25565:25565 2>&1');

    // Affiche les résultats
    echo "<pre>$output1</pre>";
    echo "<pre>$output2</pre>";
    echo "<pre>$output3</pre>";
}
?>

<form method="post">
    <button type="submit" name="execute">Exécuter les commandes Kubernetes</button>
</form>
