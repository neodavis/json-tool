export enum DocumentType {
  JSON = 'json',
  SCHEMA = 'schema',
}

export interface SchemaDocument {
    id: number;
    content: string;
}

export interface JsonDocument {
    id: number;
    content: string;
}

export interface UserJsonDocuments {
    userId: string;
    documentId: string;
}

export interface UserSchemaDocuments {
    userId: string;
    documentId: string;
}
