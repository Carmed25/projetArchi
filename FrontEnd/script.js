console.log("script chargé")

const galerie = document.querySelector(".gallery");
 
//fonction qui permet de voir si on recupère correctement les données
async function attendreFetch() {
    const reponse = await fetch("http://localhost:5678/api/works");
    if (!reponse.ok) 
        throw new Error(reponse.status);
    const data = await reponse.json();
    console.log ("données recues:", data);
    //return reponse.json()
    return data;
}

// afficher les travaux dans leur bon emplacement
function afficherProjets(projets){
    galerie.innerHTML= "";
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


// Partie Filtre 

const listeProjets = await attendreFetch();
  
    // Recuperation de toutes les categoriesId

        //obtient tableau de nomcategorie/id de tous les projets
const projetsIdCAt = listeProjets.map(projet => [projet.categoryId , projet.category.name]);
    console.log("tableau tous les projets id/cat:",projetsIdCAt);
        // enleve doublons 
const IdCat = new Map(projetsIdCAt); 
    console.log(IdCat);
        // obtient liste des noms/Id associés des categories triées
const categoriesIdNom = Array.from(IdCat,([id, name]) => ({id ,name}));
    console.log("liste des catégories triées avec id :",categoriesIdNom);


    //générer dynamiquement les boutons via javaS selon leur nom de categorie
    
const menuFiltre = document.querySelector(".menu-filtres");
const btnTous = document.createElement ("button");
    btnTous.textContent= "Tous";
    btnTous.dataset.cat =0;
    btnTous.classList.add("btn-filter");
    menuFiltre.appendChild(btnTous);

categoriesIdNom.forEach(categorie=>{
    const btn = document.createElement("button");
        btn.textContent=categorie.name;
        btn.dataset.cat = categorie.id;
        btn.classList.add("btn-filter");
        menuFiltre.appendChild(btn);
});

document.querySelectorAll(".btn-filter").forEach(btn=>{
    btn.addEventListener("click",()=>{
        const nbrcatId = Number(btn.dataset.cat);
        const projetsFiltres= nbrcatId===0 
            ? listeProjets 
            : listeProjets.filter(p=>p.categoryId===nbrcatId);
        afficherProjets(projetsFiltres);

        document.querySelectorAll(".btn-filter")
        .forEach (btn=>btn.classList.remove ("active"));
        btn.classList.add("active");
    });
   
});

 

//const btnHotelRestaurant=document.querySelector(".btn-Hotel-Restau");
//btnHotelRestaurant.addEventListener("click",function(){
  //  const projetsFiltres= listeProjets.filter(function(listeProjets){
    //    return listeProjets.categoryId === 3;
    //});
    //console.log(projetsFiltres)
    //afficherProjets(projetsFiltres)

//})

