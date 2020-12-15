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
                infos: "Déplacements entre le domicile et le lieu d'exercice de l'activité professionnelle ou le lieu d'enseignement et de formation, déplacements professionnels ne pouvant être différés ;",
                value: 'travail',
                text: '🔨 Travail',
                isChecked: false
            },
            {
                text: '⚕️ Santé',
                value: 'sante',
                infos: "Déplacements pour des consultations et soins ne pouvant être assurés à distance et ne pouvant être différés ou pour l'achat de produits de santé ;",
                isChecked: false
            },
            {
                infos: "Déplacements pour motif familial impérieux, pour l'assistance aux personnes vulnérables ou précaires ou pour la garde d'enfants ;",
                value: 'famille',
                text: '👨‍👩‍👦 Famille',
                isChecked: false
            },
            {
                text: '♿ Handicap',
                value: 'handicap',
                infos: 'Déplacements des personnes en situation de handicap et de leur accompagnant ;',
                isChecked: false
            },
            {
                text: '⚖️ Convocation judiciaire',
                value: 'convocation',
                infos: 'Déplacements pour répondre à une convocation judiciaire ou administrative ;',
                isChecked: false
            },
            {
                text: 'Missions',
                value: 'missions',
                infos: 'Déplacements pour participer à des missions d\'intérêt général sur demande de l\'autorité administrative ;',
                isChecked: false
            },
            {
                text: '✈️ Transits',
                value: 'transits',
                infos: 'Déplacements liés à des transits ferroviaires ou aériens pour des déplacements de longues distances ;',
                isChecked: false
            },
            {
                text: '🐶 Animaux',
                value: 'animaux',
                infos: "Déplacements brefs, dans un rayon maximal d'un kilomètre autour du domicile pour les besoins des animaux de compagnie.",
                isChecked: false
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





