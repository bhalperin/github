import { Component, input, inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhFullUser, GhUserRepo } from '@gh/shared/models';
import { describe, expect, test } from 'vitest';
import { GhUserReposComponent } from './gh-user-repos.component';

@Component({
	selector: 'gh-user',
	standalone: true,
	template: '',
})
class GhUserReposMockComponent {
	user = input.required<GhFullUser | undefined>();
	repos = input.required<GhUserRepo[]>();
}

describe('GhUserReposComponent', () => {
	let component: GhUserReposComponent;
	let fixture: ComponentFixture<GhUserReposComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GhUserReposComponent],
		})
			.overrideComponent(GhUserReposComponent, {
				remove: {
					imports: [GhUserReposComponent],
				},
				add: {
					imports: [GhUserReposMockComponent],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(GhUserReposComponent, {
			bindings: [inputBinding('user', () => undefined), inputBinding('repos', () => [])],
		});
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
