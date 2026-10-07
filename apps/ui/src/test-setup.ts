import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import chalk from 'chalk';

import './styles.scss';

console.log(chalk.bgBlue.white('🧪 test-setup.ts: Setting up Angular testing environment for Vitest'));

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
