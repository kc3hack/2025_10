import mysql from 'mysql2';
import { env } from '../config/env.js';

class DatabaseUtility {
  private queryFormat: any;

  constructor() {
    this.queryFormat = (query: string, values: Array<string>) => {
      if (!values) return query;
      return query.replace(/\:(\w+)/g, (txt, key) => {
        return values.hasOwnProperty(key) ? mysql.escape(values[key]) : txt;
      });
    };
  }

  private connect(callback: (dbc: mysql.Connection) => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      const dbc = mysql.createConnection({
        host: env.RDB_HOST,
        user: env.RDB_USER,
        password: env.RDB_PASSWORD,
        database: env.RDB_NAME,
      });
      dbc.connect((error) => {
        if (error) {
          reject(error);
        } else {
          dbc.config.queryFormat = this.queryFormat;
          callback(dbc)
            .then((result) => resolve(result))
            .catch((error) => reject(error))
            .finally(() => dbc.end());
        }
      });
    });
  }

  private sendQuery(dbc: mysql.Connection, query: string, option?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      dbc.query(query, option, (error, results) => {
        if (error) {
          reject(new Error(`SQL error: ${query} - ${error.message}`));
        } else {
          resolve(results);
        }
      });
    });
  }

  private async sendQueries(
    dbc: mysql.Connection,
    queries: Array<{ query: string; option?: any }>
  ) {
    for (var i = 0; i < queries.length; i++) {
      await this.sendQuery(dbc, queries[i].query, queries[i].option);
    }
  }

  query(query: string, option?: any): Promise<any> {
    return this.connect((dbc: mysql.Connection) => this.sendQuery(dbc, query, option));
  }

  queries(queries: Array<{ query: string; option?: any }>): Promise<any> {
    return this.connect((dbc: mysql.Connection) => this.sendQueries(dbc, queries));
  }
}

const db = new DatabaseUtility();

export default db;
