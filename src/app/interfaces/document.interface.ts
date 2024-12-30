export enum DocumentType {
    JSON = 'json',
    SCHEMA = 'schema'
}

export interface Document {
    id: number;
    content: string;
    type: DocumentType;
    lastModified: Date;
}

export interface DbMigration {
    version: number;
    migrate: (db: IDBDatabase) => void;
}
