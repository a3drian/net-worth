export interface IUser {
	email: string;
	displayName: string;
	uid: string;
}

export class GoogleUser implements IUser {
	providerId?: string;
	proactiveRefresh?: string;
	reloadUserInfo?: string;
	reloadListener?: string;
	uid!: string;
	auth?: string;
	stsTokenManager?: string;
	accessToken?: string;
	displayName!: string;
	email!: string;
	phoneNumber?: string;
	photoURL?: string;
	tenantId?: string;
}
