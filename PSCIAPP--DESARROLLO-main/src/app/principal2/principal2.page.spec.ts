import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Principal2Page } from './principal2.page';

describe('Principal2Page', () => {
  let component: Principal2Page;
  let fixture: ComponentFixture<Principal2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Principal2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
