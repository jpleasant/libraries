export class DataWrapEntity {
    constructor() {
        this.columnOverrides = new Map<string, ColumnOverride>();
    }

    private columnOverrides: Map<string,ColumnOverride>;
    private tableNameOverride: string | undefined;
    private primaryKey: string | undefined;
    getTableName(): string {
        if(this.tableNameOverride){
            return this.tableNameOverride;
        } else {
            return this.constructor.name;
        }
    }
    getColumns(): ColumnValue[] {
        const columnValues: ColumnValue[] = [];
        Object.entries(this).forEach(([key, value]) => {
            if(typeof value !== 'function' && !this.excludedProperties.includes(key)){
                if(this.columnOverrides.has(key)){
                    columnValues.push({
                        name: this.columnOverrides.get(key)?.columnName ?? "",
                        propertyName: key,
                        value: this.columnOverrides.get(key)?.value
                    });
                }
                else{
                    columnValues.push({name:key, propertyName:key, value});
                }
            }
        })
        return columnValues;
    }
    getPrimaryKey(): string {
        if(this.primaryKey){
            return this.primaryKey;
        }
        else{
            const idColumn = this.findIdColumn();
            if(idColumn.length > 0){
                return idColumn;
            }
            else{
                throw new Error('ID Column not found and no primary key specified');
            }
        }
    }
    private excludedProperties:string[] = ['columns', 'columnOverrides', 'excludedProperties', 'tableNameOverride', 'primaryKey']
    private findIdColumn():string {
        for (let column in Object.keys(this)) {
            if(column.toLowerCase() == 'id'){
                return column
            }
            else if(column.toLowerCase() == `${this.constructor.name}ID`){
                return column
            }
            else if(column.toLowerCase() == `${this.constructor.name}Id`){
                return column
            }
        }
        return "";
    }

}

function columnName(name:string){
    return function(target:any, key:string):void{
        target.prototype.columnOverrides.set(key, {propertyName: key, columnName: name, value: target[key]})
    }
}

function tableName(name:string){
    return function(target:any):void{
        target.prototype.tableNameOverride = name;
    }
}

function primaryKey(target:any, key:string){
    return function(target:any, key:string):void{
        target.prototype.primaryKey = key
    }
}

type ColumnOverride = {
    propertyName: string,
    columnName: string,
    value: unknown
}

type ColumnValue = {
    name:string,
    propertyName:string,
    value:unknown
}