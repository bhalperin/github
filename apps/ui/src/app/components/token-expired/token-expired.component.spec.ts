import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenExpiredComponent } from './token-expired.component';

describe('TokenExpiredComponent', () => {
	let component: TokenExpiredComponent;
	let fixture: ComponentFixture<TokenExpiredComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TokenExpiredComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TokenExpiredComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
