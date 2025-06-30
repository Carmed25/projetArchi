
   
document.addEventListener('DOMContentLoaded', () => {
    const topBar =document.getElementById("topBar")
    const loginBtn=document.getElementById("login")
    const logoutBtn=document.getElementById("logout")
    const token = localStorage.getItem('authToken')
    const menuFiltre=document.querySelector(".menu-filtres")
    const connexionModale=document.querySelector(".connexion-modale")
console.log('DOMContentLoaded', { topBar, loginBtn, logoutBtn, token });
    

    function connexion(){
        const isLoggedIn = !!localStorage.getItem('authToken');
    console.log('connexion()', { isLoggedIn });
        if (isLoggedIn){
        
            topBar.classList.add("topBar") 
            topBar.classList.remove("hide")     
            loginBtn.classList.add("hide")
            logoutBtn.classList.remove("hide")
            menuFiltre.classList.add("hide")
            connexionModale.classList.remove("hide")
        }   else {
            topBar.classList.add("hide")
            topBar.classList.remove("topBar")
            logoutBtn.classList.add("hide")
            loginBtn.classList.remove("hide")
            menuFiltre.classList.remove("hide")
            connexionModale.classList.add("hide")
        }
        console.log('Classes après update :', topBar.className);
    }

  connexion();
logoutBtn.addEventListener("click",(event)=>{
    console.log('Logout clicked');
    event.preventDefault();
    localStorage.removeItem("authToken");
    connexion()
    window.location.reload();
});
});