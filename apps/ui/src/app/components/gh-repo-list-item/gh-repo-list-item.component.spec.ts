import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhRepoListItemComponent } from './gh-repo-list-item.component';

describe('GhRepoListItemComponent', () => {
	let component: GhRepoListItemComponent;
	let fixture: ComponentFixture<GhRepoListItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GhRepoListItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GhRepoListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
