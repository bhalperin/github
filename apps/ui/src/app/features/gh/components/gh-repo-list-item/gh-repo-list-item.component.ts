import { Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

import { GhFullUser, GhRepoContributor, GhUserRepo } from '@gh/shared/models';

import { GhService } from '../../services/gh.service';

@Component({
	selector: 'gh-repo-list-item',
	imports: [],
	templateUrl: './gh-repo-list-item.component.html',
	styleUrl: './gh-repo-list-item.component.scss',
})
export class GhRepoListItemComponent implements OnInit {
	readonly #ghService = inject(GhService);
	user = input.required<GhFullUser>();
	repo = input.required<GhUserRepo>();
	collapse = viewChild.required<ElementRef<HTMLElement>>('collapse');
	parentRepo = signal<GhUserRepo | undefined>(undefined);
	contributors = signal<GhRepoContributor[]>([]);
	sortedLanguages = signal<[string, number][]>([]);
	totalLanguages = 0;
	collapsed = signal(true);
	#fetchedFullData = false;

	ngOnInit() {
		const collapsibleElement = this.collapse().nativeElement;

		collapsibleElement.addEventListener('show.bs.collapse', async () => {
			this.collapsed.set(false);
			if (!this.#fetchedFullData) {
				await this.#getFullRepo();
				await this.#getContributors();
				await this.#getLanguages();
				this.#fetchedFullData = true;
			}
		});
		collapsibleElement.addEventListener('hide.bs.collapse', () => this.collapsed.set(true));
	}

	async #getFullRepo() {
		const repo = this.repo();
		const fullRepo = await firstValueFrom(this.#ghService.getRepo(repo.owner.login, repo.name));

		this.parentRepo.set(fullRepo.parent);
	}

	async #getContributors() {
		const repo = this.repo();
		const contributors = await firstValueFrom(this.#ghService.getRepoContributors(repo.owner.login, repo.name).pipe(map((response) => response.filter((c) => c.login !== repo.owner.login))));

		this.contributors.set(contributors);
	}

	async #getLanguages() {
		const repo = this.repo();
		const languages = await firstValueFrom(this.#ghService.getRepoLanguages(repo.owner.login, repo.name));

		this.sortedLanguages.set(Object.entries(languages).sort((a, b) => b[1] - a[1]));
		this.totalLanguages = Object.values(languages).reduce((acc, current) => acc + current, 0);
	}
}
