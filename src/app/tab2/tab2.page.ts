import {Component} from '@angular/core';
import {Attestation} from "../attestation";
import {DataService} from "../service/data.service";
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {GlobalToolsProvider} from "../global-tools/global-tools";
import {PDFDocument, StandardFonts} from 'pdf-lib'
import {File} from "@ionic-native/file/ngx";
import {attestq42020} from "src/app/tab2/pdfb64.js"
import {FileOpener} from "@ionic-native/file-opener/ngx";

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    generateurActif = false;

    constructor(public data: DataService, private barcodeScanner: BarcodeScanner,
                private tools: GlobalToolsProvider,
                private file: File,
                private fileOpener: FileOpener) {

    }

    // méthode principale pour générer l'attestation
    gen() {
        let motifString: string;
        let attestation: Attestation;
        let dateNow = new Date();

        // formatage de l'heure
        let dateformated = dateNow.toLocaleDateString('fr-FR')
        let hourFormated = (("0" + dateNow.getHours()).slice(-2)) + ':' + (("0" + dateNow.getMinutes()).slice(-2));


        for (let motif of this.data.motifs) {
            if (motif.isChecked) {
                // initialise le motif si ce n'est pas déjà le cas sinon ajoute un nouveau motif
                if (typeof motifString == "undefined") {
                    motifString = motif.value;
                } else {
                    motifString += ", " + motif.value;
                }
            }
        }

        // création de l'objet attestation
        attestation = new Attestation(dateformated,
            hourFormated,
            this.data.bioData.nom,
            this.data.bioData.prenom,
            this.data.bioData.dateDN,
            this.data.bioData.villeNaissance,
            this.data.bioData.adresse,
            this.data.bioData.ville,
            this.data.bioData.cp,
            dateformated,
            hourFormated,
            motifString);

        // création du contenu du QRCODE
        attestation.qrcode = [
            `Cree le: ${attestation.dateCreation} a ${attestation.heureCreation}`,
            `Nom: ${attestation.nom}`,
            `Prenom: ${attestation.prenom}`,
            `Naissance: ${attestation.dateDN} a ${attestation.villeNaissance}`,
            `Adresse: ${attestation.adresse} ${attestation.cp} ${attestation.ville}`,
            `Sortie: ${attestation.dateCreation} a ${attestation.heureCreation}`,
            `Motifs: ${attestation.motifs}`,
        ].join(';\n')

        // Ajout de l'attestation dans la liste
        this.data.attestations.push(attestation);
        this.data.saveData();
        this.generateurActif = false;
    }

    // Affichage du QRCODE à la demande
    async genQr(data) {
        await this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, data);
    }

    // Affichage des descriptions de motifs
    showTip(text) {
        this.tools.showAlert('Info', text)
    }

    //
    async generatePdf(attestation: Attestation) {
        console.log("Hello generatePdf : ", attestation);
        const motifsArray = attestation.motifs.split(', ');

        // chargement du modèle d'attestation
        const pdfDoc = await PDFDocument.load(attestq42020);

        // Seule la première page nous interesse
        const page1 = pdfDoc.getPages()[0];

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // methode anonyme imbriquée pour insérer du texte dans la page
        const drawText = (text, x, y, size = 11) => {
            page1.drawText(text, {x, y, size, font})
        };

        // liste des positions verticales des motifs
        const ys = {
            travail: 578,
            achats: 533,
            sante: 477,
            famille: 435,
            handicap: 396,
            sport_animaux: 358,
            convocation: 295,
            missions: 255,
            enfants: 211,
        }

        drawText(`${attestation.prenom} ${attestation.nom}`, 119, 696);
        drawText(attestation.dateDN, 119, 674);
        drawText(attestation.villeNaissance, 297, 674);
        drawText(`${attestation.adresse} ${attestation.cp} ${attestation.ville}`, 133, 652);

        motifsArray.forEach((motif) => {
            drawText('x', 84, ys[motif], 18)
        })

        let locationSize = this.idealFontSize(font, attestation.ville, 83, 7, 11);

        if (!locationSize) {
            alert('Le nom de la ville risque de ne pas être affiché correctement en raison de sa longueur. ' +
                'Essayez d\'utiliser des abréviations ("Saint" en "St." par exemple) quand cela est possible.')
            locationSize = 7
        }

        drawText(attestation.ville, 105, 177, locationSize)

        // il faut choisir un motif
        if (motifsArray.length > 0) {
            // Date sortie
            drawText(`${attestation.dateSortie}`, 91, 153)
            drawText(attestation.heureSortie, 264, 153, 11)
        }

        // génération du pdf proprement dit
        const pdfBytes = await pdfDoc.save();

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
