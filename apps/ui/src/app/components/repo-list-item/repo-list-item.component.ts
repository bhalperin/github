import {
	Component,
	ElementRef,
	OnInit,
	inject,
	input,
	signal,
	viewChild,
} from '@angular/core';
import {
	GhFullUser,
	GhRepoContributor,
	GhRepoLanguages,
	GhUserRepo,
} from '@gh/shared';
import { map, take, tap } from 'rxjs';
import { GhService } from 'services/gh.service';

@Component({
	selector: 'gh-repo-list-item',
	standalone: true,
	imports: [],
	templateUrl: './repo-list-item.component.html',
	styleUrl: './repo-list-item.component.scss',
})
export class RepoListItemComponent implements OnInit {
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

	ngOnInit(): void {
		this.collapse()?.nativeElement.addEventListener(
			'show.bs.collapse',
			() => {
				this.collapsed.set(false);
				if (!this.#fetchedFullData) {
					this.#getRepo();
					this.#getContributors();
					this.#getLanguages();
					this.#fetchedFullData = true;
				}
			},
		);
		this.collapse()?.nativeElement.addEventListener(
			'hide.bs.collapse',
			() => this.collapsed.set(true),
		);
	}

	#getRepo(): void {
		this.#ghService
			.getRepo(this.repo().owner.login, this.repo().name)
			.pipe(
				take(1),
				tap((response) => this.parentRepo.set(response.parent)),
			)
			.subscribe();
	}

	#getContributors(): void {
		this.#ghService
			.getRepoContributors(this.repo().owner.login, this.repo().name)
			.pipe(
				take(1),
				map((response) =>
					response.filter((c) => c.login !== this.repo().owner.login),
				),
				tap((response) => this.contributors.set(response)),
			)
			.subscribe();
	}

	#getLanguages(): void {
		this.#ghService
			.getRepoLanguages(this.repo().owner.login, this.repo().name)
			.pipe(
				take(1),
				tap((response) => {
					this.sortedLanguages.set(
						Object.entries(response).sort((a, b) => b[1] - a[1]),
					);
					this.totalLanguages = Object.values(response).reduce(
						(acc, current) => acc + current,
						0,
					);
				}),
			)
			.subscribe();
	}
}
