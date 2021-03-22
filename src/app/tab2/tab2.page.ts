import {Component} from '@angular/core';
import {Attestation} from "../attestation";
import {DataService} from "../service/data.service";
import {GlobalToolsProvider} from "../global-tools/global-tools";
import {PDFDocument, StandardFonts} from 'pdf-lib'
import {File} from "@ionic-native/file/ngx";
import {attest2021, attestCF2021} from "src/app/tab2/pdfb64.js"
import {FileOpener} from "@ionic-native/file-opener/ngx";
import {Pax} from "../pax";
import {PopoverController} from "@ionic/angular";
import {QrcodelistComponent} from "./qrcodelist/qrcodelist.component";

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    get gdhChoisi(): string {
        if (this._gdhChoisi === undefined) {
            this._gdhChoisi = this.newDate()
            return this._gdhChoisi.toISOString();
        }
        return this._gdhChoisi.toISOString();
    }

    set gdhChoisi(value) {
        console.log("setting gdh", value);
        this._gdhChoisi = new Date(value);
    }

    generateurActif = false;
    private _gdhChoisi: Date;

    constructor(public data: DataService,
                private tools: GlobalToolsProvider,
                private file: File,
                private fileOpener: FileOpener,
                public popoverController: PopoverController) {
        this._gdhChoisi = this.newDate();
    }

    isCouvreFeu(date: Date | string = this._gdhChoisi): boolean {
        if (typeof date === "string") {
            date = new Date(date);
        }
        return date.getHours() >= 19 || date.getHours() <= 6
    }


    newDate(date = new Date()) {
        return date
    }

    // méthode pour créer les données de l'attestation
    gen() {
        let motifString: string = "";
        let listeSelPax: Array<Pax> = [];
        let attestation: Attestation;

        // fonction pour tester les données du formulaire
        let prepareAndCheck = (): boolean => {

            for (let pax of this.data.listePax) {
                if (pax.isChecked) {
                    listeSelPax.push(pax);
                }
            }

            for (let motif of this.data.motifsCF) {
                if (motif.isChecked) {
                    if (motifString.length) {
                        motifString += ", " + motif.value;
                    } else {
                        motifString += motif.value
                    }
                }
            }


            for (let motif of this.data.motifsJ) {
                if (motif.isChecked) {
                    if (motifString.length) {
                        motifString += ", " + motif.value;
                    } else {
                        motifString += motif.value
                    }
                }
            }

            return !!(this._gdhChoisi && listeSelPax && motifString);

        };

// teste si les infos sont bien remplies sinon affiche un message d'erreur
        if (prepareAndCheck()) {
            let dateObject = new Date(this._gdhChoisi);
            let dateformated = dateObject.toLocaleDateString('fr-FR');

            // formatage de l'heure
            let hourObject = {
                hour: (("0" + dateObject.getHours()).slice(-2)),
                min: (("0" + dateObject.getMinutes()).slice(-2)),
                styleh: null,
                style2p: null,
            };

            hourObject.styleh = hourObject.hour + 'h' + hourObject.min;
            hourObject.style2p = hourObject.hour + ':' + hourObject.min;

            // création de l'objet attestation
            attestation = new Attestation(dateformated,
                hourObject.styleh,
                listeSelPax,
                dateformated,
                hourObject.style2p,
                motifString,
                dateObject.toISOString());

            // Ajout de l'attestation dans la liste
            this.data.attestations.push(attestation);

            this.data.saveData();

            this.generateurActif = false;
        } else {
            this.tools.showAlert("Erreur", "Veuillez vérifier que toutes les informations sont renseignées")
        }


    }


    async genQr(attestation: Attestation) {
        let loading = await this.tools.presentLoading("Génération en cours...");
        let array: Array<Object> = [];

        // création du contenu du QRCODE
        for (let pax of attestation.listePax) {
            let qrCode = [
                `Cree le: ${attestation.dateCreation} a ${attestation.heureCreation}`,
                `Nom: ${pax.nom}`,
                `Prenom: ${pax.prenom}`,
                `Naissance: ${pax.dateDN} a ${pax.villeNaissance}`,
                `Adresse: ${pax.adresse} ${pax.cp} ${pax.ville}`,
                `Sortie: ${attestation.dateCreation} a ${attestation.heureSortie}`,
                `Motifs: ${attestation.motifs};`,
            ].join(';\n');

            array.push({'prenom': pax.prenom, qrCode});
        }

        this.data.tempListQR = array;
        await this.presentPopover();
        await loading.dismiss();
    }

    async presentPopover() {
        const popover = await this.popoverController.create({
            component: QrcodelistComponent,
            cssClass: 'modal-class',
            translucent: true
        });
        return await popover.present();
    }

// Affichage des descriptions de motifs
    showTip(text) {
        this.tools.showAlert('Info', text)
    }

// Methode principale pour générer le pdf
    async generatePdf(attestation: Attestation, style: number = this.isCouvreFeu(attestation.gdh) ? 2 : 1) {
        let loading = await this.tools.presentLoading("Génération du pdf, veuillez patienter");

        console.log("Hello generatePdf : ", attestation);
        const motifsArray = attestation.motifs.split(', ');

        let multiPage;

        // chargement du modèle d'attestation
        let pdfDoc = await PDFDocument.create();
        let pdfModele;
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        if (style == 1) {
            let temp ;

            motifsArray.forEach((motif) => {
               temp = this.data.motifsJ.find((motifFound) => motifFound.value == motif).page == 2;
            });

            if (temp) {
                multiPage = true;
            }
            pdfModele = await PDFDocument.load(attest2021);
        } else {
            pdfModele = await PDFDocument.load(attestCF2021);
        }

        for (const pax of this.data.listePax) {
            let i;
            if (pax.isChecked) {
                i++;
                let page;

                if (multiPage) {
                    let pageCopy = [];
                    pageCopy.push(await pdfDoc.copyPages(pdfModele, [0]));
                    pageCopy.push(await pdfDoc.copyPages(pdfModele, [1]));
                    page = [pdfDoc.addPage(pageCopy[0][0]), pdfDoc.addPage(pageCopy[1][0])];
                } else {

                    let [pageCopy] = await pdfDoc.copyPages(pdfModele, [0]);
                    page = [pdfDoc.addPage(pageCopy)];
                }


                // methode anonyme imbriquée pour insérer du texte dans la page
                const drawText = (pageNumber: number, text, x, y, size = 11) => {
                    page[pageNumber].drawText(text, {x, y, size, font})
                };


                let locationSize = this.idealFontSize(font, pax.ville, 83, 7, 11);
                if (!locationSize) {
                    alert('Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
                        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.')
                    locationSize = 7
                }

                // liste des positions verticales des motifs
                const ys = {
                    travail: [629, 579, null],
                    achats: [244, null, null],
                    sante: [533, 546, null],
                    famille: [477, 512, null],
                    handicap: [422, 478, null],
                    judiciaire: [380, 458, null],
                    missions: [null, 412, null],
                    transit: [243, 379, null],
                    animaux: [null, 345, null],
                    sport: [367, null, null],
                    enfants: [161, null, null],
                    culte_culturel: [781, null, null],
                    demarche: [726, null, null],
                    demenagement: [311, null, null],
                }

                // Tableau des données à insérer dans chaque pdf d'attestation
                const data = [
                    [ //attestation confinement
                        [`${pax.prenom} ${pax.nom}`, 111, 516],
                        [pax.dateDN, 111, 501],
                        [pax.villeNaissance, 228, 501],
                        [`${pax.adresse} ${pax.cp} ${pax.ville}`, 126, 487],
                        [`Fait à ${pax.ville}`, 72, 99, locationSize, 1],
                        ['(Date et heure de début de sortie à mentionner obligatoirement)', 72, 67, locationSize, 1],
                        [`Le ${attestation.dateSortie}`, 72, 83, undefined, 1],
                        [`à ${attestation.heureSortie}`, 310, 83, undefined, 1]

                    ],
                    [ /*attestation couvre feu*/
                        [`${pax.prenom} ${pax.nom}`, 144, 705],
                        [pax.dateDN, 144, 684],
                        [pax.villeNaissance, 310, 684],
                        [`${pax.adresse} ${pax.cp} ${pax.ville}`, 148, 665],
                        [`Fait à ${pax.ville}`, 72, 109, locationSize],
                        [`Le ${attestation.dateSortie}`, 72, 93],
                        [`à ${attestation.heureSortie}`, 310, 93, 11],
                        ['(Date et heure de début de sortie à mentionner obligatoirement)', 72, 77, locationSize]
                    ]
                ]

                // Iteration sur les données textuelles à insérer
                data[style - 1].forEach((drawing) => {
                    drawText(drawing[4] ? drawing[4] : 0, drawing[0], drawing[1], drawing[2], drawing[3] ? drawing[3] : undefined);
                })

                // Iteration sur les motifs à cocher (style 1 = jour, style 2 = Couvre Feu)
                motifsArray.forEach((motif) => {
                    if (style === 1) {
                        drawText(this.data.motifsJ.find((motifFound) => motifFound.value == motif).page-1, 'x', 60, ys[motif][0], 18)
                    }
                    if (style === 2 && ys[motif][1]) {
                        drawText(this.data.motifsCF.find((motifFound) => motifFound.value == motif).page-1, 'x', 73, ys[motif][1], 18)
                    }
                })

            }

        }


        // génération du pdf proprement dit
        const pdfBytes = await pdfDoc.save();

        await loading.dismiss();

        // ouverture du pdf généré
        this.download(
            new Blob([pdfBytes], {type: 'application/pdf'}),
            attestation.dateCreation.replace(/\//g, '') + '_'
            + attestation.heureCreation
            + "_"
            + attestation.motifs
        );
    }

    idealFontSize(font, text, maxWidth, minSize, defaultSize) {
        let currentSize = defaultSize;
        let textWidth = font.widthOfTextAtSize(text, defaultSize);

        while (textWidth > maxWidth && currentSize > minSize) {
            textWidth = font.widthOfTextAtSize(text, --currentSize);
        }

        return (textWidth > maxWidth) ? null : currentSize;
    }

// methode pour ouvrir un fichier sous forme de blob.
// le pdf est enregistré dans le répertoire de cache de l'application et écrase systématiquement
// le dernier fichier créé pour ne pas faire grossir le répertoire et éviter une historicisation des attestations
// Attention : le dernier fichier pdf ne disparait qu'avec la suppression de l'appli
    async download(blob: Blob, nom: string) {
        let ready = await this.file.checkDir(this.file.cacheDirectory, "");
        let pdf = await this.file.writeFile(this.file.cacheDirectory, 'attestation.pdf', blob, {replace: true})
        await this.fileOpener.open(pdf.nativeURL, 'application/pdf');
    }

// Méthode pour appeler la remise à zéro de la liste d'attestation
    razAttestations() {
        this.tools.showAlert('Confirmation', 'Etes-vous sûr de vouloir supprimer toutes les attestations ?',
            () => {
                this.data.razAttest();
            })
    }

}
