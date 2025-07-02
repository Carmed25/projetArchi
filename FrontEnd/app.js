import { attendreFetch} from "./data.js";

//variable qui permet de savoir quelle modale sera ouverte
let modal=null
//creation fonction qui ouvre la modale et trouver l'element cible sur le lien
const openModal=async function(e){
    e.preventDefault()
    //sur mon element je recupere attribut href soit #modal1
    // ou e.target.getAttribute("href")
    const target=document.querySelector(e.target.getAttribute("href"))
    if(!target)return console.error("modal cible non trouvée")
    //peut mettre erreur pr voir si on recupere la cible
    //décache la boite modale
    //*****affiche la modale */
    target.style.display=null;
    //target.setAttribute("aria-hidden",false)
    //ou 
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal","true")
    //permet de savoir la modale ciblée qui est ouverte
    ///chargerProjetsModal()
    modal=target

    //quand click sur cette modale, fermeture
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-closeModal").addEventListener("click",closeModal)
    modal.querySelector(".js-stopModal").addEventListener("click",stopPropagation)

    // charger et afficher les projets
    await chargerModal();
   };

const closeModal=function(e){
    if (modal===null) return //si modal n'existe pas 
    e.preventDefault()
    modal.style.display ="none";
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    //enleve le listener
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-closeModal").removeEventListener("click",closeModal)
    modal.querySelector(".js-stopModal").removeEventListener("click",stopPropagation)
    modal= null
}

const stopPropagation = function(e){
    e.stopPropagation()
}
// ciblage de tous les elements liens qui ouvre la modale avec la class js-modal
document.querySelectorAll(".js-modal").forEach(a=>{
    a.addEventListener("click",openModal)
})

window.addEventListener("keydown",function(e){
    console.log(e.key) //pour voir nom de la touche
    if(e.key ==="Escape"|| e.key ==="Esc"){
        closeModal(e)
    }
})



 async function chargerModal() {
    try{const listeProjetsModal=await attendreFetch();
        afficherProjetsModal(listeProjetsModal);

    }catch(error){
        console.error("erreur modale fetch",error)
    }
    
}





//document.addEventListener("DOMContentLoaded", async()=>{
//try {
  //      const listeProjetsModal = await attendreFetch()
    //    afficherProjetsModal(listeProjetsModal);
      //  //genererFiltres(listeProjets)
    //} catch (error) {
      //  console.log("Erreur chargement des projets :"+ error.message);
    //}
//})
function afficherProjetsModal(listeProjetsModal){
    const galerieModale=document.querySelector(".galerie-modal");
    galerieModale.innerHTML="";

    listeProjetsModal.forEach(projet=>{
       const figure = document.createElement ("figure");
        const img = document.createElement ("img");

        img.src = projet.imageUrl;
        img.title = projet.title;
          
        figure.appendChild(img);
        galerieModale.appendChild(figure);
        
    });

}