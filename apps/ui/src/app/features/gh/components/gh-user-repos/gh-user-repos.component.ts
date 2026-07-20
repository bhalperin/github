import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { GhFullUser, GhUserRepo } from '@gh/shared/models';
import { GhRepoListItemComponent } from '../gh-repo-list-item/gh-repo-list-item.component';

@Component({
	selector: 'gh-user-repos',
	imports: [CommonModule, GhRepoListItemComponent],
	templateUrl: './gh-user-repos.component.html',
	styleUrl: './gh-user-repos.component.scss',
})
export class GhUserReposComponent {
	user = input.required<GhFullUser | undefined>();
	repos = input.required<GhUserRepo[]>();
}
