// ******FONCTION AFFICHAGE DE LA MODALE connexion/deconnexion
   
document.addEventListener('DOMContentLoaded', () => {
    const topBar =document.getElementById("topBar") 
    const loginBtn=document.getElementById("login") //btn connexion
    const logoutBtn=document.getElementById("logout") //btn deconnexion
    const token = localStorage.getItem('authToken') //recup token d'authentification
    const menuFiltre=document.querySelector(".menu-filtres") 
    const connexionModale=document.querySelector(".connexion-modale") // btn modifier et icone et aside modale
    console.log('DOMContentLoaded', { topBar, loginBtn, logoutBtn, token });
    
    //fonction qui affiche ou masque les elements selon la connexion 
    function connexion(){
        // verifie si token est stocké/present et utilisateur est donc connecté et le converti en booleen
        const isLoggedIn = !!localStorage.getItem('authToken');
        console.log('connexion()', { isLoggedIn });
        if (isLoggedIn){
        
            topBar.classList.add("topBar") 
            topBar.classList.remove("hide")     
            loginBtn.classList.add("hide") // masque le btn connexion
            logoutBtn.classList.remove("hide") // affiche le btn deconnexion
            menuFiltre.classList.add("hide")
            connexionModale.classList.remove("hide") // affiche la modale
        } else {
            topBar.classList.add("hide")
            topBar.classList.remove("topBar")
            logoutBtn.classList.add("hide")
            loginBtn.classList.remove("hide")
            menuFiltre.classList.remove("hide")
            connexionModale.classList.add("hide")
        }
        console.log('Classes après update :', topBar.className);
    }
    //appel la fonction lors du chargement de la page pour initialiser etat de connexion
    connexion();

    // listener pour la deconnexion
    logoutBtn.addEventListener("click",(event)=>{
        console.log('Logout clicked');
        event.preventDefault();
        localStorage.removeItem("authToken"); // supprime le token et MAJ interface utilisateur
        connexion(); // MAJ de l'affichage (connexion ou pas)
        //window.location.reload();
         window.location.href="index.html";
    });
});