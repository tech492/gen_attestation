import {Component} from '@angular/core';
import {DataService} from "../service/data.service";
import {Pax} from "../pax";
import {GlobalToolsProvider} from "../global-tools/global-tools";

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    constructor(public data: DataService,
                private tools: GlobalToolsProvider) {
    }

    ionViewWillLeave() {
        this.data.saveData()
}

    addPax() {
        if (this.data.listePax.length > 0) {
            this.data.listePax.push(
                new Pax(
                    this.data.listePax[0].adresse,
                    this.data.listePax[0].ville,
                    this.data.listePax[0].cp
                ));
        } else {
            this.data.listePax.push(new Pax());
        }
        this.data.saveData();
    }

    suppPax(index) {
        this.tools.showAlert("Attention", "Etes-vous sur de vouloir supprimer "+ this.data.listePax[index].prenom+" ?", () => {
            this.data.listePax.splice(index, 1);
            this.data.saveData();
        })
    }
}
