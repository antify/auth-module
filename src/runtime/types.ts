import type {Auth} from './server/datasources/schemas/auth';
import type {MultiConnectionClient, SingleConnectionClient} from "@antify/database";
import type {JWTPayload} from 'jose';

export type Permission = {
	id: string
	name: string
}
export type JsonWebToken = {
	id?: string,
	isSuperAdmin?: boolean;
	providers?: JsonWebTokenProvider[];
} & JWTPayload;
export type JsonWebTokenProvider = {
	providerId: string;
	tenantId: string | null;
	isAdmin: boolean;
	permissions: string[];
}
export type DatabaseHandler = {
	getDatabaseClient(): Promise<SingleConnectionClient | MultiConnectionClient>
	findOneAuthByPassword(identifier: string, password: string): Promise<Auth | null>
}

export type {Auth} from './server/datasources/schemas/auth';
export type {AuthProviderAccess} from './server/datasources/schemas/authProviderAccess';
export type {Role} from './server/datasources/schemas/role';
