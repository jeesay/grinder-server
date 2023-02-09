# Example baseline and cosmic ray with websockets

app.py : server  

To launch :  
    >python3 app.py  
    >python3 -m http.server  
  
src : code files
data : folder for raw and generate data

Issue on app.py :  
Envoie le message de retour au main.js avant que le script python se termine, appeler une fonction qui retourne les resultats sans chercher le fichier json et ne pas utiliser l'appel de script ?
