import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebFeatureSignUpComponent } from './web-feature-sign-up.component';

describe('WebFeatureSignUpComponent', () => {
  let component: WebFeatureSignUpComponent;
  let fixture: ComponentFixture<WebFeatureSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureSignUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
