import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {GlobalToolsProvider} from "./global-tools/global-tools";
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import {FormsModule} from "@angular/forms";
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {QrcodelistComponent} from "./tab2/qrcodelist/qrcodelist.component";

@NgModule({
  declarations: [AppComponent, QrcodelistComponent],
  entryComponents: [QrcodelistComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    IonicStorageModule.forRoot(), NgxQRCodeModule],
  providers: [
    File,
    FileOpener,
    GlobalToolsProvider,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    FormsModule,
    NgxQRCodeModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
