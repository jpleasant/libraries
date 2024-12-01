//initialize on construction
import {DataWrapEntity} from "./DataWrapEntity";

export interface DataWrap {
    /**
     * query is used primarily in select queries. Generic typing is supported by providing a
     * single type (ie string) and the function returns an array of that type (ie string[]).
     * @param sqlQuery
     * @param parameters
     * @returns Promise<T>[]
     */
    query<T>(sqlQuery:string, parameters?:SQLParameter[]):Promise<T>[],

    /**
     * insert is used for insert queries. It differs from query only in that it returns the id of the inserted row.
     * @param sqlQuery
     * @param parameters
     * @returns Promise<number | string>
     */
    insert(sqlQuery:string, parameters?:SQLParameter[]):Promise<number | string>,

    /**
     * execute is used for queries that do not return a result set. It is used for update, delete, and other queries.
     * @param sqlQuery
     * @param parameters
     * @returns Promise<void>
     */
    execute(sqlQuery:string, parameters?:SQLParameter[]):Promise<void>,

    /**
     * transaction is used to run multiple queries in a single transaction.
     * If runInParallel is true, the queries will run in parallel. If any query fails, the transaction will be rolled back.
     * @param queries
     * @param runInParallel
     * @returns Promise<void>
     */
    transaction(queries:TransactionQuery[], runInParallel:boolean):Promise<void>,

    /**
     * get is used to retrieve a single entity from the database.
     * Select queries are generated dynamically based on the entity's properties.
     * The entity parameter can have empty values, only the entity keys are needed to generate the query.
     * @param entity
     * @param id
     * @returns Promise<T>[]
     */
    get<T>(entity:DataWrapEntity, id:unknown):Promise<T[]>,
    /**
     * Add is used to insert a single entity into the database.
     * Insert queries are generated dynamically based on the entity's properties. It returns the id of the inserted row.
     * Entity must inherit from IDataWrapEntity for this to work properly.
     * Similar to query, the return type is an array of the type provided.
     * @param entity
     * @returns Promise<number | string>
     */
    add(entity:DataWrapEntity):Promise<number | string>,

    /**
     * addMany is used to perform a bulk insert of multiple entities into the database.
     * Insert queries are generated dynamically based on the entity's properties.
     * Entity must inherit from IDataWrapEntity for this to work properly.
     * @param entityList
     * @returns Promise<void>
     */
    addMany(entityList:DataWrapEntity[]):Promise<void>,

    /**
     * update is used to update a single entity in the database.
     * Update queries are generated dynamically based on the entity's properties.
     * Entity must inherit from IDataWrapEntity for this to work properly.
     * @param entity
     * @returns Promise<void>
     */
    update(entity:DataWrapEntity):Promise<void>,

    /**
     * delete is used to delete a single entity from the database.
     * Delete queries are generated dynamically based on the entity's properties.
     * Entity must inherit from IDataWrapEntity for this to work properly.
     * The id column is identified by default if the object contains an 'id' property or an 'ObjectnameID' property.
     * If the id column is named differently, the entity must include a decorator of primary key to indicate the id column.
     * The entity parameter can have empty values, only the entity keys are needed to generate the query.
     * @param entity
     * @param id
     * @returns Promise<void>
     */
    delete(entity:DataWrapEntity, id:unknown):Promise<void>,

    
}

/**
 * SQLParameter is used to pass parameters to DataWrap functions.
 * The SQL query will contain placeholders for the parameters, and the parameters will be passed in an array.
 * This definition provides an associated name and value for the parameter to ease readability in the sql statement.
 * For example, (SELECT email FROM user WHERE username = :username), the parameter would be {name: 'username', value: 'value'}
 */
export type SQLParameter = {
    name:string;
    value:unknown;
}

export type TransactionQuery = {
    query:string,
    params:SQLParameter[]
}

export type DataWrapConfig = {
    host:string,
    port:string,
    database:string,
    username:string,
    password:string,
    maxConnections:number,
}


