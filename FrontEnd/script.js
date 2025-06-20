const galerie = document.querySelector(".gallery");
 
//fonction qui récupère les données du projets depuis API

async function chargerProjets() {
    try{ const reponse = await fetch("http://localhost:5678/api/works");
            //if (!reponse.ok) {
            //throw new Error(reponse.status);
            // }
        const listeProjets = await reponse.json();
        console.log(listeProjets);

        
        galerie.innerHTML= ""; //vide gallery

        for(let i=0 ; i<listeProjets.length; i++){
            let projet = listeProjets[i];

            let figure = document.createElement ("figure");
            let img = document.createElement ("img");
            let figcaption = document.createElement ( "figcaption");

            img.src = projet.imageURL;
            img.title = projet.title;
            figcaption.textContent= projet.title;
          
            figure.appendChild(img);
            figure.appendChild(figcaption);
            galerie.appendChild(figure);

    }}
    catch(error){
        console.log("Erreur chargement des projets :"+ error.message);
  }}