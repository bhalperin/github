import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
	standalone: true,
	imports: [NxWelcomeComponent, RouterModule, RouterOutlet],
	selector: 'gh-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
	readonly #titleService = inject(Title);

	ngOnInit(): void {
		this.#titleService.setTitle('Github home | nest + angular');
	}
}
