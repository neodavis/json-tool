import { Injectable } from "@angular/core";

import { Flyweight } from "./base-flyweight";

@Injectable({ providedIn: 'root' })
export class SchemaFlyweight implements Flyweight<Map<string, any>> {
  private instances: Map<string, any> = new Map();

  getSchema(schemaId: string, schema: any): any {
    if (!this.instances.has(schemaId)) {
      this.instances.set(schemaId, schema);
      return schema;
    }

    const existingSchema = this.instances.get(schemaId);
    if (this.areSchemasEqual(existingSchema, schema)) {
      return existingSchema;
    }

    this.instances.set(schemaId, schema);
    return schema;
  }

  areSchemasEqual(schema1: any, schema2: any): boolean {
    if (schema1 === schema2) return true;
    if (!schema1 || !schema2) return false;
    
    const keys1 = Object.keys(schema1);
    const keys2 = Object.keys(schema2);
    
    if (keys1.length !== keys2.length) return false;
    
    return keys1.every(key => {
      const val1 = schema1[key];
      const val2 = schema2[key];
      
      if (typeof val1 === 'object' && typeof val2 === 'object') {
        return this.areSchemasEqual(val1, val2);
      }
      return val1 === val2;
    });
  }

  getKey(): string {
    return 'schema';
  }

  getValue(): Map<string, any> {
    return this.instances;
  }
}