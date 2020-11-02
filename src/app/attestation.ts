export class Attestation {
    constructor(public dateCreation= "",
                public heureCreation: string,
                public nom: string,
                public prenom: string,
                public dateDN: string,
                public villeNaissance: string,
                public adresse: string,
                public ville: string,
                public cp: string,
                public dateSortie: string,
                public heureSortie: string,
                public motifs: string,
                public qrcode = "") {

    }


}
