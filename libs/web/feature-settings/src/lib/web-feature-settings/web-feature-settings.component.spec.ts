import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebFeatureSettingsComponent } from './web-feature-settings.component';

describe('WebFeatureSettingsComponent', () => {
  let component: WebFeatureSettingsComponent;
  let fixture: ComponentFixture<WebFeatureSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebFeatureSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebFeatureSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
