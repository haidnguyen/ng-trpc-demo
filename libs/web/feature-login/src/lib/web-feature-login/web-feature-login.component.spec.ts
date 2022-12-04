import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebFeatureLoginComponent } from './web-feature-login.component';

describe('WebFeatureLoginComponent', () => {
  let component: WebFeatureLoginComponent;
  let fixture: ComponentFixture<WebFeatureLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
