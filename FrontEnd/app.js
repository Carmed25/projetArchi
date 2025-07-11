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

document.querySelectorAll(".js-modal").forEach(a=>{
    a.addEventListener("click",openModal)
});

window.addEventListener("keydown",function(e){
    console.log(e.key) //pour voir nom de la touche
    if(e.key ==="Escape"|| e.key ==="Esc"){
        closeModal(e)
    }
});

function closeModal (e){
    if (modal===null) return //si modal n'existe pas ou(!modal)
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




async function chargerModal() {
    try{
        const liste=await attendreFetch();
        afficherProjetsModal(liste); // affichage des miniatures avec btn-trash et DELETE si clic
        changerVersionModale(liste); // affichage boite previsu et fonction prepareForm pour envoi formulaire
       
        //remplirCatModal(liste);
    }catch(error){
        console.error("erreur modale fetch",error);
    }  
} 



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
      
        figure.appendChild(img);
        figure.appendChild(btnTrash);
        galerieModale.appendChild(figure);

        btnTrash.addEventListener("click",async e=>{
            e.stopPropagation();
          //supprimerProjet(projet.id,figure);
          const id=figure.dataset.id;
          const token=localStorage.getItem("authToken");

          try{
            const reponse=await fetch(`http://localhost:5678/api/works/${id}`,{
                method:"DELETE",
                headers:{Authorization:`Bearer ${token}`}
            }
          );
          console.log("status suppression:", reponse.status);
          if (!reponse.ok) throw new Error('Erreur ${reponse.status}');

          figure.remove(); //TODO enlever egalement image de page d'accueil
          suppImgAccueil(id);
       }catch (err){
            console.error("echec de la suppression:",err);
       };
        
    });

})}

// Version page1/page 2 de la modale avec partie upload photo
function changerVersionModale(liste){
    const modalVersion=modal;
    const btnModal=modalVersion.querySelector(".btnModal");
    const titleModalV = modalVersion.querySelector(".titleModal");
    const sectionGalerie=document.getElementById("section-galerie");
    const sectionAjout=document.getElementById("section-ajout");
    const btnRetour=modalVersion.querySelector(".btn-retour");
    const btnValider=modalVersion.querySelector(".btn-valider");

    btnModal.addEventListener("click",()=>{
        titleModalV.textContent="Ajouter une photo";
        sectionAjout.style.display="block";
        sectionGalerie.style.display="none";
        btnRetour.style.display="block";
        prepareAJoutForm(liste);
            //afficherCatModal()
            //remplirCatModal()

});

    btnRetour.addEventListener("click", ()=>{
        titleModalV.textContent="Galerie de photo";
        sectionAjout.style.display="none";
        sectionGalerie.style.display="block";
        btnRetour.style.display="none";
    });


    btnValider.addEventListener("click",()=>{
    //traitement des données et formulaire
        titleModalV.textContent="Galerie de photo";
        sectionAjout.style.display="none";
        sectionGalerie.style.display="block";

    });
}

function prepareAJoutForm(liste){
    
    const chargerFichier=document.getElementById("charger-fichier");
    const previsuContainer=document.getElementById("previsu_container");
    const previsuImg=document.getElementById("previsu-img");
    const titrePhoto=document.getElementById("titre-photo");
    const categoriePhoto=document.getElementById("categorie-photo");
    const formAjout=document.getElementById("form-ajout");
    const errorMsgChargement=document.getElementById("error-message");
    const chargerPhoto=document.getElementById("charger-photo");


    //prévisualisation de l'image sur sélection
    chargerFichier.addEventListener("change",()=>{
    const fichier=chargerFichier.files[0];
        if(fichier){
            const url=URL.createObjectURL(fichier);
            previsuImg.src= url;
            previsuContainer.style.display="block";
            chargerPhoto.style.display="none";
        }else{
            //si annulation de la selection de photos
            previsuContainer.style.display="none";
            previsuImg.src="";
            chargerPhoto.style.display="block"
        }
    });


    //Recuperation dynamique des catégories

    const projetsIdCAt = liste.map(projet => [projet.categoryId , projet.category.name]);
    console.log("tableau tous les projets id/cat:",projetsIdCAt);
        // enleve doublons 
    const IdCat = new Map(projetsIdCAt); 
    console.log(IdCat);
        // obtient liste des noms/Id associés des categories triées
    const categoriesIdNom = Array.from(IdCat,([id, name]) => ({id ,name}));
    console.log("liste des catégories triées avec id :",categoriesIdNom);


    // Remplissage dynamique des categories

    categoriePhoto.innerHTML=`<option value=""></option>`;

    categoriesIdNom.forEach(c=>{
        const option=document.createElement("option");
        option.value=c.id;
        option.textContent=c.name;
        categoriePhoto.appendChild(option);
    });

   

    //validation et envoi du formulaire
    
    formAjout.addEventListener('submit', async function(event){
        event.preventDefault();
        errorMsgChargement.style.display="none";

        if (!formAjout.checkValidity()){
            formAjout.reportValidity();
            return;
        }

        const token=localStorage.getItem("authToken");
        console.log("token present=",token);
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
            }

            const galerie = document.querySelector(".galerie-modal");
            const fig = document.createElement("figure");
            fig.classList.add("modal-projet");//".modal-projet"
            const img=document.createElement("img");
            img.src=dataF.imageUrl;
            img.alt=dataF.title;
            img.setAttribute('data-id',dataF.id);

            const btnTrash=document.createElement("button");
            btnTrash.type="button";
            btnTrash.classList.add("btn-trash");
            btnTrash.innerHTML=`<i class="fa-solid fa-trash-can"></i>`;
          
            fig.appendChild(img);
            fig.appendChild(btnTrash);
            galerie.appendChild(fig);

            resetModalForm();

         
    }catch(err){
    console.error("Echec envoi requete:", err);
    errorMsgChargement.textContent = err.message || "erreur serveur";
    errorMsgChargement.style.display="block";
  }
});

}
 
function resetModalForm(){
   const chargerFichier=document.getElementById("charger-fichier");
    const previsuContainer=document.getElementById("previsu_container");
    const previsuImg=document.getElementById("previsu-img");
    const titrePhoto=document.getElementById("titre-photo");
    const categoriePhoto=document.getElementById("categorie-photo");
    const chargerPhoto=document.getElementById("charger-photo");

    chargerFichier.value='';
    previsuContainer.style.display='none';
    previsuImg.src='';
    titrePhoto.value='';
    categoriePhoto.value='';
    chargerPhoto.style.display='block';
}

function suppImgAccueil(imageId) {
    const mainGallery=document.querySelector(".gallery");
    const imgToRemove=mainGallery.querySelector(`[data-id="${imageId}"]`);
    if (imgToRemove){
        imgToRemove.remove();
    }
};