

//fonction qui permet de voir si on recupère correctement les données
export async function attendreFetch() {
   const reponse = await fetch("http://localhost:5678/api/works");
     if (!reponse.ok) 
      throw new Error(reponse.status);
    return reponse.json()
    ///listeProjets = await reponse.json();
    ///console.log ("données recues:", listeProjets);
    ///return reponse.json()
    //return listeProjets;
}
