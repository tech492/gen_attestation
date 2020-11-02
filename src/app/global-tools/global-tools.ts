import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ActionSheetController, AlertController, LoadingController, ToastController} from '@ionic/angular';

/*
  Generated class for the GlobalToolsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalToolsProvider {

    constructor(private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private alertCtrl: AlertController,
                private actionSheetCtrl: ActionSheetController
    ) {
        console.log('Hello GlobalToolsProvider Provider');
    }

    async presentLoading(message: string): Promise<HTMLIonLoadingElement> {
        let loader = await this.loadingCtrl.create({
            message: message,
            //    dismissOnPageChange: true
        });
        await loader.present();
        return loader;
    }

    async hideLoading(loader: Promise<HTMLIonLoadingElement>) {
        (await loader).dismiss();
    }

    async toast(message: string, position: 'bottom' | 'top' | 'middle' = 'bottom', long: boolean = false, callback = () => {
    }) {
        let duration = 3000;
        if (long) {
            duration = 6000;
        }

        const toast = await this.toastCtrl.create({
            message: message,
            duration: duration,
            position: position
        });
        toast.present();
        toast.onDidDismiss().then(() => {
            callback();
        });
    }

    async showAlert(title: string, text: string, callbackOk = () => {
    }, callbackNo = () => {
    }) {
        const alert = await this.alertCtrl.create({
            header: title,
            message: text,
            buttons: [{
                text: 'Annuler',
                handler: () => {

                    callbackNo();

                }
            }, {
                text: 'Ok',
                handler: () => {

                    callbackOk();

                }
            }
            ]
        });
        return alert.present();
    }

    async showPrompt(titleW: string, titleI: string, text: string, callbackOk = (data?: any) => {
    }, callbackNo = () => {
    }) {
        const prompt = await this.alertCtrl.create({
            header: titleW,
            message: text,
            inputs: [
                {
                    name: titleI,
                    placeholder: titleI
                },
            ],
            buttons: [
                {
                    text: 'Annuler',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: data => {
                        if (data[titleI] !== '') {
                            callbackOk(data);
                        } else {
                            this.showAlert('Information', 'Le champ est obligatoire merci de le renseigner.');
                        }
                    }
                }
            ]
        });
        return prompt.present();
    }

    async showActionSheet(title: string, text: string, buttons) {
        const actionSheet = await this.actionSheetCtrl.create({
            header: title,
            buttons: buttons,
        });
        return await actionSheet.present();
    }

    objectToArray(object: object) {
return Object.keys(object);
    }
}
