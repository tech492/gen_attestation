import { Component, OnInit } from '@angular/core';
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from "@techiediaries/ngx-qrcode";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-qrcodelist',
  templateUrl: './qrcodelist.component.html',
  styleUrls: ['./qrcodelist.component.scss'],
})
export class QrcodelistComponent implements OnInit {

  elementType = NgxQrcodeElementTypes.IMG;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.MEDIUM;

  constructor(public data: DataService) { }

  ngOnInit() {}

}
