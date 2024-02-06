import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { GhFullUser, GhUserRepo } from '@gh/shared';

@Component({
	selector: 'gh-user-repos',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './user-repos.component.html',
	styleUrl: './user-repos.component.css',
})
export class UserReposComponent {
	user = input.required<GhFullUser | undefined>();
	repos = input.required<GhUserRepo[]>();
}
