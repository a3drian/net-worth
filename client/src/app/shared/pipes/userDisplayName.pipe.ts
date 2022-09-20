import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'userDisplayName' })
export class UserDisplayNamePipe implements PipeTransform {

	transform(displayName?: string): string {
		const name = displayName ?? '';
		return name.split(' ')[0];
	}
}
