import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { GhFullUser, GhUserRepo } from '@gh/shared';
import { RepoListItemComponent } from '../repo-list-item/repo-list-item.component';

@Component({
	selector: 'gh-user-repos',
	standalone: true,
	imports: [CommonModule, RepoListItemComponent],
	templateUrl: './user-repos.component.html',
	styleUrl: './user-repos.component.scss',
})
export class UserReposComponent {
	user = input.required<GhFullUser | undefined>();
	repos = input.required<GhUserRepo[]>();
}
