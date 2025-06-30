const formulaireLogin =document.getElementById("login-form");
const emailC=document.getElementById("email");
const passwordC =document.getElementById("password");
const loginMsg=document.getElementById("login-message")

formulaireLogin.addEventListener('submit', async function(event){
    event.preventDefault();
    console.log('formulaire soumis');
   
    const chargeUtile={
        "email": emailC.value,
        "password": passwordC.value
    }
        //envoi requete POst au backend

    try{ 
        const requete=await fetch('http://localhost:5678/api/users/login',{
            method:'POST',
            headers: {
                "Content-Type":"application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(chargeUtile) 
         });
        const data =await requete.json();
        console.log("reponse de API:",data);
        if (requete.ok===true) {
        
            const token= data.token
            console.log('connexion reussie');
      // Succès => contenu attendu : token + éventuellement user info
      //console.log(token)
      // Stockage sécurisé
            localStorage.setItem("authToken", token);
            console.log('Token stocké:', localStorage.getItem('authToken'));
      // Redirection vers la page d’accueil
            window.location.replace ("index.html");
        } else {
      // Affichage de l’erreur
            console.log('erreur de connexion:',data.message)
            loginMsg.textContent = data.message || 'Identifiants incorrects';
       
    }
}catch (error) {
    console.error("Erreur:", error);
    loginMsg.textContent = "Une erreur s'est produite.Réessayer plus tard.";
  }
}
)