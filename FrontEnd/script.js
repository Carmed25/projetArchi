const galerie = document.querySelector(".gallery");
 
//fonction qui permet de voir si on recupère correctement les données

async function attendreFetch() {
    const reponse = await fetch("http://localhost:5678/api/works");
    if (!reponse.ok) {
        throw new Error(reponse.status);
    }
    return reponse.json()
}

// afficher les travaux dans leur bon emplacement
function afficherProjets(projets){
    galerie.innerHTML= ""; //vide gallery

        //for(let i=0 ; i<listeProjets.length; i++){
            //let projet = listeProjets[i];});
    projets.forEach(projet => {
        const figure = document.createElement ("figure");
        const img = document.createElement ("img");
        const figcaption = document.createElement ( "figcaption");

        img.src = projet.imageUrl;
        img.title = projet.title;
        figcaption.textContent= projet.title;
          
        figure.appendChild(img);
        figure.appendChild(figcaption);
        galerie.appendChild(figure);

    })
}

//fonction qui récupère et affiche les travaux
async function chargerProjets(listeProjets){
    try {
        const listeProjets = await attendreFetch()
        afficherProjets(listeProjets);
        
    } catch (error) {
        console.log("Erreur chargement des projets :"+ error.message);
    }
}

chargerProjets();

// pARTIE FILTRE A RETRAVAILLER --> Optimisation  
    const reponse = await fetch("http://localhost:5678/api/works");
    const listeProjets = await reponse.json();

  //TODO recuperation de toutes les categoriesId 
  //TODO générer dynamiquement les boutons via javaS selon leur nom de categorie
  // async function filter() {

  const btnTous= document.querySelector(".btn-Tous");
  btnTous.addEventListener("click",function(){
    const projetsFiltres= listeProjets.filter(function(listeProjets){
        return listeProjets.categoryId > 0 ;
   
    });
    console.log(projetsFiltres)
    afficherProjets(projetsFiltres)
  })
 

const btnObjets=document.querySelector(".btn-Objets");
btnObjets.addEventListener("click",function(){
    const projetsFiltres= listeProjets.filter(function(listeProjets){
        return listeProjets.categoryId === 1;
    });
    console.log(projetsFiltres)
    afficherProjets(projetsFiltres)
})

const btnAppartements=document.querySelector(".btn-Appart");
btnAppartements.addEventListener("click",function(){
    const projetsFiltres= listeProjets.filter(function(listeProjets){
        return listeProjets.categoryId === 2;
    });
    console.log(projetsFiltres)
    afficherProjets(projetsFiltres)
})

const btnHotelRestaurant=document.querySelector(".btn-Hotel-Restau");
btnHotelRestaurant.addEventListener("click",function(){
    const projetsFiltres= listeProjets.filter(function(listeProjets){
        return listeProjets.categoryId === 3;
    });
    console.log(projetsFiltres)
    afficherProjets(projetsFiltres)

})