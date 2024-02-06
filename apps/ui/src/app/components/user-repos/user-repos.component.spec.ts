import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReposComponent } from './user-repos.component';

describe('UserReposComponent', () => {
  let component: UserReposComponent;
  let fixture: ComponentFixture<UserReposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserReposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
