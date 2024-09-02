import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhUserReposComponent } from './gh-user-repos.component';

describe('GhUserReposComponent', () => {
	let component: GhUserReposComponent;
	let fixture: ComponentFixture<GhUserReposComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GhUserReposComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GhUserReposComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
