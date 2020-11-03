import {Component} from '@angular/core';
import {Attestation} from "../attestation";
import {DataService} from "../service/data.service";
import {GlobalToolsProvider} from "../global-tools/global-tools";
import {PDFDocument, StandardFonts} from 'pdf-lib'
import {File} from "@ionic-native/file/ngx";
import {attestq42020, attestRoy} from "src/app/tab2/pdfb64.js"
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

    generateurActif = false;


    constructor(public data: DataService,
                private tools: GlobalToolsProvider,
                private file: File,
                private fileOpener: FileOpener,
                public popoverController: PopoverController) {

    }

    // méthode pour créer les données de l'attestation
    gen() {
        let motifString: string = "";
        let listeSelPax: Array<Pax> = [];
        let attestation: Attestation;
        let dateNow = new Date();

        // formatage de l'heure
        let dateformated = dateNow.toLocaleDateString('fr-FR')
        let hourFormated = (("0" + dateNow.getHours()).slice(-2)) + ':' + (("0" + dateNow.getMinutes()).slice(-2));

        for (let pax of this.data.listePax) {
            if (pax.isChecked) {
                listeSelPax.push(pax);
            }
        }

        for (let motif of this.data.motifs) {
            if (motif.isChecked) {
                if (motifString.length) {
                    motifString += ", " + motif.value;
                } else {
                    motifString += motif.value
                }

            }
        }

        // création de l'objet attestation
        attestation = new Attestation(dateformated,
            hourFormated,
            listeSelPax,
            dateformated,
            hourFormated,
            motifString);

        // Ajout de l'attestation dans la liste
        this.data.attestations.push(attestation);

        this.data.saveData();

        this.generateurActif = false;
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
                `Sortie: ${attestation.dateCreation} a ${attestation.heureCreation}`,
                `Motifs: ${attestation.motifs}`,
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
    async generatePdf(attestation: Attestation, style: number) {
        let loading = await this.tools.presentLoading("Génération du pdf, veuillez patienter");

        console.log("Hello generatePdf : ", attestation);
        const motifsArray = attestation.motifs.split(', ');

        // chargement du modèle d'attestation
        let pdfDoc = await PDFDocument.create();
        let pdfModele;
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        if (style == 1) {
            pdfModele = await PDFDocument.load(attestq42020);
        } else {
            pdfModele = await PDFDocument.load(attestRoy);
        }

        for (const pax of this.data.listePax) {
            let i;
            if (pax.isChecked) {
                i++;

                let [pageCopy] = await pdfDoc.copyPages(pdfModele, [0]);
                const page = pdfDoc.addPage(pageCopy);

                // methode anonyme imbriquée pour insérer du texte dans la page
                const drawText = (text, x, y, size = style === 1 ? 11 : 18) => {
                    page.drawText(text, {x, y, size, font})
                };


                let locationSize = this.idealFontSize(font, pax.ville, 83, 7, 11);
                if (!locationSize) {
                    alert('Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
                        'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.')
                    locationSize = 7
                }

                // liste des positions verticales des motifs
                const ys = {
                    travail: [578, 448],
                    achats: [533, 400],
                    sante: [477, 363],
                    famille: [435, 322],
                    handicap: [396, null],
                    sport_animaux: [358, 239],
                    convocation: [295, 198],
                    missions: [255, null],
                    enfants: [211, 277],
                }

                // Tableau des données à insérer dans chaque pdf d'attestation
                const data = [
                    [
                        [`${pax.prenom} ${pax.nom}`, 119, 696],
                        [pax.dateDN, 119, 674],
                        [pax.villeNaissance, 297, 674],
                        [`${pax.adresse} ${pax.cp} ${pax.ville}`, 133, 652],
                        [pax.ville, 105, 177, locationSize],
                        [`${attestation.dateSortie}`, 91, 153],
                        [attestation.heureSortie, 264, 153, 11]

                    ],
                    [
                        [attestation.heureSortie, 405, 180],
                        ['à ' + pax.ville, 455, 180]
                    ]
                ]

                // Iteration sur les données textuelles à insérer
                data[style - 1].forEach((drawing) => {
                    drawText(drawing[0], drawing[1], drawing[2], drawing[3] ? drawing[3] : undefined);
                })

                // Iteration sur les motifs à cocher
                motifsArray.forEach((motif) => {
                    if (style === 1) {
                        drawText('x', 84, ys[motif][0], 18)
                    }
                    if (style === 2 && ys[motif][1]) {
                        drawText('x', 92, ys[motif][1], 23)
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
