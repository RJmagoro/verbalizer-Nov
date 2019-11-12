import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserchatPage } from './userchat.page';

describe('UserchatPage', () => {
  let component: UserchatPage;
  let fixture: ComponentFixture<UserchatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserchatPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserchatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
