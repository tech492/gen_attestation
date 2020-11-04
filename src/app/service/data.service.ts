import {Injectable} from '@angular/core';
import {Attestation} from "../attestation";
import {Storage} from '@ionic/storage';
import {Pax} from "../pax";

@Injectable({
    providedIn: 'root'
})
export class DataService {

    listePax: Array<Pax>;
    motifs: Array<Motif>;
    attestations: Array<Attestation>;

    tempListQR = [];


    constructor(private storage: Storage) {
        this.attestations = [];
        this.motifs = [
            {
                infos: 'Déplacements entre le domicile et le lieu d’exercice de l\’activité professionnelle ou un établissement d\’enseignement ou de formation, déplacements professionnels ne pouvant être différés, déplacements pour un concours ou un examen.',
                value: 'travail',
                text: 'Travail',
                isChecked: false
            },
            {
                infos: 'Déplacements pour effectuer des achats de fournitures nécessaires à l\'activité professionnelle, des achats de première nécessité dans des établissements dont les activités demeurent autorisées, le retrait de commande et les livraisons à domicile.',
                value: 'achats',
                text: 'Achats',
                isChecked: false
            },
            {
                text: 'Santé',
                value: 'sante',
                infos: 'Consultations, examens et soins ne pouvant être ni assurés à distance ni différés et l’achat de médicaments.',
                isChecked: false
            },
            {
                infos: 'Déplacements pour motif familial impérieux, pour l\'assistance aux personnes vulnérables et précaires ou la garde d\'enfants.',
                value: 'famille',
                text: 'Famille',
                isChecked: false
            },
            {
                text: 'Handicap',
                value: 'handicap',
                infos: 'Déplacement des personnes en situation de handicap et leur accompagnant.',
                isChecked: false
            },
            {
                text: 'Sport & animaux',
                value: 'sport_animaux',
                infos: 'Déplacements brefs, dans la limite d\'une heure quotidienne et dans un rayon maximal d\'un kilomètre autour du domicile, liés soit à l\'activité physique individuelle des personnes, à l\'exclusion de toute pratique sportive collective et de toute proximité avec d\'autres personnes, soit à la promenade avec les seules personnes regroupées dans un même domicile, soit aux besoins des animaux de compagnie.',
                isChecked: false
            },

            {
                text: 'Convocation judiciaire',
                value: 'convocation', infos: 'Convocation judiciaire ou administrative et pour se rendre dans un service public.', isChecked: false
            },
            {
                text: 'Missions',
                value: 'missions',
                infos: 'Participation à des missions d\'intérêt général sur demande de l\'autorité administrative.', isChecked: false
            },
            {
                text: 'Enfants',
                value: 'enfants',
                infos: 'Déplacement pour chercher les enfants à l’école et à l’occasion de leurs activités périscolaires', isChecked: false
            }];
        this.listePax= [];

        storage.ready().then(() => {
            this.getData()
        });

    }

    // sauvegarde des données sur le téléphone
    saveData() {
        console.log("saving");
        this.storage.set('attestations', this.attestations);
        this.storage.set('bioData', this.listePax);
    }

    // récupère les données persistées en mémoire
    async getData() {
        let temp = await this.storage.get('attestations');
        if (temp !== null) {
            this.attestations = temp;
        }
        temp = await this.storage.get('bioData');
        if (temp !== null) {
            this.listePax = temp;
        }
    }

    // remise à zéro des données d'identité
    razBio() {
        this.listePax = [];
        this.saveData();
    }

    // remise à zéro des données d'attestations
    razAttest() {
        this.attestations = [];
        this.saveData();
    }
}

interface Motif {
    text,
    value,
    infos,
    isChecked
}





