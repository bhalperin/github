import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { AppRouter } from 'fw-extensions/app-router';
import { removeBootstrapModals } from 'utils/dom';

@Component({
	selector: 'gh-token-expired',
	imports: [],
	templateUrl: './token-expired.component.html',
	styleUrl: './token-expired.component.scss',
})
export class TokenExpiredComponent implements OnInit {
	readonly #router = inject(AppRouter);
	modalElementRef = viewChild.required<ElementRef>('modal');

	ngOnInit() {
		this.#showDialogAndRedirect();
	}

	#showDialogAndRedirect() {
		const element = this.modalElementRef().nativeElement as Element;
		const modal = new bootstrap.Modal(element);

		removeBootstrapModals();

		element.addEventListener('hidden.bs.modal', () => this.#router.navigateToLogin());
		modal.show();
	}
}
