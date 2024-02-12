import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, computed, inject, input, signal } from '@angular/core';
import { GhFullUser, GhUser, GhUserRepo } from '@gh/shared';
import * as bootstrap from 'bootstrap';
import { GhService } from 'services/gh.service';
import { StoreService } from 'services/store.service';
import { UserReposComponent } from '../user-repos/user-repos.component';

@Component({
	selector: 'gh-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.scss',
	imports: [CommonModule, UserReposComponent]
})
export class UserComponent implements OnInit {
	@ViewChild('flipIcon', { static: true }) flipIcon: ElementRef<HTMLImageElement> | undefined;
	readonly #storeService = inject(StoreService);
	readonly #ghService = inject(GhService);
	user = input.required<GhUser>();
	fullUser = signal<GhFullUser | undefined>(undefined);
	flipped = false;
	userRepos = signal<GhUserRepo[]>([]);
	reposModalId = computed(() => `reposModal-${this.user().id}`);

	#enableTooltip(): void {
		const tooltipTriggerList = document.querySelectorAll(
			'[data-bs-toggle="tooltip"]',
		);

		tooltipTriggerList.forEach(
			(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
		);
	}

	#getUser(): void {
		this.#ghService.getUser(this.user().login).subscribe({
			next: (response) => this.fullUser.set(response)
		});
	}

	#flipUser(): void {
		this.flipped = !this.flipped;
		this.#enableTooltip();
	}

	ngOnInit(): void {
		if (this.#storeService.isUserCardFlipped(this.user().id)) {
			this.flipIcon?.nativeElement.click();
		}
		this.#enableTooltip();
	}

	public flipClicked(ev: MouseEvent, frontClicked: boolean): void {
		ev.stopPropagation();
		bootstrap.Tooltip.getInstance(ev.target as HTMLElement)?.hide();

		if (frontClicked && !this.fullUser()) {
			this.#getUser();
		}

		this.#flipUser();
		this.#storeService.updateUserCards(this.user().id, this.flipped);
	}
}
