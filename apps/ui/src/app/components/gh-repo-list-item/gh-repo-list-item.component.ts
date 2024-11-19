import { Component, ElementRef, OnInit, inject, input, signal, viewChild } from '@angular/core';
import { GhFullUser, GhRepoContributor, GhUserRepo } from '@gh/shared';
import { firstValueFrom, map } from 'rxjs';
import { GhService } from 'services/gh.service';

@Component({
	selector: 'gh-repo-list-item',
	imports: [],
	templateUrl: './gh-repo-list-item.component.html',
	styleUrl: './gh-repo-list-item.component.scss',
})
export class GhRepoListItemComponent implements OnInit {
	readonly #ghService = inject(GhService);
	user = input.required<GhFullUser | undefined>();
	repo = input.required<GhUserRepo>();
	collapse = viewChild<ElementRef<HTMLElement>>('collapse');
	parentRepo = signal<GhUserRepo | undefined>(undefined);
	contributors = signal<GhRepoContributor[]>([]);
	sortedLanguages = signal<[string, number][]>([]);
	totalLanguages = 0;
	collapsed = signal(true);
	#fetchedFullData = false;

	ngOnInit() {
		this.collapse()?.nativeElement.addEventListener('show.bs.collapse', async () => {
			this.collapsed.set(false);
			if (!this.#fetchedFullData) {
				await this.#getRepo();
				await this.#getContributors();
				await this.#getLanguages();
				this.#fetchedFullData = true;
			}
		});
		this.collapse()?.nativeElement.addEventListener('hide.bs.collapse', () => this.collapsed.set(true));
	}

	async #getRepo() {
		await firstValueFrom(this.#ghService.getRepo(this.repo().owner.login, this.repo().name))
			.then((response) => this.parentRepo.set(response.parent));
	}

	async #getContributors() {
		await firstValueFrom(this.#ghService.getRepoContributors(this.repo().owner.login, this.repo().name)
			.pipe(map((response) => response.filter((c) => c.login !== this.repo().owner.login))))
			.then((response) => this.contributors.set(response),
		);
	}

	async #getLanguages() {
		await firstValueFrom(this.#ghService.getRepoLanguages(this.repo().owner.login, this.repo().name))
			.then((response) => {
				this.sortedLanguages.set(Object.entries(response).sort((a, b) => b[1] - a[1]));
				this.totalLanguages = Object.values(response).reduce((acc, current) => acc + current, 0);
			});
	}
}
