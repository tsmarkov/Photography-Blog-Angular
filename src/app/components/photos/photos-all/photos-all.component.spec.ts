import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosAllComponent } from './photos-all.component';

describe('PhotosAllComponent', () => {
  let component: PhotosAllComponent;
  let fixture: ComponentFixture<PhotosAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotosAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
