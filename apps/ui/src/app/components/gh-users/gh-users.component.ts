import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, resource, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GhUser } from '@gh/shared';
import { first, last } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { GhUserService } from 'services/gh-user.service';
import { GhService } from 'services/gh.service';
import { LoaderDirective } from '../../directives/loader/loader.directive';
import { TooltipTriggerDirective } from '../../directives/tooltip-trigger/tooltip-trigger.directive';
import { GhUserComponent } from '../gh-user/gh-user.component';

@Component({
	selector: 'gh-users',
	imports: [CommonModule, GhUserComponent, LoaderDirective, TooltipTriggerDirective],
	templateUrl: './gh-users.component.html',
	styleUrl: './gh-users.component.scss',
})
export class GhUsersComponent implements OnInit {
	readonly #titleService = inject(Title);
	readonly #ghService = inject(GhService);
	readonly #userService = inject(GhUserService);
	readonly users = signal<GhUser[]>([]);
	readonly pseudoPageIndex = signal(0);
	readonly sinceIdList = [] as number[];
	readonly firstUserId = computed(() => first(this.users())?.id);
	readonly lastUserId = computed(() => last(this.users())?.id);
	readonly isLoading = signal(true);
	readonly incrementPage = () => this.pseudoPageIndex.update((page) => page + 1);
	readonly decrementPage = () => this.pseudoPageIndex.update((page) => page - 1);
	readonly usersResource = resource({
		request: this.pseudoPageIndex,
		loader: async (params) => {
			if (params.request < this.sinceIdList.length - 1) {
				this.sinceIdList.pop();
			} else {
				this.sinceIdList.push(this.lastUserId() ?? 0);
			}
			await this.getUsers(last(this.sinceIdList));
		}
	});

	ngOnInit() {
		this.#titleService.setTitle('Github users | nest + angular');
		this.#userService.updateCardFaces(false);
	}

	protected async getUsers(since = 0) {
		this.isLoading.set(true);
		await firstValueFrom(this.#ghService.getUsers(since))
			.then((users) => this.users.set(users));
		this.isLoading.set(false);
	}

	protected flipUsersToFront() {
		this.#userService.updateCardFaces(true);
	}
}
