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
};

const stopPropagation = function(e){
    e.stopPropagation()
};
// ciblage de tous les elements liens qui ouvre la modale avec la class js-modal
document.querySelectorAll(".js-modal").forEach(a=>{
    a.addEventListener("click",openModal)
});

window.addEventListener("keydown",function(e){
    console.log(e.key) //pour voir nom de la touche
    if(e.key ==="Escape"|| e.key ==="Esc"){
        closeModal(e)
    }
});



async function chargerModal() {
    try{
        const listeProjets=await attendreFetch();
        afficherProjetsModal(listeProjets);
        //remplirCatModal(listeProjets);

    }catch(error){
        console.error("erreur modale fetch",error);
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

//affichage des photos miniatures
function afficherProjetsModal(listeProjetsModal){
    const galerieModale=document.querySelector(".galerie-modal");
    galerieModale.innerHTML="";

    listeProjetsModal.forEach(projet=>{
       const figure = document.createElement ("figure");
       figure.classList.add("modal-projet");

        const img = document.createElement ("img");
        img.src = projet.imageUrl;
        img.title = projet.title;
        
        const btnTrash=document.createElement("button");
        btnTrash.type="button";
        btnTrash.classList.add("btn-trash");
        btnTrash.innerHTML='<i class="fa-solid fa-trash-can"></i>';

       // btnTrash.addEventListener("click",()=>{
       //     supprimerProjet(projet.id,figure);
       // });
          
        figure.appendChild(img);
        figure.appendChild(btnTrash);
        galerieModale.appendChild(figure);
        
    });

}

// Version page 2 de la modale avec partie upload photo
const modalversion=document.getElementById("modal1");
const btnAjouterPhoto=modalversion.querySelector(".btnModal");
const btnValider=modalversion.querySelector(".btn-valider");
const btnRetour=modalversion.querySelector(".btn-retour");
const titleModalV = modalversion.querySelector(".titleModal");
const sectionGalerie=document.getElementById("section-galerie");
const sectionAjout=document.getElementById("section-ajout");

btnAjouterPhoto.addEventListener("click",()=>{
    titleModalV.textContent="Ajouter une photo";
    sectionAjout.style.display="block";
    sectionGalerie.style.display="none";
    afficherCatModal()
    remplirCatModal()

});
btnRetour.addEventListener("click", ()=>{
    titleModalV.textContent="Galerie de photo";
    sectionAjout.style.display="none";
    sectionGalerie.style.display="block";
});

btnValider.addEventListener("click",()=>{
    //traitement des données et formulaire
    titleModalV.textContent="Galerie de photo";
    sectionAjout.style.display="none";
    sectionGalerie.style.display="block";

});


const formAjout=document.getElementById("form-ajout");
const chargerFichier=document.getElementById("charger-fichier");
const previsuContainer=document.getElementById("previsu_container");
const previsuImg=document.getElementById("previsu-img");
const titrePhoto=document.getElementById("titre-photo");
const categoriePhoto=document.getElementById("categorie-photo");
const errorMsgChargement=document.getElementById("error-message");


//prévisualisation de l'image sur sélection
chargerFichier.addEventListener("change",()=>{
   const fichier=chargerFichier.files[0];
    if(fichier){
        const url=URL.createObjectURL(fichier);
        previsuImg.src= url;
        previsuContainer.style.display="block";
    }else{
        //si annulation de la selection de photos
        previsuContainer.style.display="none";
        previsuImg.src="";
    }
});




//validation et envoi du formulaire
formAjout.addEventListener('submit', async function(event){
    event.preventDefault();
    errorMsgChargement.style.display="none";

    if (!formAjout.checkValidity()){
        formAjout.reportValidity();
        return;
    }

    const token=localStorage.getItem("token");
    if (!token){
        errorMsgChargement.textContent="Vous devez être connecté.";
        errorMsgChargement.style.display="block";
        return;
    }
    const formulaireRempli=new FormData(formAjout);

    try{
        const requete= await fetch('http://localhost:5678/api/works',{
            method:"POST",
            headers: { Authorization: `Bearer ${token}`},
            body: formulaireRempli
        });
        const dataF=await requete.json();
        console.log( "reponse de API:", dataF);
        if (!requete.ok){
            throw new Error(dataF.message || requete.status);
            
        await chargerModal();
        closeModal()
        }
    }catch(err){
    console.error("Echec envoir requete:", err);
    errorMsgChargement.textContent = err.message || "erreur serveur";
    errorMsgChargement.style.display="block";
  }
});



//Recuperation dynamique des catégories
function afficherCatModal(listeProjets){
      const projetsIdCAt = listeProjets.map(projet => [projet.categoryId , projet.category.name]);
    console.log("tableau tous les projets id/cat:",projetsIdCAt);
        // enleve doublons 
    const IdCat = new Map(projetsIdCAt); 
    console.log(IdCat);
        // obtient liste des noms/Id associés des categories triées
    const categoriesIdNom = Array.from(IdCat,([id, name]) => ({id ,name}));
    console.log("liste des catégories triées avec id :",categoriesIdNom);
}

// Remplissage dynamique des categories

function remplirCatModal(listeProjets){
    const categoriePhoto=document.getElementById("categorie-photo");
    categoriePhoto.innerHTML=`<option value=""></option>`;
    
    const cats= afficherCatModal(listeProjets);

    cats.forEach(c=>{
        const option=document.createElement("option");
        option.value=c.id;
        option.textContent=c.name;
        categoriePhoto.appendChild(option);
    });
}