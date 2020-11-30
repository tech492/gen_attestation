import {Injectable} from '@angular/core';
import {Attestation} from "../attestation";
import {Storage} from '@ionic/storage';
import {Pax} from "../pax";

@Injectable({
    providedIn: 'root'
})
export class DataService {

    // Liste des identités crées
    listePax: Array<Pax>;

    // Liste des motifs existants
    motifs: Array<Motif>;

    // Liste des attestations en mémoire
    attestations: Array<Attestation>;

    // Liste temporaire des QRCode à afficher
    tempListQR = [];

    //booléen pour l'affichage de la mise en garde liée aux justificatifs
    miseEnGardeActif = true;


    constructor(private storage: Storage) {
        this.attestations = [];
        this.motifs = [
            {
                infos: "Déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle ou un établissement d’enseignement ou de formation ; déplacements professionnels ne pouvant être différés; déplacements pour un concours ou un examen;",
                value: 'travail',
                text: '🔨 Travail',
                isChecked: false
            },
            {
                infos: "Déplacements pour se rendre dans un établissement culturel autorisé ou un lieu de culte; déplacements pour effectuer des achats de biens, pour des services dont la fourniture est autorisée, pour les retraits de commandes et les livraisons à domicile;",
                value: 'achats',
                text: '⛪ Culte, 🎁 achats, 📦 retrait de commande',
                isChecked: false
            },
            {
                text: '⚕️ Santé',
                value: 'sante',
                infos: "Consultations, examens et soins ne pouvant être assurés à distance et l’achat de médicaments;",
                isChecked: false
            },
            {
                infos: "Déplacements pour motif familial impérieux, pour l'assistance aux personnes vulnérables et précaires ou la garde d'enfants;",
                value: 'famille',
                text: '👨‍👩‍👦 Famille',
                isChecked: false
            },
            {
                text: '♿ Handicap',
                value: 'handicap',
                infos: 'Déplacement des personnes en situation de handicap et leur accompagnant.',
                isChecked: false
            },
            {
                text: '🏃 Sport & animaux',
                value: 'sport_animaux',
                infos: "Déplacements en plein air ou vers un lieu de plein air, sans changement du lieu de résidence, dans la limite de trois heures quotidiennes et dans un rayon maximal de vingt kilomètres autour du domicile, liés soit à l’activité physique ou aux loisirs individuels, à l’exclusion de toute pratique sportive collective et de toute proximité avec d’autres personnes, soit à la promenade avec les seules personnes regroupées dans un même domicile, soit aux besoins des animaux de compagnie;",
                isChecked: false
            },

            {
                text: '⚖️ Convocation judiciaire',
                value: 'convocation', infos: 'Convocation judiciaire ou administrative et pour se rendre dans un service public.', isChecked: false
            },
            {
                text: 'Missions',
                value: 'missions',
                infos: 'Participation à des missions d\'intérêt général sur demande de l\'autorité administrative.', isChecked: false
            },
            {
                text: '🚸 Enfants',
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
        this.storage.set('miseEnGarde', this.miseEnGardeActif);
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
        temp = await this.storage.get('miseEnGarde');
        if (temp !== null) {
            this.miseEnGardeActif = temp;
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





