import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { GhFullUser, GhUser } from '@gh/shared';
import * as bootstrap from 'bootstrap';
import { GhService } from '../../services/gh.service';

@Component({
	selector: 'gh-user',
	standalone: true,
	templateUrl: './user.component.html',
	styleUrl: './user.component.scss',
	imports: [CommonModule],
})
export class UserComponent implements OnInit {
	user = input.required<GhUser>();
	fullUser = signal<GhFullUser | undefined>(undefined);
	flipped = false;
	readonly #ghService = inject(GhService);

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
		this.#enableTooltip();
	}

	public flipClicked(ev: MouseEvent, frontClicked: boolean): void {
		ev.stopPropagation();
		bootstrap.Tooltip.getInstance(ev.target as HTMLElement)?.hide();

		if (frontClicked && !this.fullUser()) {
			this.#getUser();
		}

		this.#flipUser();
	}
}
