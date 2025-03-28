import { CommonModule } from '@angular/common';
import { Component, OnInit, Signal, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { first, last } from 'lodash-es';
import { debounceTime, filter } from 'rxjs';
import { GhUserService } from 'services/gh-user.service';
import { GhService } from 'services/gh.service';
import { LoaderDirective } from '../../directives/loader/loader.directive';
import { TooltipTriggerDirective } from '../../directives/tooltip-trigger/tooltip-trigger.directive';
import { GhUserComponent } from '../gh-user/gh-user.component';

@Component({
	selector: 'gh-users',
	imports: [CommonModule, ReactiveFormsModule, GhUserComponent, LoaderDirective, TooltipTriggerDirective],
	templateUrl: './gh-users.component.html',
	styleUrl: './gh-users.component.scss',
})
export class GhUsersComponent implements OnInit {
	readonly #titleService = inject(Title);
	readonly #ghService = inject(GhService);
	readonly #userService = inject(GhUserService);
	readonly #formBuilder = inject(FormBuilder);
	readonly pseudoPageIndex = signal(0);
	readonly #sinceIdList = [] as number[];
	userListRangeIds = { } as { first: number | undefined; last: number | undefined; };
	readonly incrementPage = () => this.pseudoPageIndex.update((page) => page + 1);
	readonly decrementPage = () => this.pseudoPageIndex.update((page) => page - 1);
	readonly #lastSinceId = computed(() => {
		if (this.pseudoPageIndex() < this.#sinceIdList.length - 1) {
			this.#sinceIdList.pop();
		} else {
			this.#sinceIdList.push(this.userListRangeIds.last ?? 0);
		}

		return last(this.#sinceIdList);
	});
	protected readonly usersPageResource = this.#ghService.getUsersResource(this.#lastSinceId);
	protected searchForm = this.#formBuilder.group({
		userName: new FormControl('', Validators.required),
	});
	readonly #searchUserName = toSignal(this.searchForm.controls['userName'].valueChanges
		.pipe(
			debounceTime(300),
			filter((searchTerm) => !!searchTerm && searchTerm.length > 1)
		)) as Signal<string>;
	protected readonly searchUsersResource = this.#ghService.searchUsersResource(this.#searchUserName, this.pseudoPageIndex);

	constructor() {
		effect(() => {
			const userList = this.usersPageResource.value();

			this.userListRangeIds.first = first(userList)?.id;
			this.userListRangeIds.last = last(userList)?.id;
		});
	}

	ngOnInit() {
		this.#titleService.setTitle('Github users | nest + angular');
		this.#userService.updateCardFaces(false);
	}

	protected flipUsersToFront() {
		this.#userService.updateCardFaces(true);
	}
}
