import {Component, OnInit} from '@angular/core';
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from "@techiediaries/ngx-qrcode";
import {DataService} from "../../service/data.service";
import {GlobalToolsProvider} from "../../global-tools/global-tools";
import {Platform} from "@ionic/angular";
import {Clipboard} from '@ionic-native/clipboard/ngx';

@Component({
    selector: 'app-qrcodelist',
    templateUrl: './qrcodelist.component.html',
    styleUrls: ['./qrcodelist.component.scss'],
})
export class QrcodelistComponent implements OnInit {

    elementType = NgxQrcodeElementTypes.IMG;
    correctionLevel = NgxQrcodeErrorCorrectionLevels.MEDIUM;

    constructor(public data: DataService,
                public platform: Platform,
                private clipboard: Clipboard,
                public tools: GlobalToolsProvider) {
    }

    ngOnInit() {
    }

    async copy(qr) {
        console.log("Hello copy");
        if (this.platform.is("hybrid")) {
            await this.clipboard.copy(qr);
            this.tools.toast("QRCODE copié dans le presse papier");
        } else {
            //@todo trouver un moyen de faire fonctionner le copier coller dans un navigateur
            let copyText = document.querySelector("#outputText") as any;
            copyText.select();
            document.execCommand("copy");
        }


    }

}
