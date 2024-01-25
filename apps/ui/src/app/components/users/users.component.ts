import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { GhUser } from '@gh/shared';
import { tap } from 'rxjs';
import { GhService } from '../../services/gh.service';
import { UserComponent } from '../user/user.component';

@Component({
	selector: 'gh-users',
	standalone: true,
	imports: [CommonModule, UserComponent],
	templateUrl: './users.component.html',
	styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
	readonly #ghService = inject(GhService);
	readonly users = signal<GhUser[]>([]);

	ngOnInit(): void {
		this.#ghService
			.getUsers()
			.pipe(tap((response) => this.users.set(response)))
			.subscribe();
	}
}
