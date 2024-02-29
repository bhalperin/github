import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GhUser } from '@gh/shared';
import { first, last } from 'lodash-es';
import { finalize, tap } from 'rxjs';
import { GhService } from 'services/gh.service';
import { UserComponent } from '../user/user.component';

@Component({
	selector: 'gh-users',
	standalone: true,
	imports: [CommonModule, UserComponent],
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
	readonly #titleService = inject(Title);
	readonly #ghService = inject(GhService);
	readonly users = signal<GhUser[]>([]);
	firstUserId = computed(() => first(this.users())?.id);
	lastUserId = computed(() => last(this.users())?.id);
	isLoading = true;

	ngOnInit(): void {
		this.#titleService.setTitle('Github users | nest + angular');
		this.getNextUsers();
	}

	getNextUsers(): void {
		this.isLoading = true;
		this.#ghService
			.getUsers(this.lastUserId())
			.pipe(
				tap((response) => this.users.set(response)),
				finalize(() => (this.isLoading = false)),
			)
			.subscribe();
	}
}
