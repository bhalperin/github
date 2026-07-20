import { inputBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhUserRepoMock } from '@gh/shared/models';
import { describe, expect, test } from 'vitest';
import { GhRepoListItemComponent } from './gh-repo-list-item.component';

const ghUserRepoMock = new GhUserRepoMock();

describe('GhRepoListItemComponent', () => {
	let component: GhRepoListItemComponent;
	let fixture: ComponentFixture<GhRepoListItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [GhRepoListItemComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(GhRepoListItemComponent, {
			bindings: [inputBinding('user', () => undefined), inputBinding('repo', () => ghUserRepoMock.data)],
		});
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});
});
