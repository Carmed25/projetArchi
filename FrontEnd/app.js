import { attendreFetch} from "./data.js";

//variable qui permet de savoir quelle modale sera ouverte
let modal=null

//creation fonction qui ouvre la modale et trouver l'element cible sur le lien

document.addEventListener("DOMContentLoaded",async()=>{
    document.querySelectorAll(".js-modal").forEach(a=>{
    a.addEventListener("click",openModal)
    });
    window.addEventListener("keydown",function(e){
    console.log(e.key) //pour voir nom de la touche
    if(e.key ==="Escape"|| e.key ==="Esc"){
        closeModal(e)
    }
    });

    const liste=await attendreFetch();
    prepareAJoutForm(liste);

    const galerie=document.querySelector(".galerie-modal");
    //if (!galerie) return;
    galerie.addEventListener("click",async e=>{
        const btnT=e.target.closest(".btn-trash");
        if(!btnT) return;
        e.stopPropagation();

        const figure=btnT.closest("figure");
        const id=figure.dataset.id;
        const token=localStorage.getItem("authToken");

        try{
            const reponse=await fetch(`http://localhost:5678/api/works/${id}`,{
            method:"DELETE",
            headers:{Authorization:`Bearer ${token}`}
            }
            );
            console.log("status suppression:", reponse.status);
            if (!reponse.ok) 
                throw new Error(`Erreur ${reponse.status}`);

            figure.remove(); //enleve image mini et image de page d'accueil
            suppImgAccueil(id);
        }catch (err){
            console.error("echec de la suppression:",err);
            };      
    });
});

async function openModal(e){
    e.preventDefault()
    //sur mon element je recupere attribut href soit #modal1
    const target=document.querySelector(e.target.getAttribute("href"))
    if(!target)return console.error("modal cible non trouvée")
    // vérifie si la modale est deja ouverte, si oui ne rien faire
    if (modal === target){
        console.log ("la modale est déjà ouverte");
        return;
    }
    // si une autre modale est ouverte, la fermer
    if (modal !==null){
        closeModal(); //pour fermer l'autre modale si presente
    }
    //réinitialise le contenu de la modale:
    resetModalForm();

    //--réinitialise à V1 --V2 et btnRetour sont cachés
    const sectionGalerie=target.querySelector("#section-galerie");
    const sectionAjout = target.querySelector("#section-ajout");
    const btnRetour= target.querySelector(".btn-retour");

    sectionAjout.style.display="none";
    sectionGalerie.style.display="block";
    btnRetour.style.display="none";

    //décache/affiche la boite modale:
    target.style.display=null;
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal","true")
    //permet de savoir la modale ciblée qui est ouverte
    modal=target;

    //pour fermeture => ajout des ecouteurs
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-closeModal").addEventListener("click",closeModal)
    modal.querySelector(".js-stopModal").addEventListener("click",stopPropagation)

    // charger et afficher les projets
    await chargerModal();
};


function closeModal (e){
    if (modal === null) return ;//si modal n'existe pas ou(!modal), ne rien faire
    e.preventDefault()
    //masque la modale
    modal.style.display ="none";
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    //reinitialise la modale previsu:
    resetModalForm();
    //enleve les listener
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-closeModal").removeEventListener("click",closeModal)
    modal.querySelector(".js-stopModal").removeEventListener("click",stopPropagation)
    //reinitialise la variable modal
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
        // ajout pour supp avec data id
        figure.setAttribute('data-id',projet.id);
        console.log("ajout modale figure id:",projet.id);

        const img = document.createElement ("img");
        img.src = projet.imageUrl;
        img.title = projet.title;
        //img.setAttribute('data-id',projet.id);
        const btnTrash=document.createElement("button");
        btnTrash.type="button";
        btnTrash.classList.add("btn-trash");
        btnTrash.innerHTML='<i class="fa-solid fa-trash-can"></i>';
      
        figure.appendChild(img);
        figure.appendChild(btnTrash);
        galerieModale.appendChild(figure);
});
}

// Version page1/page 2 de la modale avec partie upload photo
function changerVersionModale(liste){
    const modalVersion=modal;
    const btnModal=modalVersion.querySelector(".btnModal");
    const titleModalV = modalVersion.querySelector(".titleModal");
    const sectionGalerie=document.getElementById("section-galerie");
    const sectionAjout=document.getElementById("section-ajout");
    const btnRetour=modalVersion.querySelector(".btn-retour");
    const btnValider=modalVersion.querySelector(".btn-valider");

    //bouton pour passer à V2 "prévisu-ajouter une photo"
    btnModal.addEventListener("click",()=>{
        titleModalV.textContent="Ajouter une photo";
        sectionAjout.style.display="block";
        sectionGalerie.style.display="none";
        btnRetour.style.display="block"; // ajout du btn retour
    });

    //bouton pour passer à V1 "galerie de photos"
    btnRetour.addEventListener("click", ()=>{
        titleModalV.textContent="Galerie de photo";
        sectionAjout.style.display="none";
        sectionGalerie.style.display="block";
        btnRetour.style.display="none"; // cache bouton retour quand retourne galerie
        resetModalForm();
    });

    btnValider.addEventListener("click",()=>{
    //traitement des données et formulaire
        titleModalV.textContent="Galerie de photo";
        sectionAjout.style.display="none";
        sectionGalerie.style.display="block";
        btnRetour.style.display="none";

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
    const btnSubmit=document.getElementById("submit");


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


    function checkContenu(){
        if (//previsuImg.src &&
            chargerFichier.files.length > 0 && titrePhoto.value.trim()!=="" && categoriePhoto.value!==""){
                btnSubmit.disabled=false;
                btnSubmit.classList.add('green');
                btnSubmit.classList.remove('btn-valider');
        }else{
            btnSubmit.disabled=true;
            btnSubmit.classList.remove('green');
            btnSubmit.classList.add('btn-valider');
        }
    }

    //prévisualisation de l'image sur sélection et checkprevisu
   
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
        checkContenu();
    });

    titrePhoto.addEventListener("input",checkContenu);
    categoriePhoto.addEventListener("change",checkContenu);

    formAjout.addEventListener('submit', async function(event){
        event.preventDefault();
        errorMsgChargement.style.display="none";

        checkContenu();

        if (btnSubmit.disabled){
            errorMsgChargement.textContent="tous les champs doivent etre remplis";
            errorMsgChargement.style.display="block";
            return;
        }

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
            const img=document.createElement("img");
            
            fig.classList.add("modal-projet");//".modal-projet"
            img.src=dataF.imageUrl;
            img.alt=dataF.title;
            img.setAttribute('data-id',dataF.id);
            fig.setAttribute('data-id',dataF.id);
            console.log ("ajout modale figure id",dataF.id);
            
            const btnTrash=document.createElement("button");
            btnTrash.type="button";
            btnTrash.classList.add("btn-trash");
            btnTrash.innerHTML=`<i class="fa-solid fa-trash-can"></i>`;
          
            fig.appendChild(img);
            fig.appendChild(btnTrash);
            galerie.appendChild(fig);

                //ajout à la galerie page d'accueil :
            const galerieAccueil=document.querySelector(".gallery");
            const figAccueil=document.createElement("figure");
            figAccueil.classList.add("img");
            const imgAccueil=document.createElement("img");
            imgAccueil.src=dataF.imageUrl;
            imgAccueil.alt=dataF.title;
            imgAccueil.setAttribute('data-id',dataF.id);
            figAccueil.setAttribute('data-id',dataF.id);
            const figcaption=document.createElement("figcaption");
            figcaption.textContent=dataF.title;

            figAccueil.appendChild(imgAccueil);
            figAccueil.appendChild(figcaption);
            galerieAccueil.appendChild(figAccueil);

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
    chargerPhoto.style.display='flex';

    const btnSubmit=document.getElementById("submit");
    btnSubmit.disabled=true;
    btnSubmit.classList.remove('green');
    btnSubmit.classList.add('btn-valider');
}



function suppImgAccueil(imageId) {
    const mainGallery=document.querySelector(".gallery");
    const figureToRemove=mainGallery.querySelector(`figure[data-id="${imageId}"]`);
    if (figureToRemove){    
            figureToRemove.remove(); // On supprime l'ensemble du <figure> (image + titre)
        } else {
        console.log("Image avec l'ID", imageId, "non trouvée dans la page d'accueil");
        }
};
