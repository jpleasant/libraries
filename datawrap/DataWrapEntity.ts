export class DataWrapEntity {
    constructor() {
        this.columnOverrides = new Map<string, ColumnOverride>();
    }

    private columnOverrides: Map<string,ColumnOverride>;
    private tableNameOverride: string | undefined;
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
                        value: this.columnOverrides.get(key)?.value
                    });
                }
                else{
                    columnValues.push({name:key, value});
                }
            }
        })
        return columnValues;
    }

    private excludedProperties:string[] = ['columns', 'columnOverrides', 'excludedProperties', 'tableNameOverride']

}

type ColumnOverride = {
    propertyName: string,
    columnName: string,
    value: unknown
}

type ColumnValue = {
    name:string,
    value:unknown
}