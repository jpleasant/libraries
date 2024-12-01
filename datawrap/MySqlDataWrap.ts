import {DataWrap, DataWrapConfig, SQLParameter} from "./Datawrap";

function MySqlDataWrap(config:DataWrapConfig): DataWrap {

    return {
        execute(sqlQuery: string, parameters?: SQLParameter[]): Promise<void> {
            return Promise.resolve(undefined);
        }, insert(sqlQuery: string, parameters?: SQLParameter[]): Promise<number | string> {
            return Promise.resolve(0);
        }, query<T>(sqlQuery: string, parameters?: SQLParameter[]): Promise<T>[] {
            return [];
        },
        transaction: async (queries, runInParallel) => {
            // Perform transaction
        },
        get: async (entity, id) => {
            // Retrieve entity from database
            return [];
        },
        add: async (entity) => {
            // Insert entity into database
            return 0;
        },
        addMany: async (entityList) => {
            // Insert multiple entities into database
        },
        update: async (entity) => {
            // Update entity in database
        },
        delete: async (entity, id) => {
            // Delete entity from database
        }
    };
}