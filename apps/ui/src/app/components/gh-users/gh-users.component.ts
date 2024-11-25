import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GhUser } from '@gh/shared';
import { first, last } from 'lodash-es';
import { Observable, firstValueFrom } from 'rxjs';
import { GhUserService } from 'services/gh-user.service';
import { GhService } from 'services/gh.service';
import { LoaderDirective } from '../../directives/loader.directive';
import { GhUserComponent } from '../gh-user/gh-user.component';

@Component({
	selector: 'gh-users',
	imports: [CommonModule, GhUserComponent, LoaderDirective],
	templateUrl: './gh-users.component.html',
	styleUrl: './gh-users.component.scss',
})
export class GhUsersComponent implements OnInit {
	readonly #titleService = inject(Title);
	readonly #ghService = inject(GhService);
	readonly #userService = inject(GhUserService);
	readonly users = signal<GhUser[]>([]);
	firstUserId = computed(() => first(this.users())?.id);
	lastUserId = computed(() => last(this.users())?.id);
	isLoading = signal(true);
	users$ = new Observable<GhUser[]>();

	ngOnInit() {
		this.#titleService.setTitle('Github users | nest + angular');
		this.#userService.updateCardFaces(false);
		this.getNextUsers();
	}

	protected async getNextUsers() {
		this.isLoading.set(true);
		this.users$ = this.#ghService.getUsers(this.lastUserId());
		await firstValueFrom(this.users$)
			.then((users) => this.users.set(users));
		this.isLoading.set(false);
	}

	protected flipUsersToFront() {
		this.#userService.updateCardFaces(true);
	}
}
