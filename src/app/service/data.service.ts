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
    motifsCF: Array<Motif>;
    motifsJ: Array<Motif>;

    // Liste des attestations en mémoire
    attestations: Array<Attestation>;

    // Liste temporaire des QRCode à afficher
    tempListQR = [];

    //booléen pour l'affichage de la mise en garde liée aux justificatifs
    miseEnGardeActif = true;


    constructor(private storage: Storage) {
        this.attestations = [];

        this.motifsCF = [
            {
                infos: "Déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle ou le lieu d’enseignement et de formation, déplacements professionnels ne pouvant être différés, livraisons à domicile, déplacements pour effectuer des achats de fournitures nécessaires à l'activité professionnelle, déplacements liés à des missions d’intérêt général sur demande de l’autorité administrative ;",
                value: 'travail',
                text: '🔨 Activité professionnelle, enseignement et formation ',
                distance: '∞',
                isChecked: false,
                page: 1
            },
            {
                text: '⚕️ Santé',
                value: 'sante',
                infos: "Déplacements pour des consultations, examens, actes de prévention (dont vaccination) et soins ne pouvant être assurés à distance ou pour l’achat de produits de santé ;",
                distance: '∞',
                isChecked: false,
                page: 1
            },
            {
                infos: "Déplacements pour motif familial impérieux, pour l’assistance aux personnes vulnérables ou précaires ou pour la garde d’enfants ;",
                value: 'famille',
                text: '👨‍👩‍👦 Famille',
                distance: '∞',
                isChecked: false,
                page: 1
            },
            {
                text: '♿ Handicap',
                value: 'handicap',
                infos: 'Déplacements des personnes en situation de handicap et de leur accompagnant ;',
                distance: '∞',
                isChecked: false,
                page: 1
            },
            {
                text: '⚖️ Convocation judiciaire',
                value: 'judiciaire',
                infos: 'Déplacements pour répondre à une convocation judiciaire ou administrative, déplacements pour se rendre chez un professionnel du droit, pour un acte ou une démarche qui ne peuvent être réalisés à distance ;',
                distance: '∞',
                isChecked: false,
                page: 1
            },
            {
                text: '🛡️ Mission d’intérêt général',
                value: 'missions',
                infos: 'Déplacements pour participer à des missions d’intérêt général sur demande de l’autorité administrative ;',
                distance: '∞',
                isChecked: false,
                page: 1
            },
            {
                text: '✈️ Transits',
                value: 'transit',
                infos: 'Déplacements de transit et longue distance',
                isChecked: false,
                distance: '∞',
                page: 1
            },
            {
                text: '🐶 Animaux',
                value: 'animaux',
                infos: "Déplacements brefs, dans un rayon maximal d'un kilomètre autour du domicile pour les besoins des animaux de compagnie.",
                isChecked: false,
                distance: '1km',
                page: 1
            }];

        this.motifsJ = [
            {
                infos: "Déplacements liés soit à la promenade, soit à l'activité physique individuelle des personnes ",
                value: 'sport',
                text: '🏃  Activité physique et promenade ',
                distance: '10 km',
                isChecked: false,
                page: 1
            },
            {
                infos: "Déplacements pour effectuer des achats de première nécessité ou des retraits de commandes ;",
                value: 'achats',
                text: '🛒 Achats',
                distance: 'Dep /\n30km',
                isChecked: false,
                page: 1
            },
            {
                infos: "Déplacements pour emmener et aller chercher les enfants à l’école et à l’occasion de leurs activités péri-scolaires ;",
                value: 'enfants',
                text: '🚸 Accompagnement des enfants à l’école',
                distance: 'Dep /\n30km',
                isChecked: false,
                page: 1
            },
            {
                infos: "Déplacements pour se rendre dans un établissement culturel (bibliothèques et médiathèques) ou un lieu de culte ;",
                value: 'culte_culturel',
                text: '⛪ Lieu de culte ou Etablissement culturel',
                distance: 'Dep /\n30km',
                isChecked: false,
                page: 2
            },
            {
                infos: "Déplacements pour se rendre dans un service public pour un acte ou une démarche qui ne peuvent être réalisés à distance ;",
                value: 'demarche',
                text: '🏢 Démarches administratives ou juridiques',
                distance: 'Dep /\n30km',
                isChecked: false,
                page: 2
            },
            {
                infos: "Déplacements entre le domicile et le lieu d’exercice de l’activité professionnelle ou le lieu d’enseignement et de formation, déplacements professionnels ne pouvant être différés, livraisons à domicile, déplacements pour effectuer des achats de fournitures nécessaires à l'activité professionnelle, déplacements liés à des missions d’intérêt général sur demande de l’autorité administrative ;",
                value: 'travail',
                text: '🔨 Travail et missions d\'intérêt général',
                distance: '∞',
                isChecked: false,
                page: 2
            },
            {
                text: '⚕️ Santé',
                value: 'sante',
                infos: "Déplacements pour des consultations, examens, actes de prévention (dont vaccination) et soins ne pouvant être assurés à distance ou pour l’achat de produits de santé ;",
                distance: '∞',
                isChecked: false,
                page: 2
            },
            {
                infos: "Déplacements pour motif familial impérieux, pour l’assistance aux personnes vulnérables ou précaires ou pour la garde d’enfants ;",
                value: 'famille',
                text: '👨‍👩‍👦 Famille',
                distance: '∞',
                isChecked: false,
                page: 2
            },
            {
                text: '♿ Handicap',
                value: 'handicap',
                infos: 'Déplacements des personnes en situation de handicap et de leur accompagnant ;',
                distance: '∞',
                isChecked: false,
                page: 2
            },
            {
                text: '⚖️ Convocation judiciaire',
                value: 'judiciaire',
                infos: 'Déplacements pour répondre à une convocation judiciaire ou administrative, déplacements pour se rendre chez un professionnel du droit, pour un acte ou une démarche qui ne peuvent être réalisés à distance ;',
                distance: '∞',
                isChecked: false,
                page: 2
            },
            {
                text: '🚚 Déménagement',
                value: 'demenagement',
                infos: 'Déplacements liés à un déménagement résultant d\'un changement de domicile et déplacements indispensables à l\'acquisition ou à la location d’une résidence principale, insusceptibles d\'être différés ;',
                distance: '∞',
                isChecked: false,
                page: 2
            },
            {
                text: '✈️ Transits',
                value: 'transit',
                infos: 'Déplacement de transit vers les gares et les aéroports',
                isChecked: false,
                distance: '∞',
                page: 2
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
    value: string,
    infos,
    distance,
    isChecked,
    page: number
}





