import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, OnDestroy, effect, inject, input } from '@angular/core';
import { LoaderComponent } from '../components/loader/loader.component';

@Directive({
	selector: '[ghLoader]',
	standalone: true,
})
export class LoaderDirective implements OnDestroy {
	elementRef = inject(ElementRef);
	#overlay = inject(Overlay);
	loading = input<boolean>();
	loader = effect(() => (this.loading() ? this.show() : this.hide()));
	overlayRef = this.#overlay.create({
		positionStrategy: this.#overlay
			.position()
			.flexibleConnectedTo(this.elementRef)
			.withPush(false)
			.withPositions([
				{
					originX: 'start',
					originY: 'top',
					overlayX: 'start',
					overlayY: 'top',
				},
			]),
		hasBackdrop: false,
		panelClass: 'loading-overlay',
	});

	ngOnDestroy(): void {
		this.hide();
	}

	show(): void {
		this.overlayRef.attach(new ComponentPortal(LoaderComponent));
	}

	hide() {
		this.overlayRef.detach();
	}
}
