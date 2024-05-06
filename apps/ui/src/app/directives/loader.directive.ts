import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
	Directive,
	ElementRef,
	Input,
	effect,
	inject,
	input,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LoaderComponent } from '../components/loader/loader.component';

@Directive({
	selector: '[ghLoader]',
	standalone: true,
})
export class LoaderDirective {
	elementRef = inject(ElementRef);
	#overlay = inject(Overlay);
	loaderData = input<Observable<any>>();
	loader = effect(() => {
		this.currentSubscription?.unsubscribe();
		if (this.loaderData()) {
			this.show();
			this.currentSubscription = this.loaderData()?.subscribe({
				next: () => this.hide(),
				error: () => this.hide(),
			});
		}
	});
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
		panelClass: 'loading-overlay'
	});
	currentSubscription: Subscription | undefined;

	show(): void {
		this.overlayRef.attach(new ComponentPortal(LoaderComponent));
	}

	hide() {
		this.overlayRef.detach();
	}
}
