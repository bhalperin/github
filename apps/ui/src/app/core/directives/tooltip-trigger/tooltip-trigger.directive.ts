import { Directive, ElementRef, inject } from '@angular/core';
import { Tooltip } from 'bootstrap';

@Directive({
	selector: '[ghTooltipTrigger]',
})
export class TooltipTriggerDirective {
	readonly elementRef = inject(ElementRef);

	constructor() {
		new Tooltip(this.elementRef.nativeElement, { trigger: 'hover' });
	}
}
