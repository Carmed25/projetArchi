const galerie = document.querySelector(".gallery");
 
//fonction qui récupère les données du projets depuis API

async function chargerProjets() {
    try{ const reponse = await fetch("http://localhost:5678/api/works");
            if (!reponse.ok) {
            throw new Error(reponse.status);
             }
        const listeProjets = await reponse.json();
        console.log(listeProjets);

        
        galerie.innerHTML= ""; //vide gallery

        for(let i=0 ; i<listeProjets.length; i++){
            let projet = listeProjets[i];

            let figure = document.createElement ("figure");
            let img = document.createElement ("img");
            let figcaption = document.createElement ( "figcaption");

            img.src = projet.imageUrl;
            img.title = projet.title;
            figcaption.textContent= projet.title;
          
            figure.appendChild(img);
            figure.appendChild(figcaption);
            galerie.appendChild(figure);

    }}
    catch(error){
        console.log("Erreur chargement des projets :"+ error.message);
  }}

  chargerProjets()

    
    const reponse = await fetch("http://localhost:5678/api/works");
    const listeProjets = await reponse.json();

  //async function filter() {
  const btnTous= document.querySelector(".btn-Tous");
  btnTous.addEventListener("click",function(){
    const projetsFiltres= listeProjets.filter(function(listeProjets){
        return listeProjets.categoryId > 0 ;
   
    });
    console.log(projetsFiltres)
     galerie.innerHTML="";
     for(let i=0 ; i<projetsFiltres.length; i++){
            let projet = projetsFiltres[i];

            let figure = document.createElement ("figure");
            let img = document.createElement ("img");
            let figcaption = document.createElement ( "figcaption");

            img.src = projet.imageUrl;
            img.title = projet.title;
            figcaption.textContent= projet.title;
          
            figure.appendChild(img);
            figure.appendChild(figcaption);
            galerie.appendChild(figure);

    }
  })
  //filter()

const btnObjets=document.querySelector(".btn-Objets");
btnObjets.addEventListener("click",function(){
    const projetsFiltres= listeProjets.filter(function(listeProjets){
        return listeProjets.categoryId === 1;
    });
    console.log(projetsFiltres)
     galerie.innerHTML="";
     for(let i=0 ; i<projetsFiltres.length; i++){
            let projet = projetsFiltres[i];

            let figure = document.createElement ("figure");
            let img = document.createElement ("img");
            let figcaption = document.createElement ( "figcaption");

            img.src = projet.imageUrl;
            img.title = projet.title;
            figcaption.textContent= projet.title;
          
            figure.appendChild(img);
            figure.appendChild(figcaption);
            galerie.appendChild(figure);

    }
})

const btnAppartements=document.querySelector(".btn-Appart");
btnAppartements.addEventListener("click",function(){
    const projetsFiltres= listeProjets.filter(function(listeProjets){
        return listeProjets.categoryId === 2;
    });
    console.log(projetsFiltres)
     galerie.innerHTML="";
     for(let i=0 ; i<projetsFiltres.length; i++){
            let projet = projetsFiltres[i];

            let figure = document.createElement ("figure");
            let img = document.createElement ("img");
            let figcaption = document.createElement ( "figcaption");

            img.src = projet.imageUrl;
            img.title = projet.title;
            figcaption.textContent= projet.title;
          
            figure.appendChild(img);
            figure.appendChild(figcaption);
            galerie.appendChild(figure);

    }
})

const btnHotelRestaurant=document.querySelector(".btn-Hotel-Restau");
btnHotelRestaurant.addEventListener("click",function(){
    const projetsFiltres= listeProjets.filter(function(listeProjets){
        return listeProjets.categoryId === 3;
    });
    console.log(projetsFiltres)
   
    galerie.innerHTML="";
     for(let i=0 ; i<projetsFiltres.length; i++){
            let projet = projetsFiltres[i];

            let figure = document.createElement ("figure");
            let img = document.createElement ("img");
            let figcaption = document.createElement ( "figcaption");

            img.src = projet.imageUrl;
            img.title = projet.title;
            figcaption.textContent= projet.title;
          
            figure.appendChild(img);
            figure.appendChild(figcaption);
            galerie.appendChild(figure);

    }

})