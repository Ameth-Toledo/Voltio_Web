import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelleftComponent } from './panelleft.component';

describe('PanelleftComponent', () => {
  let component: PanelleftComponent;
  let fixture: ComponentFixture<PanelleftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelleftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelleftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
