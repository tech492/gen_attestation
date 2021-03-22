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

    inputsPattern = {
        ddn: {pattern: '^([0][1-9]|[1-2][0-9]|30|31)\\/([0][1-9]|10|11|12)\\/(19[0-9][0-9]|20[0-1][0-9]|2020)$'},
    };

    constructor(public data: DataService,
                private tools: GlobalToolsProvider) {
    }

    ionViewWillLeave() {
        this.data.saveData()
    }

    // todo: bloquer la navigation si profil invalide

    async checkForm(): Promise<boolean> {
        console.log("checking");
        const regexTest = (value, pattern) => {
            const regex = new RegExp(pattern);
            const test = regex.test(value);
            return test;
        };

        let ret = false;

        for (let i = 0; i <= this.data.listePax.length; i++) {
            for (let [inputName, specs] of Object.entries(this.inputsPattern)) {
                if (!regexTest(this.data.listePax[i][inputName], this.inputsPattern[inputName].pattern)) {

                    let alert = await this.tools.toast(`Saisie incorrecte, veuillez vérifier le profil de ${this.data.listePax[i].prenom}`);
                    this.focus(this.data.listePax[i].prenom + inputName);

                    return false;
                } else {
                    ret = true;
                }
            }
        }


        return ret;
    }

    focus(inputField: string) {
        const selector = `#${inputField} > input`;
        let input = document.querySelector(selector) as HTMLElement;
        console.log('element = ', inputField);
        input.focus();
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
        this.tools.showAlert("Attention", "Etes-vous sur de vouloir supprimer " + this.data.listePax[index].prenom + " ?", () => {
            this.data.listePax.splice(index, 1);
            this.data.saveData();
        })
    }
}
