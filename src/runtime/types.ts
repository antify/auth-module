import type {Auth} from './server/datasources/schemas/auth';
import type {MultiConnectionClient, SingleConnectionClient} from "@antify/database";

export type DatabaseHandler = {
	getDatabaseClient(): Promise<SingleConnectionClient | MultiConnectionClient>
	findOneAuthByPassword(identifier: string, password: string): Promise<Auth | null>
}

export type {Auth} from './server/datasources/schemas/auth';
export type {AuthProviderAccess} from './server/datasources/schemas/authProviderAccess';
export type {Role} from './server/datasources/schemas/role';
