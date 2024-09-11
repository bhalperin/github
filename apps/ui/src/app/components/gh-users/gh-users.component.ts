import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GhUser } from '@gh/shared';
import { AppRouter } from 'fw-extensions/app-router';
import { first, last } from 'lodash-es';
import { Observable, catchError, of, take, tap } from 'rxjs';
import { GhService } from 'services/gh.service';
import { GhUserService } from 'services/gh-user.service';
import { LoaderDirective } from '../../directives/loader.directive';
import { GhUserComponent } from '../gh-user/gh-user.component';

@Component({
	selector: 'gh-users',
	standalone: true,
	imports: [CommonModule, GhUserComponent, LoaderDirective],
	templateUrl: './gh-users.component.html',
	styleUrl: './gh-users.component.scss',
})
export class GhUsersComponent implements OnInit {
	readonly #router = inject(AppRouter);
	readonly #titleService = inject(Title);
	readonly #ghService = inject(GhService);
	readonly #userService = inject(GhUserService);
	readonly users = signal<GhUser[]>([]);
	firstUserId = computed(() => first(this.users())?.id);
	lastUserId = computed(() => last(this.users())?.id);
	isLoading = signal(true);
	users$ = new Observable<GhUser[]>();

	ngOnInit(): void {
		this.#titleService.setTitle('Github users | nest + angular');
		this.getNextUsers();
	}

	getNextUsers() {
		this.isLoading.set(true);
		this.users$ = this.#ghService.getUsers(this.lastUserId());
		this.users$
			.pipe(
				tap((response) => {
					this.users.set(response);
					this.isLoading.set(false);
				}),
				catchError(error => {
					this.isLoading.set(false);
					this.#router.navigateToLogin();

					return of([]);
				})
			)
			.subscribe();
	}

	flipUsersToFront() {
		this.#userService.showAllFaces();
	}
}
