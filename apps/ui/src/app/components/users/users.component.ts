import { CommonModule } from '@angular/common';
import {
	Component,
	OnInit,
	computed,
	inject,
	signal
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GhUser } from '@gh/shared';
import { first, last } from 'lodash-es';
import { Observable, finalize, take, tap } from 'rxjs';
import { GhService } from 'services/gh.service';
import { UserService } from 'services/user.service';
import { LoaderDirective } from '../../directives/loader.directive';
import { UserComponent } from '../user/user.component';

@Component({
	selector: 'gh-users',
	standalone: true,
	imports: [CommonModule, UserComponent, LoaderDirective],
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
	readonly #titleService = inject(Title);
	readonly #ghService = inject(GhService);
	readonly #userService = inject(UserService);
	readonly users = signal<GhUser[]>([]);
	firstUserId = computed(() => first(this.users())?.id);
	lastUserId = computed(() => last(this.users())?.id);
	isLoading = true;
	users$ = new Observable<GhUser[]>();

	ngOnInit(): void {
		this.#titleService.setTitle('Github users | nest + angular');
		this.getNextUsers();
	}

	getNextUsers(): void {
		this.isLoading = true;
		this.users$ = this.#ghService.getUsers(this.lastUserId());
		this.users$
			.pipe(
				take(1),
				tap((response) => this.users.set(response)),
				finalize(() => (this.isLoading = false)),
			)
			.subscribe();
	}

	flipUsersToFront(): void {
		this.#userService.showAllFaces();
	}
}
