import {Pax} from "./pax";

export class Attestation {
    constructor(public dateCreation= "",
                public heureCreation: string,
                public listePax: Array<Pax>,
                public dateSortie: string,
                public heureSortie: string,
                public motifs: string,
                public gdh: string,
                public qrcode = "",
                ) {

    }


}
