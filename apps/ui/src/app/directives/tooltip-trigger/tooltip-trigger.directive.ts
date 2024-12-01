import { Directive, ElementRef, inject } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Directive({
	selector: '[ghTooltipTrigger]',
})
export class TooltipTriggerDirective {
	elementRef = inject(ElementRef);

	constructor() {
		new bootstrap.Tooltip(this.elementRef.nativeElement);
	}
}
