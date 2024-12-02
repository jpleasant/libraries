import {FieldPacket, Pool, QueryResult, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import { DataWrap, SQLParameter, TransactionQuery } from "./Datawrap";
import { DataWrapEntity } from "./DataWrapEntity";



export class MySqlDataWrap implements DataWrap {
    public static GetInstance(connectionPool:Pool): MySqlDataWrap {
        if (this.uniqueInstance == null){
            this.uniqueInstance = new MySqlDataWrap(connectionPool);
        }

        return this.uniqueInstance;
    }
    private static uniqueInstance: MySqlDataWrap | null = null;
    private readonly pool : Pool;

    private constructor(connectionPool:Pool) {
        this.pool = connectionPool;
        this.pool.config.namedPlaceholders = true;
    }
    public async insert(sqlQuery: string, params?: SQLParameter[]):Promise<number> {
        let sqlParams:any = {}
        params?.forEach((param) => {
            const name = param.name;
            sqlParams[name as keyof typeof sqlParams] = param.value;
        })

        const [results] = await this.pool.query<ResultSetHeader>(sqlQuery, sqlParams);
        return results.insertId;
    }
    public async query<T>(sqlQuery: string, params?: SQLParameter[]): Promise<T[]>{
        let sqlParams:any = {}
        params?.forEach((param) => {
            const name = param.name;
            sqlParams[name as keyof typeof sqlParams] = param.value;
        })

        const [results] = await this.pool.query<RowDataPacket[]>(sqlQuery, sqlParams);
        return results.map((row)=> {
            return JSON.parse(JSON.stringify(row))
        });

    }
    public async execute(sqlQuery:string, params?: SQLParameter[]): Promise<void>{
        let sqlParams:any = {}
        params?.forEach((param) => {
            const name = param.name;
            sqlParams[name as keyof typeof sqlParams] = param.value;
        })

        await this.pool.query<ResultSetHeader>(sqlQuery, sqlParams);
    }

    public async transaction(queries:TransactionQuery[], runInParallel:boolean = false): Promise<void>{
        const connection = await this.pool.getConnection();
        try{

            await connection.beginTransaction();

            const queryPromises: Promise<[QueryResult, FieldPacket[]]>[] = [];
            for (const transactionQuery of queries) {
                const queryParams:any = {};
                transactionQuery.params?.forEach((param) => {
                    const name = param.name;
                    queryParams[name as keyof typeof queryParams] = param.value;
                })

                if(runInParallel){
                    const queryPromise = connection.query(transactionQuery.query, queryParams);
                    queryPromises.push(queryPromise);
                }
                else{
                    await connection.query(transactionQuery.query, queryParams);
                }
            }
            if(runInParallel){
                await Promise.all(queryPromises)
            }

            await connection.commit();
        }
        catch (err){
            await connection.rollback();
            throw new Error(err as string);
        }
        finally {
            connection.release();
        }
        
    }
    
    public async get<T>(entity:DataWrapEntity, id:unknown):Promise<T[]>{
        
        return []
    }

}