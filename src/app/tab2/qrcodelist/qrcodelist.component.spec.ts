import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QrcodelistComponent } from './qrcodelist.component';

describe('QrcodelistComponent', () => {
  let component: QrcodelistComponent;
  let fixture: ComponentFixture<QrcodelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QrcodelistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QrcodelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
