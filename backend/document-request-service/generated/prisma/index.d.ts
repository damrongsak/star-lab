/**
 * Client
 **/

import * as runtime from "./runtime/library.js";
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model companies
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type companies = $Result.DefaultSelection<Prisma.$companiesPayload>;
/**
 * Model document_request
 *
 */
export type document_request =
  $Result.DefaultSelection<Prisma.$document_requestPayload>;
/**
 * Model knex_migrations
 *
 */
export type knex_migrations =
  $Result.DefaultSelection<Prisma.$knex_migrationsPayload>;
/**
 * Model knex_migrations_lock
 *
 */
export type knex_migrations_lock =
  $Result.DefaultSelection<Prisma.$knex_migrations_lockPayload>;
/**
 * Model receipt_addresses
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type receipt_addresses =
  $Result.DefaultSelection<Prisma.$receipt_addressesPayload>;
/**
 * Model sample_list
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type sample_list = $Result.DefaultSelection<Prisma.$sample_listPayload>;
/**
 * Model users
 *
 */
export type users = $Result.DefaultSelection<Prisma.$usersPayload>;
/**
 * Model worker_profiles
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type worker_profiles =
  $Result.DefaultSelection<Prisma.$worker_profilesPayload>;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Companies
 * const companies = await prisma.companies.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = "log" extends keyof ClientOptions
    ? ClientOptions["log"] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions["log"]>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>["other"] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Companies
   * const companies = await prisma.companies.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>,
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends "query" ? Prisma.QueryEvent : Prisma.LogEvent,
    ) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    "extends",
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.companies`: Exposes CRUD operations for the **companies** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Companies
   * const companies = await prisma.companies.findMany()
   * ```
   */
  get companies(): Prisma.companiesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document_request`: Exposes CRUD operations for the **document_request** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Document_requests
   * const document_requests = await prisma.document_request.findMany()
   * ```
   */
  get document_request(): Prisma.document_requestDelegate<
    ExtArgs,
    ClientOptions
  >;

  /**
   * `prisma.knex_migrations`: Exposes CRUD operations for the **knex_migrations** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Knex_migrations
   * const knex_migrations = await prisma.knex_migrations.findMany()
   * ```
   */
  get knex_migrations(): Prisma.knex_migrationsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.knex_migrations_lock`: Exposes CRUD operations for the **knex_migrations_lock** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Knex_migrations_locks
   * const knex_migrations_locks = await prisma.knex_migrations_lock.findMany()
   * ```
   */
  get knex_migrations_lock(): Prisma.knex_migrations_lockDelegate<
    ExtArgs,
    ClientOptions
  >;

  /**
   * `prisma.receipt_addresses`: Exposes CRUD operations for the **receipt_addresses** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Receipt_addresses
   * const receipt_addresses = await prisma.receipt_addresses.findMany()
   * ```
   */
  get receipt_addresses(): Prisma.receipt_addressesDelegate<
    ExtArgs,
    ClientOptions
  >;

  /**
   * `prisma.sample_list`: Exposes CRUD operations for the **sample_list** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Sample_lists
   * const sample_lists = await prisma.sample_list.findMany()
   * ```
   */
  get sample_list(): Prisma.sample_listDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **users** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.users.findMany()
   * ```
   */
  get users(): Prisma.usersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.worker_profiles`: Exposes CRUD operations for the **worker_profiles** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Worker_profiles
   * const worker_profiles = await prisma.worker_profiles.findMany()
   * ```
   */
  get worker_profiles(): Prisma.worker_profilesDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? "Please either choose `select` or `include`."
    : T extends SelectAndOmit
      ? "Please either choose `select` or `omit`."
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, "_avg" | "_sum" | "_count" | "_min" | "_max">,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<"OR", K>, Extends<"AND", K>>,
      Extends<"NOT", K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    companies: "companies";
    document_request: "document_request";
    knex_migrations: "knex_migrations";
    knex_migrations_lock: "knex_migrations_lock";
    receipt_addresses: "receipt_addresses";
    sample_list: "sample_list";
    users: "users";
    worker_profiles: "worker_profiles";
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<
      { extArgs: $Extensions.InternalArgs },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this["params"]["extArgs"],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | "companies"
        | "document_request"
        | "knex_migrations"
        | "knex_migrations_lock"
        | "receipt_addresses"
        | "sample_list"
        | "users"
        | "worker_profiles";
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      companies: {
        payload: Prisma.$companiesPayload<ExtArgs>;
        fields: Prisma.companiesFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.companiesFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.companiesFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>;
          };
          findFirst: {
            args: Prisma.companiesFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.companiesFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>;
          };
          findMany: {
            args: Prisma.companiesFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>[];
          };
          create: {
            args: Prisma.companiesCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>;
          };
          createMany: {
            args: Prisma.companiesCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.companiesCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>[];
          };
          delete: {
            args: Prisma.companiesDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>;
          };
          update: {
            args: Prisma.companiesUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>;
          };
          deleteMany: {
            args: Prisma.companiesDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.companiesUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.companiesUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>[];
          };
          upsert: {
            args: Prisma.companiesUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$companiesPayload>;
          };
          aggregate: {
            args: Prisma.CompaniesAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCompanies>;
          };
          groupBy: {
            args: Prisma.companiesGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CompaniesGroupByOutputType>[];
          };
          count: {
            args: Prisma.companiesCountArgs<ExtArgs>;
            result: $Utils.Optional<CompaniesCountAggregateOutputType> | number;
          };
        };
      };
      document_request: {
        payload: Prisma.$document_requestPayload<ExtArgs>;
        fields: Prisma.document_requestFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.document_requestFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.document_requestFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>;
          };
          findFirst: {
            args: Prisma.document_requestFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.document_requestFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>;
          };
          findMany: {
            args: Prisma.document_requestFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>[];
          };
          create: {
            args: Prisma.document_requestCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>;
          };
          createMany: {
            args: Prisma.document_requestCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.document_requestCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>[];
          };
          delete: {
            args: Prisma.document_requestDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>;
          };
          update: {
            args: Prisma.document_requestUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>;
          };
          deleteMany: {
            args: Prisma.document_requestDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.document_requestUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.document_requestUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>[];
          };
          upsert: {
            args: Prisma.document_requestUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$document_requestPayload>;
          };
          aggregate: {
            args: Prisma.Document_requestAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateDocument_request>;
          };
          groupBy: {
            args: Prisma.document_requestGroupByArgs<ExtArgs>;
            result: $Utils.Optional<Document_requestGroupByOutputType>[];
          };
          count: {
            args: Prisma.document_requestCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<Document_requestCountAggregateOutputType>
              | number;
          };
        };
      };
      knex_migrations: {
        payload: Prisma.$knex_migrationsPayload<ExtArgs>;
        fields: Prisma.knex_migrationsFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.knex_migrationsFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.knex_migrationsFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>;
          };
          findFirst: {
            args: Prisma.knex_migrationsFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.knex_migrationsFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>;
          };
          findMany: {
            args: Prisma.knex_migrationsFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>[];
          };
          create: {
            args: Prisma.knex_migrationsCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>;
          };
          createMany: {
            args: Prisma.knex_migrationsCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.knex_migrationsCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>[];
          };
          delete: {
            args: Prisma.knex_migrationsDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>;
          };
          update: {
            args: Prisma.knex_migrationsUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>;
          };
          deleteMany: {
            args: Prisma.knex_migrationsDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.knex_migrationsUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.knex_migrationsUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>[];
          };
          upsert: {
            args: Prisma.knex_migrationsUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrationsPayload>;
          };
          aggregate: {
            args: Prisma.Knex_migrationsAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateKnex_migrations>;
          };
          groupBy: {
            args: Prisma.knex_migrationsGroupByArgs<ExtArgs>;
            result: $Utils.Optional<Knex_migrationsGroupByOutputType>[];
          };
          count: {
            args: Prisma.knex_migrationsCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<Knex_migrationsCountAggregateOutputType>
              | number;
          };
        };
      };
      knex_migrations_lock: {
        payload: Prisma.$knex_migrations_lockPayload<ExtArgs>;
        fields: Prisma.knex_migrations_lockFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.knex_migrations_lockFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.knex_migrations_lockFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>;
          };
          findFirst: {
            args: Prisma.knex_migrations_lockFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.knex_migrations_lockFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>;
          };
          findMany: {
            args: Prisma.knex_migrations_lockFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>[];
          };
          create: {
            args: Prisma.knex_migrations_lockCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>;
          };
          createMany: {
            args: Prisma.knex_migrations_lockCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.knex_migrations_lockCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>[];
          };
          delete: {
            args: Prisma.knex_migrations_lockDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>;
          };
          update: {
            args: Prisma.knex_migrations_lockUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>;
          };
          deleteMany: {
            args: Prisma.knex_migrations_lockDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.knex_migrations_lockUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.knex_migrations_lockUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>[];
          };
          upsert: {
            args: Prisma.knex_migrations_lockUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$knex_migrations_lockPayload>;
          };
          aggregate: {
            args: Prisma.Knex_migrations_lockAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateKnex_migrations_lock>;
          };
          groupBy: {
            args: Prisma.knex_migrations_lockGroupByArgs<ExtArgs>;
            result: $Utils.Optional<Knex_migrations_lockGroupByOutputType>[];
          };
          count: {
            args: Prisma.knex_migrations_lockCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<Knex_migrations_lockCountAggregateOutputType>
              | number;
          };
        };
      };
      receipt_addresses: {
        payload: Prisma.$receipt_addressesPayload<ExtArgs>;
        fields: Prisma.receipt_addressesFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.receipt_addressesFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.receipt_addressesFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>;
          };
          findFirst: {
            args: Prisma.receipt_addressesFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.receipt_addressesFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>;
          };
          findMany: {
            args: Prisma.receipt_addressesFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>[];
          };
          create: {
            args: Prisma.receipt_addressesCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>;
          };
          createMany: {
            args: Prisma.receipt_addressesCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.receipt_addressesCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>[];
          };
          delete: {
            args: Prisma.receipt_addressesDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>;
          };
          update: {
            args: Prisma.receipt_addressesUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>;
          };
          deleteMany: {
            args: Prisma.receipt_addressesDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.receipt_addressesUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.receipt_addressesUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>[];
          };
          upsert: {
            args: Prisma.receipt_addressesUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$receipt_addressesPayload>;
          };
          aggregate: {
            args: Prisma.Receipt_addressesAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateReceipt_addresses>;
          };
          groupBy: {
            args: Prisma.receipt_addressesGroupByArgs<ExtArgs>;
            result: $Utils.Optional<Receipt_addressesGroupByOutputType>[];
          };
          count: {
            args: Prisma.receipt_addressesCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<Receipt_addressesCountAggregateOutputType>
              | number;
          };
        };
      };
      sample_list: {
        payload: Prisma.$sample_listPayload<ExtArgs>;
        fields: Prisma.sample_listFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.sample_listFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.sample_listFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>;
          };
          findFirst: {
            args: Prisma.sample_listFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.sample_listFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>;
          };
          findMany: {
            args: Prisma.sample_listFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>[];
          };
          create: {
            args: Prisma.sample_listCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>;
          };
          createMany: {
            args: Prisma.sample_listCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.sample_listCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>[];
          };
          delete: {
            args: Prisma.sample_listDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>;
          };
          update: {
            args: Prisma.sample_listUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>;
          };
          deleteMany: {
            args: Prisma.sample_listDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.sample_listUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.sample_listUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>[];
          };
          upsert: {
            args: Prisma.sample_listUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$sample_listPayload>;
          };
          aggregate: {
            args: Prisma.Sample_listAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateSample_list>;
          };
          groupBy: {
            args: Prisma.sample_listGroupByArgs<ExtArgs>;
            result: $Utils.Optional<Sample_listGroupByOutputType>[];
          };
          count: {
            args: Prisma.sample_listCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<Sample_listCountAggregateOutputType>
              | number;
          };
        };
      };
      users: {
        payload: Prisma.$usersPayload<ExtArgs>;
        fields: Prisma.usersFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.usersFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.usersFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>;
          };
          findFirst: {
            args: Prisma.usersFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.usersFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>;
          };
          findMany: {
            args: Prisma.usersFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[];
          };
          create: {
            args: Prisma.usersCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>;
          };
          createMany: {
            args: Prisma.usersCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.usersCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[];
          };
          delete: {
            args: Prisma.usersDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>;
          };
          update: {
            args: Prisma.usersUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>;
          };
          deleteMany: {
            args: Prisma.usersDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.usersUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.usersUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>[];
          };
          upsert: {
            args: Prisma.usersUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$usersPayload>;
          };
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUsers>;
          };
          groupBy: {
            args: Prisma.usersGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UsersGroupByOutputType>[];
          };
          count: {
            args: Prisma.usersCountArgs<ExtArgs>;
            result: $Utils.Optional<UsersCountAggregateOutputType> | number;
          };
        };
      };
      worker_profiles: {
        payload: Prisma.$worker_profilesPayload<ExtArgs>;
        fields: Prisma.worker_profilesFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.worker_profilesFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.worker_profilesFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>;
          };
          findFirst: {
            args: Prisma.worker_profilesFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.worker_profilesFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>;
          };
          findMany: {
            args: Prisma.worker_profilesFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>[];
          };
          create: {
            args: Prisma.worker_profilesCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>;
          };
          createMany: {
            args: Prisma.worker_profilesCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.worker_profilesCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>[];
          };
          delete: {
            args: Prisma.worker_profilesDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>;
          };
          update: {
            args: Prisma.worker_profilesUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>;
          };
          deleteMany: {
            args: Prisma.worker_profilesDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.worker_profilesUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.worker_profilesUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>[];
          };
          upsert: {
            args: Prisma.worker_profilesUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$worker_profilesPayload>;
          };
          aggregate: {
            args: Prisma.Worker_profilesAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateWorker_profiles>;
          };
          groupBy: {
            args: Prisma.worker_profilesGroupByArgs<ExtArgs>;
            result: $Utils.Optional<Worker_profilesGroupByOutputType>[];
          };
          count: {
            args: Prisma.worker_profilesCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<Worker_profilesCountAggregateOutputType>
              | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    "define",
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = "pretty" | "colorless" | "minimal";
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
  }
  export type GlobalOmitConfig = {
    companies?: companiesOmit;
    document_request?: document_requestOmit;
    knex_migrations?: knex_migrationsOmit;
    knex_migrations_lock?: knex_migrations_lockOmit;
    receipt_addresses?: receipt_addressesOmit;
    sample_list?: sample_listOmit;
    users?: usersOmit;
    worker_profiles?: worker_profilesOmit;
  };

  /* Types for Logging */
  export type LogLevel = "info" | "query" | "warn" | "error";
  export type LogDefinition = {
    level: LogLevel;
    emit: "stdout" | "event";
  };

  export type GetLogType<T extends LogLevel | LogDefinition> =
    T extends LogDefinition
      ? T["emit"] extends "event"
        ? T["level"]
        : never
      : never;
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ?
          | GetLogType<T[0]>
          | GetLogType<T[1]>
          | GetLogType<T[2]>
          | GetLogType<T[3]>
      : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | "findUnique"
    | "findUniqueOrThrow"
    | "findMany"
    | "findFirst"
    | "findFirstOrThrow"
    | "create"
    | "createMany"
    | "createManyAndReturn"
    | "update"
    | "updateMany"
    | "updateManyAndReturn"
    | "upsert"
    | "delete"
    | "deleteMany"
    | "executeRaw"
    | "queryRaw"
    | "aggregate"
    | "count"
    | "runCommandRaw"
    | "findRaw"
    | "groupBy";

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>,
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type Document_requestCountOutputType
   */

  export type Document_requestCountOutputType = {
    sample_list: number;
  };

  export type Document_requestCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sample_list?: boolean | Document_requestCountOutputTypeCountSample_listArgs;
  };

  // Custom InputTypes
  /**
   * Document_requestCountOutputType without action
   */
  export type Document_requestCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Document_requestCountOutputType
     */
    select?: Document_requestCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * Document_requestCountOutputType without action
   */
  export type Document_requestCountOutputTypeCountSample_listArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: sample_listWhereInput;
  };

  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    worker_profiles: number;
  };

  export type UsersCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    worker_profiles?: boolean | UsersCountOutputTypeCountWorker_profilesArgs;
  };

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountWorker_profilesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: worker_profilesWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model companies
   */

  export type AggregateCompanies = {
    _count: CompaniesCountAggregateOutputType | null;
    _avg: CompaniesAvgAggregateOutputType | null;
    _sum: CompaniesSumAggregateOutputType | null;
    _min: CompaniesMinAggregateOutputType | null;
    _max: CompaniesMaxAggregateOutputType | null;
  };

  export type CompaniesAvgAggregateOutputType = {
    id: number | null;
  };

  export type CompaniesSumAggregateOutputType = {
    id: number | null;
  };

  export type CompaniesMinAggregateOutputType = {
    id: number | null;
    company_name_en: string | null;
    company_name_th: string | null;
    tax_id: string | null;
    address: string | null;
    sub_district: string | null;
    district: string | null;
    province: string | null;
    postal_code: string | null;
    telephone: string | null;
    fax_number: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type CompaniesMaxAggregateOutputType = {
    id: number | null;
    company_name_en: string | null;
    company_name_th: string | null;
    tax_id: string | null;
    address: string | null;
    sub_district: string | null;
    district: string | null;
    province: string | null;
    postal_code: string | null;
    telephone: string | null;
    fax_number: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type CompaniesCountAggregateOutputType = {
    id: number;
    company_name_en: number;
    company_name_th: number;
    tax_id: number;
    address: number;
    sub_district: number;
    district: number;
    province: number;
    postal_code: number;
    telephone: number;
    fax_number: number;
    created_at: number;
    updated_at: number;
    _all: number;
  };

  export type CompaniesAvgAggregateInputType = {
    id?: true;
  };

  export type CompaniesSumAggregateInputType = {
    id?: true;
  };

  export type CompaniesMinAggregateInputType = {
    id?: true;
    company_name_en?: true;
    company_name_th?: true;
    tax_id?: true;
    address?: true;
    sub_district?: true;
    district?: true;
    province?: true;
    postal_code?: true;
    telephone?: true;
    fax_number?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type CompaniesMaxAggregateInputType = {
    id?: true;
    company_name_en?: true;
    company_name_th?: true;
    tax_id?: true;
    address?: true;
    sub_district?: true;
    district?: true;
    province?: true;
    postal_code?: true;
    telephone?: true;
    fax_number?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type CompaniesCountAggregateInputType = {
    id?: true;
    company_name_en?: true;
    company_name_th?: true;
    tax_id?: true;
    address?: true;
    sub_district?: true;
    district?: true;
    province?: true;
    postal_code?: true;
    telephone?: true;
    fax_number?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
  };

  export type CompaniesAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which companies to aggregate.
     */
    where?: companiesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of companies to fetch.
     */
    orderBy?:
      | companiesOrderByWithRelationInput
      | companiesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: companiesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` companies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` companies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned companies
     **/
    _count?: true | CompaniesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: CompaniesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: CompaniesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CompaniesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CompaniesMaxAggregateInputType;
  };

  export type GetCompaniesAggregateType<T extends CompaniesAggregateArgs> = {
    [P in keyof T & keyof AggregateCompanies]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompanies[P]>
      : GetScalarType<T[P], AggregateCompanies[P]>;
  };

  export type companiesGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: companiesWhereInput;
    orderBy?:
      | companiesOrderByWithAggregationInput
      | companiesOrderByWithAggregationInput[];
    by: CompaniesScalarFieldEnum[] | CompaniesScalarFieldEnum;
    having?: companiesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CompaniesCountAggregateInputType | true;
    _avg?: CompaniesAvgAggregateInputType;
    _sum?: CompaniesSumAggregateInputType;
    _min?: CompaniesMinAggregateInputType;
    _max?: CompaniesMaxAggregateInputType;
  };

  export type CompaniesGroupByOutputType = {
    id: number;
    company_name_en: string;
    company_name_th: string;
    tax_id: string | null;
    address: string;
    sub_district: string;
    district: string;
    province: string;
    postal_code: string;
    telephone: string | null;
    fax_number: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    _count: CompaniesCountAggregateOutputType | null;
    _avg: CompaniesAvgAggregateOutputType | null;
    _sum: CompaniesSumAggregateOutputType | null;
    _min: CompaniesMinAggregateOutputType | null;
    _max: CompaniesMaxAggregateOutputType | null;
  };

  type GetCompaniesGroupByPayload<T extends companiesGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CompaniesGroupByOutputType, T["by"]> & {
          [P in keyof T & keyof CompaniesGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompaniesGroupByOutputType[P]>
            : GetScalarType<T[P], CompaniesGroupByOutputType[P]>;
        }
      >
    >;

  export type companiesSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      company_name_en?: boolean;
      company_name_th?: boolean;
      tax_id?: boolean;
      address?: boolean;
      sub_district?: boolean;
      district?: boolean;
      province?: boolean;
      postal_code?: boolean;
      telephone?: boolean;
      fax_number?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["companies"]
  >;

  export type companiesSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      company_name_en?: boolean;
      company_name_th?: boolean;
      tax_id?: boolean;
      address?: boolean;
      sub_district?: boolean;
      district?: boolean;
      province?: boolean;
      postal_code?: boolean;
      telephone?: boolean;
      fax_number?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["companies"]
  >;

  export type companiesSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      company_name_en?: boolean;
      company_name_th?: boolean;
      tax_id?: boolean;
      address?: boolean;
      sub_district?: boolean;
      district?: boolean;
      province?: boolean;
      postal_code?: boolean;
      telephone?: boolean;
      fax_number?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["companies"]
  >;

  export type companiesSelectScalar = {
    id?: boolean;
    company_name_en?: boolean;
    company_name_th?: boolean;
    tax_id?: boolean;
    address?: boolean;
    sub_district?: boolean;
    district?: boolean;
    province?: boolean;
    postal_code?: boolean;
    telephone?: boolean;
    fax_number?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
  };

  export type companiesOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | "id"
    | "company_name_en"
    | "company_name_th"
    | "tax_id"
    | "address"
    | "sub_district"
    | "district"
    | "province"
    | "postal_code"
    | "telephone"
    | "fax_number"
    | "created_at"
    | "updated_at",
    ExtArgs["result"]["companies"]
  >;

  export type $companiesPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "companies";
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        company_name_en: string;
        company_name_th: string;
        tax_id: string | null;
        address: string;
        sub_district: string;
        district: string;
        province: string;
        postal_code: string;
        telephone: string | null;
        fax_number: string | null;
        created_at: Date | null;
        updated_at: Date | null;
      },
      ExtArgs["result"]["companies"]
    >;
    composites: {};
  };

  type companiesGetPayload<
    S extends boolean | null | undefined | companiesDefaultArgs,
  > = $Result.GetResult<Prisma.$companiesPayload, S>;

  type companiesCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    companiesFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: CompaniesCountAggregateInputType | true;
  };

  export interface companiesDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["companies"];
      meta: { name: "companies" };
    };
    /**
     * Find zero or one Companies that matches the filter.
     * @param {companiesFindUniqueArgs} args - Arguments to find a Companies
     * @example
     * // Get one Companies
     * const companies = await prisma.companies.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends companiesFindUniqueArgs>(
      args: SelectSubset<T, companiesFindUniqueArgs<ExtArgs>>,
    ): Prisma__companiesClient<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Companies that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {companiesFindUniqueOrThrowArgs} args - Arguments to find a Companies
     * @example
     * // Get one Companies
     * const companies = await prisma.companies.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends companiesFindUniqueOrThrowArgs>(
      args: SelectSubset<T, companiesFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__companiesClient<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {companiesFindFirstArgs} args - Arguments to find a Companies
     * @example
     * // Get one Companies
     * const companies = await prisma.companies.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends companiesFindFirstArgs>(
      args?: SelectSubset<T, companiesFindFirstArgs<ExtArgs>>,
    ): Prisma__companiesClient<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Companies that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {companiesFindFirstOrThrowArgs} args - Arguments to find a Companies
     * @example
     * // Get one Companies
     * const companies = await prisma.companies.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends companiesFindFirstOrThrowArgs>(
      args?: SelectSubset<T, companiesFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__companiesClient<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {companiesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.companies.findMany()
     *
     * // Get first 10 Companies
     * const companies = await prisma.companies.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const companiesWithIdOnly = await prisma.companies.findMany({ select: { id: true } })
     *
     */
    findMany<T extends companiesFindManyArgs>(
      args?: SelectSubset<T, companiesFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Companies.
     * @param {companiesCreateArgs} args - Arguments to create a Companies.
     * @example
     * // Create one Companies
     * const Companies = await prisma.companies.create({
     *   data: {
     *     // ... data to create a Companies
     *   }
     * })
     *
     */
    create<T extends companiesCreateArgs>(
      args: SelectSubset<T, companiesCreateArgs<ExtArgs>>,
    ): Prisma__companiesClient<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Companies.
     * @param {companiesCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const companies = await prisma.companies.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends companiesCreateManyArgs>(
      args?: SelectSubset<T, companiesCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {companiesCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const companies = await prisma.companies.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Companies and only return the `id`
     * const companiesWithIdOnly = await prisma.companies.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends companiesCreateManyAndReturnArgs>(
      args?: SelectSubset<T, companiesCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Companies.
     * @param {companiesDeleteArgs} args - Arguments to delete one Companies.
     * @example
     * // Delete one Companies
     * const Companies = await prisma.companies.delete({
     *   where: {
     *     // ... filter to delete one Companies
     *   }
     * })
     *
     */
    delete<T extends companiesDeleteArgs>(
      args: SelectSubset<T, companiesDeleteArgs<ExtArgs>>,
    ): Prisma__companiesClient<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Companies.
     * @param {companiesUpdateArgs} args - Arguments to update one Companies.
     * @example
     * // Update one Companies
     * const companies = await prisma.companies.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends companiesUpdateArgs>(
      args: SelectSubset<T, companiesUpdateArgs<ExtArgs>>,
    ): Prisma__companiesClient<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Companies.
     * @param {companiesDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.companies.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends companiesDeleteManyArgs>(
      args?: SelectSubset<T, companiesDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {companiesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const companies = await prisma.companies.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends companiesUpdateManyArgs>(
      args: SelectSubset<T, companiesUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Companies and returns the data updated in the database.
     * @param {companiesUpdateManyAndReturnArgs} args - Arguments to update many Companies.
     * @example
     * // Update many Companies
     * const companies = await prisma.companies.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Companies and only return the `id`
     * const companiesWithIdOnly = await prisma.companies.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends companiesUpdateManyAndReturnArgs>(
      args: SelectSubset<T, companiesUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Companies.
     * @param {companiesUpsertArgs} args - Arguments to update or create a Companies.
     * @example
     * // Update or create a Companies
     * const companies = await prisma.companies.upsert({
     *   create: {
     *     // ... data to create a Companies
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Companies we want to update
     *   }
     * })
     */
    upsert<T extends companiesUpsertArgs>(
      args: SelectSubset<T, companiesUpsertArgs<ExtArgs>>,
    ): Prisma__companiesClient<
      $Result.GetResult<
        Prisma.$companiesPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {companiesCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.companies.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
     **/
    count<T extends companiesCountArgs>(
      args?: Subset<T, companiesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], CompaniesCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompaniesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CompaniesAggregateArgs>(
      args: Subset<T, CompaniesAggregateArgs>,
    ): Prisma.PrismaPromise<GetCompaniesAggregateType<T>>;

    /**
     * Group by Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {companiesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends companiesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: companiesGroupByArgs["orderBy"] }
        : { orderBy?: companiesGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      "Field ",
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, companiesGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetCompaniesGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the companies model
     */
    readonly fields: companiesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for companies.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__companiesClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the companies model
   */
  interface companiesFieldRefs {
    readonly id: FieldRef<"companies", "Int">;
    readonly company_name_en: FieldRef<"companies", "String">;
    readonly company_name_th: FieldRef<"companies", "String">;
    readonly tax_id: FieldRef<"companies", "String">;
    readonly address: FieldRef<"companies", "String">;
    readonly sub_district: FieldRef<"companies", "String">;
    readonly district: FieldRef<"companies", "String">;
    readonly province: FieldRef<"companies", "String">;
    readonly postal_code: FieldRef<"companies", "String">;
    readonly telephone: FieldRef<"companies", "String">;
    readonly fax_number: FieldRef<"companies", "String">;
    readonly created_at: FieldRef<"companies", "DateTime">;
    readonly updated_at: FieldRef<"companies", "DateTime">;
  }

  // Custom InputTypes
  /**
   * companies findUnique
   */
  export type companiesFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * Filter, which companies to fetch.
     */
    where: companiesWhereUniqueInput;
  };

  /**
   * companies findUniqueOrThrow
   */
  export type companiesFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * Filter, which companies to fetch.
     */
    where: companiesWhereUniqueInput;
  };

  /**
   * companies findFirst
   */
  export type companiesFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * Filter, which companies to fetch.
     */
    where?: companiesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of companies to fetch.
     */
    orderBy?:
      | companiesOrderByWithRelationInput
      | companiesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for companies.
     */
    cursor?: companiesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` companies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` companies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of companies.
     */
    distinct?: CompaniesScalarFieldEnum | CompaniesScalarFieldEnum[];
  };

  /**
   * companies findFirstOrThrow
   */
  export type companiesFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * Filter, which companies to fetch.
     */
    where?: companiesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of companies to fetch.
     */
    orderBy?:
      | companiesOrderByWithRelationInput
      | companiesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for companies.
     */
    cursor?: companiesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` companies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` companies.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of companies.
     */
    distinct?: CompaniesScalarFieldEnum | CompaniesScalarFieldEnum[];
  };

  /**
   * companies findMany
   */
  export type companiesFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * Filter, which companies to fetch.
     */
    where?: companiesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of companies to fetch.
     */
    orderBy?:
      | companiesOrderByWithRelationInput
      | companiesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing companies.
     */
    cursor?: companiesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` companies from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` companies.
     */
    skip?: number;
    distinct?: CompaniesScalarFieldEnum | CompaniesScalarFieldEnum[];
  };

  /**
   * companies create
   */
  export type companiesCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * The data needed to create a companies.
     */
    data: XOR<companiesCreateInput, companiesUncheckedCreateInput>;
  };

  /**
   * companies createMany
   */
  export type companiesCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many companies.
     */
    data: companiesCreateManyInput | companiesCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * companies createManyAndReturn
   */
  export type companiesCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * The data used to create many companies.
     */
    data: companiesCreateManyInput | companiesCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * companies update
   */
  export type companiesUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * The data needed to update a companies.
     */
    data: XOR<companiesUpdateInput, companiesUncheckedUpdateInput>;
    /**
     * Choose, which companies to update.
     */
    where: companiesWhereUniqueInput;
  };

  /**
   * companies updateMany
   */
  export type companiesUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update companies.
     */
    data: XOR<
      companiesUpdateManyMutationInput,
      companiesUncheckedUpdateManyInput
    >;
    /**
     * Filter which companies to update
     */
    where?: companiesWhereInput;
    /**
     * Limit how many companies to update.
     */
    limit?: number;
  };

  /**
   * companies updateManyAndReturn
   */
  export type companiesUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * The data used to update companies.
     */
    data: XOR<
      companiesUpdateManyMutationInput,
      companiesUncheckedUpdateManyInput
    >;
    /**
     * Filter which companies to update
     */
    where?: companiesWhereInput;
    /**
     * Limit how many companies to update.
     */
    limit?: number;
  };

  /**
   * companies upsert
   */
  export type companiesUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * The filter to search for the companies to update in case it exists.
     */
    where: companiesWhereUniqueInput;
    /**
     * In case the companies found by the `where` argument doesn't exist, create a new companies with this data.
     */
    create: XOR<companiesCreateInput, companiesUncheckedCreateInput>;
    /**
     * In case the companies was found with the provided `where` argument, update it with this data.
     */
    update: XOR<companiesUpdateInput, companiesUncheckedUpdateInput>;
  };

  /**
   * companies delete
   */
  export type companiesDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
    /**
     * Filter which companies to delete.
     */
    where: companiesWhereUniqueInput;
  };

  /**
   * companies deleteMany
   */
  export type companiesDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which companies to delete
     */
    where?: companiesWhereInput;
    /**
     * Limit how many companies to delete.
     */
    limit?: number;
  };

  /**
   * companies without action
   */
  export type companiesDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the companies
     */
    select?: companiesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the companies
     */
    omit?: companiesOmit<ExtArgs> | null;
  };

  /**
   * Model document_request
   */

  export type AggregateDocument_request = {
    _count: Document_requestCountAggregateOutputType | null;
    _avg: Document_requestAvgAggregateOutputType | null;
    _sum: Document_requestSumAggregateOutputType | null;
    _min: Document_requestMinAggregateOutputType | null;
    _max: Document_requestMaxAggregateOutputType | null;
  };

  export type Document_requestAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    company_id: number | null;
  };

  export type Document_requestSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
    company_id: number | null;
  };

  export type Document_requestMinAggregateOutputType = {
    id: number | null;
    request_no: string | null;
    request_date: Date | null;
    user_id: number | null;
    company_id: number | null;
    document_type: string | null;
    description: string | null;
    status: string | null;
    paid_status: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type Document_requestMaxAggregateOutputType = {
    id: number | null;
    request_no: string | null;
    request_date: Date | null;
    user_id: number | null;
    company_id: number | null;
    document_type: string | null;
    description: string | null;
    status: string | null;
    paid_status: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type Document_requestCountAggregateOutputType = {
    id: number;
    request_no: number;
    request_date: number;
    user_id: number;
    company_id: number;
    document_type: number;
    description: number;
    status: number;
    paid_status: number;
    created_at: number;
    updated_at: number;
    _all: number;
  };

  export type Document_requestAvgAggregateInputType = {
    id?: true;
    user_id?: true;
    company_id?: true;
  };

  export type Document_requestSumAggregateInputType = {
    id?: true;
    user_id?: true;
    company_id?: true;
  };

  export type Document_requestMinAggregateInputType = {
    id?: true;
    request_no?: true;
    request_date?: true;
    user_id?: true;
    company_id?: true;
    document_type?: true;
    description?: true;
    status?: true;
    paid_status?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type Document_requestMaxAggregateInputType = {
    id?: true;
    request_no?: true;
    request_date?: true;
    user_id?: true;
    company_id?: true;
    document_type?: true;
    description?: true;
    status?: true;
    paid_status?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type Document_requestCountAggregateInputType = {
    id?: true;
    request_no?: true;
    request_date?: true;
    user_id?: true;
    company_id?: true;
    document_type?: true;
    description?: true;
    status?: true;
    paid_status?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
  };

  export type Document_requestAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which document_request to aggregate.
     */
    where?: document_requestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of document_requests to fetch.
     */
    orderBy?:
      | document_requestOrderByWithRelationInput
      | document_requestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: document_requestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` document_requests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` document_requests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned document_requests
     **/
    _count?: true | Document_requestCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: Document_requestAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: Document_requestSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: Document_requestMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: Document_requestMaxAggregateInputType;
  };

  export type GetDocument_requestAggregateType<
    T extends Document_requestAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateDocument_request]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument_request[P]>
      : GetScalarType<T[P], AggregateDocument_request[P]>;
  };

  export type document_requestGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: document_requestWhereInput;
    orderBy?:
      | document_requestOrderByWithAggregationInput
      | document_requestOrderByWithAggregationInput[];
    by: Document_requestScalarFieldEnum[] | Document_requestScalarFieldEnum;
    having?: document_requestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Document_requestCountAggregateInputType | true;
    _avg?: Document_requestAvgAggregateInputType;
    _sum?: Document_requestSumAggregateInputType;
    _min?: Document_requestMinAggregateInputType;
    _max?: Document_requestMaxAggregateInputType;
  };

  export type Document_requestGroupByOutputType = {
    id: number;
    request_no: string;
    request_date: Date | null;
    user_id: number;
    company_id: number;
    document_type: string;
    description: string | null;
    status: string | null;
    paid_status: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    _count: Document_requestCountAggregateOutputType | null;
    _avg: Document_requestAvgAggregateOutputType | null;
    _sum: Document_requestSumAggregateOutputType | null;
    _min: Document_requestMinAggregateOutputType | null;
    _max: Document_requestMaxAggregateOutputType | null;
  };

  type GetDocument_requestGroupByPayload<
    T extends document_requestGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Document_requestGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof Document_requestGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], Document_requestGroupByOutputType[P]>
          : GetScalarType<T[P], Document_requestGroupByOutputType[P]>;
      }
    >
  >;

  export type document_requestSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      request_no?: boolean;
      request_date?: boolean;
      user_id?: boolean;
      company_id?: boolean;
      document_type?: boolean;
      description?: boolean;
      status?: boolean;
      paid_status?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      sample_list?: boolean | document_request$sample_listArgs<ExtArgs>;
      _count?: boolean | Document_requestCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["document_request"]
  >;

  export type document_requestSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      request_no?: boolean;
      request_date?: boolean;
      user_id?: boolean;
      company_id?: boolean;
      document_type?: boolean;
      description?: boolean;
      status?: boolean;
      paid_status?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["document_request"]
  >;

  export type document_requestSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      request_no?: boolean;
      request_date?: boolean;
      user_id?: boolean;
      company_id?: boolean;
      document_type?: boolean;
      description?: boolean;
      status?: boolean;
      paid_status?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["document_request"]
  >;

  export type document_requestSelectScalar = {
    id?: boolean;
    request_no?: boolean;
    request_date?: boolean;
    user_id?: boolean;
    company_id?: boolean;
    document_type?: boolean;
    description?: boolean;
    status?: boolean;
    paid_status?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
  };

  export type document_requestOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | "id"
    | "request_no"
    | "request_date"
    | "user_id"
    | "company_id"
    | "document_type"
    | "description"
    | "status"
    | "paid_status"
    | "created_at"
    | "updated_at",
    ExtArgs["result"]["document_request"]
  >;
  export type document_requestInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    sample_list?: boolean | document_request$sample_listArgs<ExtArgs>;
    _count?: boolean | Document_requestCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type document_requestIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type document_requestIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $document_requestPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "document_request";
    objects: {
      sample_list: Prisma.$sample_listPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        request_no: string;
        request_date: Date | null;
        user_id: number;
        company_id: number;
        document_type: string;
        description: string | null;
        status: string | null;
        paid_status: boolean | null;
        created_at: Date | null;
        updated_at: Date | null;
      },
      ExtArgs["result"]["document_request"]
    >;
    composites: {};
  };

  type document_requestGetPayload<
    S extends boolean | null | undefined | document_requestDefaultArgs,
  > = $Result.GetResult<Prisma.$document_requestPayload, S>;

  type document_requestCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    document_requestFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: Document_requestCountAggregateInputType | true;
  };

  export interface document_requestDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["document_request"];
      meta: { name: "document_request" };
    };
    /**
     * Find zero or one Document_request that matches the filter.
     * @param {document_requestFindUniqueArgs} args - Arguments to find a Document_request
     * @example
     * // Get one Document_request
     * const document_request = await prisma.document_request.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends document_requestFindUniqueArgs>(
      args: SelectSubset<T, document_requestFindUniqueArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Document_request that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {document_requestFindUniqueOrThrowArgs} args - Arguments to find a Document_request
     * @example
     * // Get one Document_request
     * const document_request = await prisma.document_request.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends document_requestFindUniqueOrThrowArgs>(
      args: SelectSubset<T, document_requestFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Document_request that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {document_requestFindFirstArgs} args - Arguments to find a Document_request
     * @example
     * // Get one Document_request
     * const document_request = await prisma.document_request.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends document_requestFindFirstArgs>(
      args?: SelectSubset<T, document_requestFindFirstArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Document_request that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {document_requestFindFirstOrThrowArgs} args - Arguments to find a Document_request
     * @example
     * // Get one Document_request
     * const document_request = await prisma.document_request.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends document_requestFindFirstOrThrowArgs>(
      args?: SelectSubset<T, document_requestFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Document_requests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {document_requestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Document_requests
     * const document_requests = await prisma.document_request.findMany()
     *
     * // Get first 10 Document_requests
     * const document_requests = await prisma.document_request.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const document_requestWithIdOnly = await prisma.document_request.findMany({ select: { id: true } })
     *
     */
    findMany<T extends document_requestFindManyArgs>(
      args?: SelectSubset<T, document_requestFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Document_request.
     * @param {document_requestCreateArgs} args - Arguments to create a Document_request.
     * @example
     * // Create one Document_request
     * const Document_request = await prisma.document_request.create({
     *   data: {
     *     // ... data to create a Document_request
     *   }
     * })
     *
     */
    create<T extends document_requestCreateArgs>(
      args: SelectSubset<T, document_requestCreateArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Document_requests.
     * @param {document_requestCreateManyArgs} args - Arguments to create many Document_requests.
     * @example
     * // Create many Document_requests
     * const document_request = await prisma.document_request.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends document_requestCreateManyArgs>(
      args?: SelectSubset<T, document_requestCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Document_requests and returns the data saved in the database.
     * @param {document_requestCreateManyAndReturnArgs} args - Arguments to create many Document_requests.
     * @example
     * // Create many Document_requests
     * const document_request = await prisma.document_request.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Document_requests and only return the `id`
     * const document_requestWithIdOnly = await prisma.document_request.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends document_requestCreateManyAndReturnArgs>(
      args?: SelectSubset<T, document_requestCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Document_request.
     * @param {document_requestDeleteArgs} args - Arguments to delete one Document_request.
     * @example
     * // Delete one Document_request
     * const Document_request = await prisma.document_request.delete({
     *   where: {
     *     // ... filter to delete one Document_request
     *   }
     * })
     *
     */
    delete<T extends document_requestDeleteArgs>(
      args: SelectSubset<T, document_requestDeleteArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Document_request.
     * @param {document_requestUpdateArgs} args - Arguments to update one Document_request.
     * @example
     * // Update one Document_request
     * const document_request = await prisma.document_request.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends document_requestUpdateArgs>(
      args: SelectSubset<T, document_requestUpdateArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Document_requests.
     * @param {document_requestDeleteManyArgs} args - Arguments to filter Document_requests to delete.
     * @example
     * // Delete a few Document_requests
     * const { count } = await prisma.document_request.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends document_requestDeleteManyArgs>(
      args?: SelectSubset<T, document_requestDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Document_requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {document_requestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Document_requests
     * const document_request = await prisma.document_request.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends document_requestUpdateManyArgs>(
      args: SelectSubset<T, document_requestUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Document_requests and returns the data updated in the database.
     * @param {document_requestUpdateManyAndReturnArgs} args - Arguments to update many Document_requests.
     * @example
     * // Update many Document_requests
     * const document_request = await prisma.document_request.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Document_requests and only return the `id`
     * const document_requestWithIdOnly = await prisma.document_request.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends document_requestUpdateManyAndReturnArgs>(
      args: SelectSubset<T, document_requestUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Document_request.
     * @param {document_requestUpsertArgs} args - Arguments to update or create a Document_request.
     * @example
     * // Update or create a Document_request
     * const document_request = await prisma.document_request.upsert({
     *   create: {
     *     // ... data to create a Document_request
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document_request we want to update
     *   }
     * })
     */
    upsert<T extends document_requestUpsertArgs>(
      args: SelectSubset<T, document_requestUpsertArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      $Result.GetResult<
        Prisma.$document_requestPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Document_requests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {document_requestCountArgs} args - Arguments to filter Document_requests to count.
     * @example
     * // Count the number of Document_requests
     * const count = await prisma.document_request.count({
     *   where: {
     *     // ... the filter for the Document_requests we want to count
     *   }
     * })
     **/
    count<T extends document_requestCountArgs>(
      args?: Subset<T, document_requestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], Document_requestCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Document_request.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Document_requestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends Document_requestAggregateArgs>(
      args: Subset<T, Document_requestAggregateArgs>,
    ): Prisma.PrismaPromise<GetDocument_requestAggregateType<T>>;

    /**
     * Group by Document_request.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {document_requestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends document_requestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: document_requestGroupByArgs["orderBy"] }
        : { orderBy?: document_requestGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      "Field ",
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, document_requestGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetDocument_requestGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the document_request model
     */
    readonly fields: document_requestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for document_request.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__document_requestClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    sample_list<T extends document_request$sample_listArgs<ExtArgs> = {}>(
      args?: Subset<T, document_request$sample_listArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$sample_listPayload<ExtArgs>,
          T,
          "findMany",
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the document_request model
   */
  interface document_requestFieldRefs {
    readonly id: FieldRef<"document_request", "Int">;
    readonly request_no: FieldRef<"document_request", "String">;
    readonly request_date: FieldRef<"document_request", "DateTime">;
    readonly user_id: FieldRef<"document_request", "Int">;
    readonly company_id: FieldRef<"document_request", "Int">;
    readonly document_type: FieldRef<"document_request", "String">;
    readonly description: FieldRef<"document_request", "String">;
    readonly status: FieldRef<"document_request", "String">;
    readonly paid_status: FieldRef<"document_request", "Boolean">;
    readonly created_at: FieldRef<"document_request", "DateTime">;
    readonly updated_at: FieldRef<"document_request", "DateTime">;
  }

  // Custom InputTypes
  /**
   * document_request findUnique
   */
  export type document_requestFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * Filter, which document_request to fetch.
     */
    where: document_requestWhereUniqueInput;
  };

  /**
   * document_request findUniqueOrThrow
   */
  export type document_requestFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * Filter, which document_request to fetch.
     */
    where: document_requestWhereUniqueInput;
  };

  /**
   * document_request findFirst
   */
  export type document_requestFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * Filter, which document_request to fetch.
     */
    where?: document_requestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of document_requests to fetch.
     */
    orderBy?:
      | document_requestOrderByWithRelationInput
      | document_requestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for document_requests.
     */
    cursor?: document_requestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` document_requests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` document_requests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of document_requests.
     */
    distinct?:
      | Document_requestScalarFieldEnum
      | Document_requestScalarFieldEnum[];
  };

  /**
   * document_request findFirstOrThrow
   */
  export type document_requestFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * Filter, which document_request to fetch.
     */
    where?: document_requestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of document_requests to fetch.
     */
    orderBy?:
      | document_requestOrderByWithRelationInput
      | document_requestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for document_requests.
     */
    cursor?: document_requestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` document_requests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` document_requests.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of document_requests.
     */
    distinct?:
      | Document_requestScalarFieldEnum
      | Document_requestScalarFieldEnum[];
  };

  /**
   * document_request findMany
   */
  export type document_requestFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * Filter, which document_requests to fetch.
     */
    where?: document_requestWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of document_requests to fetch.
     */
    orderBy?:
      | document_requestOrderByWithRelationInput
      | document_requestOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing document_requests.
     */
    cursor?: document_requestWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` document_requests from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` document_requests.
     */
    skip?: number;
    distinct?:
      | Document_requestScalarFieldEnum
      | Document_requestScalarFieldEnum[];
  };

  /**
   * document_request create
   */
  export type document_requestCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * The data needed to create a document_request.
     */
    data: XOR<
      document_requestCreateInput,
      document_requestUncheckedCreateInput
    >;
  };

  /**
   * document_request createMany
   */
  export type document_requestCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many document_requests.
     */
    data: document_requestCreateManyInput | document_requestCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * document_request createManyAndReturn
   */
  export type document_requestCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * The data used to create many document_requests.
     */
    data: document_requestCreateManyInput | document_requestCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * document_request update
   */
  export type document_requestUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * The data needed to update a document_request.
     */
    data: XOR<
      document_requestUpdateInput,
      document_requestUncheckedUpdateInput
    >;
    /**
     * Choose, which document_request to update.
     */
    where: document_requestWhereUniqueInput;
  };

  /**
   * document_request updateMany
   */
  export type document_requestUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update document_requests.
     */
    data: XOR<
      document_requestUpdateManyMutationInput,
      document_requestUncheckedUpdateManyInput
    >;
    /**
     * Filter which document_requests to update
     */
    where?: document_requestWhereInput;
    /**
     * Limit how many document_requests to update.
     */
    limit?: number;
  };

  /**
   * document_request updateManyAndReturn
   */
  export type document_requestUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * The data used to update document_requests.
     */
    data: XOR<
      document_requestUpdateManyMutationInput,
      document_requestUncheckedUpdateManyInput
    >;
    /**
     * Filter which document_requests to update
     */
    where?: document_requestWhereInput;
    /**
     * Limit how many document_requests to update.
     */
    limit?: number;
  };

  /**
   * document_request upsert
   */
  export type document_requestUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * The filter to search for the document_request to update in case it exists.
     */
    where: document_requestWhereUniqueInput;
    /**
     * In case the document_request found by the `where` argument doesn't exist, create a new document_request with this data.
     */
    create: XOR<
      document_requestCreateInput,
      document_requestUncheckedCreateInput
    >;
    /**
     * In case the document_request was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      document_requestUpdateInput,
      document_requestUncheckedUpdateInput
    >;
  };

  /**
   * document_request delete
   */
  export type document_requestDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
    /**
     * Filter which document_request to delete.
     */
    where: document_requestWhereUniqueInput;
  };

  /**
   * document_request deleteMany
   */
  export type document_requestDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which document_requests to delete
     */
    where?: document_requestWhereInput;
    /**
     * Limit how many document_requests to delete.
     */
    limit?: number;
  };

  /**
   * document_request.sample_list
   */
  export type document_request$sample_listArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    where?: sample_listWhereInput;
    orderBy?:
      | sample_listOrderByWithRelationInput
      | sample_listOrderByWithRelationInput[];
    cursor?: sample_listWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Sample_listScalarFieldEnum | Sample_listScalarFieldEnum[];
  };

  /**
   * document_request without action
   */
  export type document_requestDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the document_request
     */
    select?: document_requestSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the document_request
     */
    omit?: document_requestOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: document_requestInclude<ExtArgs> | null;
  };

  /**
   * Model knex_migrations
   */

  export type AggregateKnex_migrations = {
    _count: Knex_migrationsCountAggregateOutputType | null;
    _avg: Knex_migrationsAvgAggregateOutputType | null;
    _sum: Knex_migrationsSumAggregateOutputType | null;
    _min: Knex_migrationsMinAggregateOutputType | null;
    _max: Knex_migrationsMaxAggregateOutputType | null;
  };

  export type Knex_migrationsAvgAggregateOutputType = {
    id: number | null;
    batch: number | null;
  };

  export type Knex_migrationsSumAggregateOutputType = {
    id: number | null;
    batch: number | null;
  };

  export type Knex_migrationsMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    batch: number | null;
    migration_time: Date | null;
  };

  export type Knex_migrationsMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    batch: number | null;
    migration_time: Date | null;
  };

  export type Knex_migrationsCountAggregateOutputType = {
    id: number;
    name: number;
    batch: number;
    migration_time: number;
    _all: number;
  };

  export type Knex_migrationsAvgAggregateInputType = {
    id?: true;
    batch?: true;
  };

  export type Knex_migrationsSumAggregateInputType = {
    id?: true;
    batch?: true;
  };

  export type Knex_migrationsMinAggregateInputType = {
    id?: true;
    name?: true;
    batch?: true;
    migration_time?: true;
  };

  export type Knex_migrationsMaxAggregateInputType = {
    id?: true;
    name?: true;
    batch?: true;
    migration_time?: true;
  };

  export type Knex_migrationsCountAggregateInputType = {
    id?: true;
    name?: true;
    batch?: true;
    migration_time?: true;
    _all?: true;
  };

  export type Knex_migrationsAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which knex_migrations to aggregate.
     */
    where?: knex_migrationsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of knex_migrations to fetch.
     */
    orderBy?:
      | knex_migrationsOrderByWithRelationInput
      | knex_migrationsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: knex_migrationsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` knex_migrations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` knex_migrations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned knex_migrations
     **/
    _count?: true | Knex_migrationsCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: Knex_migrationsAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: Knex_migrationsSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: Knex_migrationsMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: Knex_migrationsMaxAggregateInputType;
  };

  export type GetKnex_migrationsAggregateType<
    T extends Knex_migrationsAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateKnex_migrations]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnex_migrations[P]>
      : GetScalarType<T[P], AggregateKnex_migrations[P]>;
  };

  export type knex_migrationsGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: knex_migrationsWhereInput;
    orderBy?:
      | knex_migrationsOrderByWithAggregationInput
      | knex_migrationsOrderByWithAggregationInput[];
    by: Knex_migrationsScalarFieldEnum[] | Knex_migrationsScalarFieldEnum;
    having?: knex_migrationsScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Knex_migrationsCountAggregateInputType | true;
    _avg?: Knex_migrationsAvgAggregateInputType;
    _sum?: Knex_migrationsSumAggregateInputType;
    _min?: Knex_migrationsMinAggregateInputType;
    _max?: Knex_migrationsMaxAggregateInputType;
  };

  export type Knex_migrationsGroupByOutputType = {
    id: number;
    name: string | null;
    batch: number | null;
    migration_time: Date | null;
    _count: Knex_migrationsCountAggregateOutputType | null;
    _avg: Knex_migrationsAvgAggregateOutputType | null;
    _sum: Knex_migrationsSumAggregateOutputType | null;
    _min: Knex_migrationsMinAggregateOutputType | null;
    _max: Knex_migrationsMaxAggregateOutputType | null;
  };

  type GetKnex_migrationsGroupByPayload<T extends knex_migrationsGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<Knex_migrationsGroupByOutputType, T["by"]> & {
          [P in keyof T &
            keyof Knex_migrationsGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Knex_migrationsGroupByOutputType[P]>
            : GetScalarType<T[P], Knex_migrationsGroupByOutputType[P]>;
        }
      >
    >;

  export type knex_migrationsSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      batch?: boolean;
      migration_time?: boolean;
    },
    ExtArgs["result"]["knex_migrations"]
  >;

  export type knex_migrationsSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      batch?: boolean;
      migration_time?: boolean;
    },
    ExtArgs["result"]["knex_migrations"]
  >;

  export type knex_migrationsSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      batch?: boolean;
      migration_time?: boolean;
    },
    ExtArgs["result"]["knex_migrations"]
  >;

  export type knex_migrationsSelectScalar = {
    id?: boolean;
    name?: boolean;
    batch?: boolean;
    migration_time?: boolean;
  };

  export type knex_migrationsOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    "id" | "name" | "batch" | "migration_time",
    ExtArgs["result"]["knex_migrations"]
  >;

  export type $knex_migrationsPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "knex_migrations";
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        name: string | null;
        batch: number | null;
        migration_time: Date | null;
      },
      ExtArgs["result"]["knex_migrations"]
    >;
    composites: {};
  };

  type knex_migrationsGetPayload<
    S extends boolean | null | undefined | knex_migrationsDefaultArgs,
  > = $Result.GetResult<Prisma.$knex_migrationsPayload, S>;

  type knex_migrationsCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    knex_migrationsFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: Knex_migrationsCountAggregateInputType | true;
  };

  export interface knex_migrationsDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["knex_migrations"];
      meta: { name: "knex_migrations" };
    };
    /**
     * Find zero or one Knex_migrations that matches the filter.
     * @param {knex_migrationsFindUniqueArgs} args - Arguments to find a Knex_migrations
     * @example
     * // Get one Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends knex_migrationsFindUniqueArgs>(
      args: SelectSubset<T, knex_migrationsFindUniqueArgs<ExtArgs>>,
    ): Prisma__knex_migrationsClient<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Knex_migrations that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {knex_migrationsFindUniqueOrThrowArgs} args - Arguments to find a Knex_migrations
     * @example
     * // Get one Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends knex_migrationsFindUniqueOrThrowArgs>(
      args: SelectSubset<T, knex_migrationsFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__knex_migrationsClient<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Knex_migrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrationsFindFirstArgs} args - Arguments to find a Knex_migrations
     * @example
     * // Get one Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends knex_migrationsFindFirstArgs>(
      args?: SelectSubset<T, knex_migrationsFindFirstArgs<ExtArgs>>,
    ): Prisma__knex_migrationsClient<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Knex_migrations that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrationsFindFirstOrThrowArgs} args - Arguments to find a Knex_migrations
     * @example
     * // Get one Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends knex_migrationsFindFirstOrThrowArgs>(
      args?: SelectSubset<T, knex_migrationsFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__knex_migrationsClient<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Knex_migrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrationsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.findMany()
     *
     * // Get first 10 Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const knex_migrationsWithIdOnly = await prisma.knex_migrations.findMany({ select: { id: true } })
     *
     */
    findMany<T extends knex_migrationsFindManyArgs>(
      args?: SelectSubset<T, knex_migrationsFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Knex_migrations.
     * @param {knex_migrationsCreateArgs} args - Arguments to create a Knex_migrations.
     * @example
     * // Create one Knex_migrations
     * const Knex_migrations = await prisma.knex_migrations.create({
     *   data: {
     *     // ... data to create a Knex_migrations
     *   }
     * })
     *
     */
    create<T extends knex_migrationsCreateArgs>(
      args: SelectSubset<T, knex_migrationsCreateArgs<ExtArgs>>,
    ): Prisma__knex_migrationsClient<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Knex_migrations.
     * @param {knex_migrationsCreateManyArgs} args - Arguments to create many Knex_migrations.
     * @example
     * // Create many Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends knex_migrationsCreateManyArgs>(
      args?: SelectSubset<T, knex_migrationsCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Knex_migrations and returns the data saved in the database.
     * @param {knex_migrationsCreateManyAndReturnArgs} args - Arguments to create many Knex_migrations.
     * @example
     * // Create many Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Knex_migrations and only return the `id`
     * const knex_migrationsWithIdOnly = await prisma.knex_migrations.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends knex_migrationsCreateManyAndReturnArgs>(
      args?: SelectSubset<T, knex_migrationsCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Knex_migrations.
     * @param {knex_migrationsDeleteArgs} args - Arguments to delete one Knex_migrations.
     * @example
     * // Delete one Knex_migrations
     * const Knex_migrations = await prisma.knex_migrations.delete({
     *   where: {
     *     // ... filter to delete one Knex_migrations
     *   }
     * })
     *
     */
    delete<T extends knex_migrationsDeleteArgs>(
      args: SelectSubset<T, knex_migrationsDeleteArgs<ExtArgs>>,
    ): Prisma__knex_migrationsClient<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Knex_migrations.
     * @param {knex_migrationsUpdateArgs} args - Arguments to update one Knex_migrations.
     * @example
     * // Update one Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends knex_migrationsUpdateArgs>(
      args: SelectSubset<T, knex_migrationsUpdateArgs<ExtArgs>>,
    ): Prisma__knex_migrationsClient<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Knex_migrations.
     * @param {knex_migrationsDeleteManyArgs} args - Arguments to filter Knex_migrations to delete.
     * @example
     * // Delete a few Knex_migrations
     * const { count } = await prisma.knex_migrations.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends knex_migrationsDeleteManyArgs>(
      args?: SelectSubset<T, knex_migrationsDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Knex_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends knex_migrationsUpdateManyArgs>(
      args: SelectSubset<T, knex_migrationsUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Knex_migrations and returns the data updated in the database.
     * @param {knex_migrationsUpdateManyAndReturnArgs} args - Arguments to update many Knex_migrations.
     * @example
     * // Update many Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Knex_migrations and only return the `id`
     * const knex_migrationsWithIdOnly = await prisma.knex_migrations.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends knex_migrationsUpdateManyAndReturnArgs>(
      args: SelectSubset<T, knex_migrationsUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Knex_migrations.
     * @param {knex_migrationsUpsertArgs} args - Arguments to update or create a Knex_migrations.
     * @example
     * // Update or create a Knex_migrations
     * const knex_migrations = await prisma.knex_migrations.upsert({
     *   create: {
     *     // ... data to create a Knex_migrations
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Knex_migrations we want to update
     *   }
     * })
     */
    upsert<T extends knex_migrationsUpsertArgs>(
      args: SelectSubset<T, knex_migrationsUpsertArgs<ExtArgs>>,
    ): Prisma__knex_migrationsClient<
      $Result.GetResult<
        Prisma.$knex_migrationsPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Knex_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrationsCountArgs} args - Arguments to filter Knex_migrations to count.
     * @example
     * // Count the number of Knex_migrations
     * const count = await prisma.knex_migrations.count({
     *   where: {
     *     // ... the filter for the Knex_migrations we want to count
     *   }
     * })
     **/
    count<T extends knex_migrationsCountArgs>(
      args?: Subset<T, knex_migrationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], Knex_migrationsCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Knex_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Knex_migrationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends Knex_migrationsAggregateArgs>(
      args: Subset<T, Knex_migrationsAggregateArgs>,
    ): Prisma.PrismaPromise<GetKnex_migrationsAggregateType<T>>;

    /**
     * Group by Knex_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends knex_migrationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: knex_migrationsGroupByArgs["orderBy"] }
        : { orderBy?: knex_migrationsGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      "Field ",
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, knex_migrationsGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetKnex_migrationsGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the knex_migrations model
     */
    readonly fields: knex_migrationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for knex_migrations.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__knex_migrationsClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the knex_migrations model
   */
  interface knex_migrationsFieldRefs {
    readonly id: FieldRef<"knex_migrations", "Int">;
    readonly name: FieldRef<"knex_migrations", "String">;
    readonly batch: FieldRef<"knex_migrations", "Int">;
    readonly migration_time: FieldRef<"knex_migrations", "DateTime">;
  }

  // Custom InputTypes
  /**
   * knex_migrations findUnique
   */
  export type knex_migrationsFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations to fetch.
     */
    where: knex_migrationsWhereUniqueInput;
  };

  /**
   * knex_migrations findUniqueOrThrow
   */
  export type knex_migrationsFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations to fetch.
     */
    where: knex_migrationsWhereUniqueInput;
  };

  /**
   * knex_migrations findFirst
   */
  export type knex_migrationsFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations to fetch.
     */
    where?: knex_migrationsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of knex_migrations to fetch.
     */
    orderBy?:
      | knex_migrationsOrderByWithRelationInput
      | knex_migrationsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for knex_migrations.
     */
    cursor?: knex_migrationsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` knex_migrations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` knex_migrations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of knex_migrations.
     */
    distinct?:
      | Knex_migrationsScalarFieldEnum
      | Knex_migrationsScalarFieldEnum[];
  };

  /**
   * knex_migrations findFirstOrThrow
   */
  export type knex_migrationsFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations to fetch.
     */
    where?: knex_migrationsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of knex_migrations to fetch.
     */
    orderBy?:
      | knex_migrationsOrderByWithRelationInput
      | knex_migrationsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for knex_migrations.
     */
    cursor?: knex_migrationsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` knex_migrations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` knex_migrations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of knex_migrations.
     */
    distinct?:
      | Knex_migrationsScalarFieldEnum
      | Knex_migrationsScalarFieldEnum[];
  };

  /**
   * knex_migrations findMany
   */
  export type knex_migrationsFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations to fetch.
     */
    where?: knex_migrationsWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of knex_migrations to fetch.
     */
    orderBy?:
      | knex_migrationsOrderByWithRelationInput
      | knex_migrationsOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing knex_migrations.
     */
    cursor?: knex_migrationsWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` knex_migrations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` knex_migrations.
     */
    skip?: number;
    distinct?:
      | Knex_migrationsScalarFieldEnum
      | Knex_migrationsScalarFieldEnum[];
  };

  /**
   * knex_migrations create
   */
  export type knex_migrationsCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * The data needed to create a knex_migrations.
     */
    data?: XOR<knex_migrationsCreateInput, knex_migrationsUncheckedCreateInput>;
  };

  /**
   * knex_migrations createMany
   */
  export type knex_migrationsCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many knex_migrations.
     */
    data: knex_migrationsCreateManyInput | knex_migrationsCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * knex_migrations createManyAndReturn
   */
  export type knex_migrationsCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * The data used to create many knex_migrations.
     */
    data: knex_migrationsCreateManyInput | knex_migrationsCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * knex_migrations update
   */
  export type knex_migrationsUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * The data needed to update a knex_migrations.
     */
    data: XOR<knex_migrationsUpdateInput, knex_migrationsUncheckedUpdateInput>;
    /**
     * Choose, which knex_migrations to update.
     */
    where: knex_migrationsWhereUniqueInput;
  };

  /**
   * knex_migrations updateMany
   */
  export type knex_migrationsUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update knex_migrations.
     */
    data: XOR<
      knex_migrationsUpdateManyMutationInput,
      knex_migrationsUncheckedUpdateManyInput
    >;
    /**
     * Filter which knex_migrations to update
     */
    where?: knex_migrationsWhereInput;
    /**
     * Limit how many knex_migrations to update.
     */
    limit?: number;
  };

  /**
   * knex_migrations updateManyAndReturn
   */
  export type knex_migrationsUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * The data used to update knex_migrations.
     */
    data: XOR<
      knex_migrationsUpdateManyMutationInput,
      knex_migrationsUncheckedUpdateManyInput
    >;
    /**
     * Filter which knex_migrations to update
     */
    where?: knex_migrationsWhereInput;
    /**
     * Limit how many knex_migrations to update.
     */
    limit?: number;
  };

  /**
   * knex_migrations upsert
   */
  export type knex_migrationsUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * The filter to search for the knex_migrations to update in case it exists.
     */
    where: knex_migrationsWhereUniqueInput;
    /**
     * In case the knex_migrations found by the `where` argument doesn't exist, create a new knex_migrations with this data.
     */
    create: XOR<
      knex_migrationsCreateInput,
      knex_migrationsUncheckedCreateInput
    >;
    /**
     * In case the knex_migrations was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      knex_migrationsUpdateInput,
      knex_migrationsUncheckedUpdateInput
    >;
  };

  /**
   * knex_migrations delete
   */
  export type knex_migrationsDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
    /**
     * Filter which knex_migrations to delete.
     */
    where: knex_migrationsWhereUniqueInput;
  };

  /**
   * knex_migrations deleteMany
   */
  export type knex_migrationsDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which knex_migrations to delete
     */
    where?: knex_migrationsWhereInput;
    /**
     * Limit how many knex_migrations to delete.
     */
    limit?: number;
  };

  /**
   * knex_migrations without action
   */
  export type knex_migrationsDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations
     */
    select?: knex_migrationsSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations
     */
    omit?: knex_migrationsOmit<ExtArgs> | null;
  };

  /**
   * Model knex_migrations_lock
   */

  export type AggregateKnex_migrations_lock = {
    _count: Knex_migrations_lockCountAggregateOutputType | null;
    _avg: Knex_migrations_lockAvgAggregateOutputType | null;
    _sum: Knex_migrations_lockSumAggregateOutputType | null;
    _min: Knex_migrations_lockMinAggregateOutputType | null;
    _max: Knex_migrations_lockMaxAggregateOutputType | null;
  };

  export type Knex_migrations_lockAvgAggregateOutputType = {
    index: number | null;
    is_locked: number | null;
  };

  export type Knex_migrations_lockSumAggregateOutputType = {
    index: number | null;
    is_locked: number | null;
  };

  export type Knex_migrations_lockMinAggregateOutputType = {
    index: number | null;
    is_locked: number | null;
  };

  export type Knex_migrations_lockMaxAggregateOutputType = {
    index: number | null;
    is_locked: number | null;
  };

  export type Knex_migrations_lockCountAggregateOutputType = {
    index: number;
    is_locked: number;
    _all: number;
  };

  export type Knex_migrations_lockAvgAggregateInputType = {
    index?: true;
    is_locked?: true;
  };

  export type Knex_migrations_lockSumAggregateInputType = {
    index?: true;
    is_locked?: true;
  };

  export type Knex_migrations_lockMinAggregateInputType = {
    index?: true;
    is_locked?: true;
  };

  export type Knex_migrations_lockMaxAggregateInputType = {
    index?: true;
    is_locked?: true;
  };

  export type Knex_migrations_lockCountAggregateInputType = {
    index?: true;
    is_locked?: true;
    _all?: true;
  };

  export type Knex_migrations_lockAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which knex_migrations_lock to aggregate.
     */
    where?: knex_migrations_lockWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of knex_migrations_locks to fetch.
     */
    orderBy?:
      | knex_migrations_lockOrderByWithRelationInput
      | knex_migrations_lockOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: knex_migrations_lockWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` knex_migrations_locks from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` knex_migrations_locks.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned knex_migrations_locks
     **/
    _count?: true | Knex_migrations_lockCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: Knex_migrations_lockAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: Knex_migrations_lockSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: Knex_migrations_lockMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: Knex_migrations_lockMaxAggregateInputType;
  };

  export type GetKnex_migrations_lockAggregateType<
    T extends Knex_migrations_lockAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateKnex_migrations_lock]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKnex_migrations_lock[P]>
      : GetScalarType<T[P], AggregateKnex_migrations_lock[P]>;
  };

  export type knex_migrations_lockGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: knex_migrations_lockWhereInput;
    orderBy?:
      | knex_migrations_lockOrderByWithAggregationInput
      | knex_migrations_lockOrderByWithAggregationInput[];
    by:
      | Knex_migrations_lockScalarFieldEnum[]
      | Knex_migrations_lockScalarFieldEnum;
    having?: knex_migrations_lockScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Knex_migrations_lockCountAggregateInputType | true;
    _avg?: Knex_migrations_lockAvgAggregateInputType;
    _sum?: Knex_migrations_lockSumAggregateInputType;
    _min?: Knex_migrations_lockMinAggregateInputType;
    _max?: Knex_migrations_lockMaxAggregateInputType;
  };

  export type Knex_migrations_lockGroupByOutputType = {
    index: number;
    is_locked: number | null;
    _count: Knex_migrations_lockCountAggregateOutputType | null;
    _avg: Knex_migrations_lockAvgAggregateOutputType | null;
    _sum: Knex_migrations_lockSumAggregateOutputType | null;
    _min: Knex_migrations_lockMinAggregateOutputType | null;
    _max: Knex_migrations_lockMaxAggregateOutputType | null;
  };

  type GetKnex_migrations_lockGroupByPayload<
    T extends knex_migrations_lockGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Knex_migrations_lockGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof Knex_migrations_lockGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], Knex_migrations_lockGroupByOutputType[P]>
          : GetScalarType<T[P], Knex_migrations_lockGroupByOutputType[P]>;
      }
    >
  >;

  export type knex_migrations_lockSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      index?: boolean;
      is_locked?: boolean;
    },
    ExtArgs["result"]["knex_migrations_lock"]
  >;

  export type knex_migrations_lockSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      index?: boolean;
      is_locked?: boolean;
    },
    ExtArgs["result"]["knex_migrations_lock"]
  >;

  export type knex_migrations_lockSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      index?: boolean;
      is_locked?: boolean;
    },
    ExtArgs["result"]["knex_migrations_lock"]
  >;

  export type knex_migrations_lockSelectScalar = {
    index?: boolean;
    is_locked?: boolean;
  };

  export type knex_migrations_lockOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    "index" | "is_locked",
    ExtArgs["result"]["knex_migrations_lock"]
  >;

  export type $knex_migrations_lockPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "knex_migrations_lock";
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        index: number;
        is_locked: number | null;
      },
      ExtArgs["result"]["knex_migrations_lock"]
    >;
    composites: {};
  };

  type knex_migrations_lockGetPayload<
    S extends boolean | null | undefined | knex_migrations_lockDefaultArgs,
  > = $Result.GetResult<Prisma.$knex_migrations_lockPayload, S>;

  type knex_migrations_lockCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    knex_migrations_lockFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: Knex_migrations_lockCountAggregateInputType | true;
  };

  export interface knex_migrations_lockDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["knex_migrations_lock"];
      meta: { name: "knex_migrations_lock" };
    };
    /**
     * Find zero or one Knex_migrations_lock that matches the filter.
     * @param {knex_migrations_lockFindUniqueArgs} args - Arguments to find a Knex_migrations_lock
     * @example
     * // Get one Knex_migrations_lock
     * const knex_migrations_lock = await prisma.knex_migrations_lock.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends knex_migrations_lockFindUniqueArgs>(
      args: SelectSubset<T, knex_migrations_lockFindUniqueArgs<ExtArgs>>,
    ): Prisma__knex_migrations_lockClient<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Knex_migrations_lock that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {knex_migrations_lockFindUniqueOrThrowArgs} args - Arguments to find a Knex_migrations_lock
     * @example
     * // Get one Knex_migrations_lock
     * const knex_migrations_lock = await prisma.knex_migrations_lock.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends knex_migrations_lockFindUniqueOrThrowArgs>(
      args: SelectSubset<T, knex_migrations_lockFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__knex_migrations_lockClient<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Knex_migrations_lock that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrations_lockFindFirstArgs} args - Arguments to find a Knex_migrations_lock
     * @example
     * // Get one Knex_migrations_lock
     * const knex_migrations_lock = await prisma.knex_migrations_lock.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends knex_migrations_lockFindFirstArgs>(
      args?: SelectSubset<T, knex_migrations_lockFindFirstArgs<ExtArgs>>,
    ): Prisma__knex_migrations_lockClient<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Knex_migrations_lock that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrations_lockFindFirstOrThrowArgs} args - Arguments to find a Knex_migrations_lock
     * @example
     * // Get one Knex_migrations_lock
     * const knex_migrations_lock = await prisma.knex_migrations_lock.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends knex_migrations_lockFindFirstOrThrowArgs>(
      args?: SelectSubset<T, knex_migrations_lockFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__knex_migrations_lockClient<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Knex_migrations_locks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrations_lockFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Knex_migrations_locks
     * const knex_migrations_locks = await prisma.knex_migrations_lock.findMany()
     *
     * // Get first 10 Knex_migrations_locks
     * const knex_migrations_locks = await prisma.knex_migrations_lock.findMany({ take: 10 })
     *
     * // Only select the `index`
     * const knex_migrations_lockWithIndexOnly = await prisma.knex_migrations_lock.findMany({ select: { index: true } })
     *
     */
    findMany<T extends knex_migrations_lockFindManyArgs>(
      args?: SelectSubset<T, knex_migrations_lockFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Knex_migrations_lock.
     * @param {knex_migrations_lockCreateArgs} args - Arguments to create a Knex_migrations_lock.
     * @example
     * // Create one Knex_migrations_lock
     * const Knex_migrations_lock = await prisma.knex_migrations_lock.create({
     *   data: {
     *     // ... data to create a Knex_migrations_lock
     *   }
     * })
     *
     */
    create<T extends knex_migrations_lockCreateArgs>(
      args: SelectSubset<T, knex_migrations_lockCreateArgs<ExtArgs>>,
    ): Prisma__knex_migrations_lockClient<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Knex_migrations_locks.
     * @param {knex_migrations_lockCreateManyArgs} args - Arguments to create many Knex_migrations_locks.
     * @example
     * // Create many Knex_migrations_locks
     * const knex_migrations_lock = await prisma.knex_migrations_lock.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends knex_migrations_lockCreateManyArgs>(
      args?: SelectSubset<T, knex_migrations_lockCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Knex_migrations_locks and returns the data saved in the database.
     * @param {knex_migrations_lockCreateManyAndReturnArgs} args - Arguments to create many Knex_migrations_locks.
     * @example
     * // Create many Knex_migrations_locks
     * const knex_migrations_lock = await prisma.knex_migrations_lock.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Knex_migrations_locks and only return the `index`
     * const knex_migrations_lockWithIndexOnly = await prisma.knex_migrations_lock.createManyAndReturn({
     *   select: { index: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends knex_migrations_lockCreateManyAndReturnArgs>(
      args?: SelectSubset<
        T,
        knex_migrations_lockCreateManyAndReturnArgs<ExtArgs>
      >,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Knex_migrations_lock.
     * @param {knex_migrations_lockDeleteArgs} args - Arguments to delete one Knex_migrations_lock.
     * @example
     * // Delete one Knex_migrations_lock
     * const Knex_migrations_lock = await prisma.knex_migrations_lock.delete({
     *   where: {
     *     // ... filter to delete one Knex_migrations_lock
     *   }
     * })
     *
     */
    delete<T extends knex_migrations_lockDeleteArgs>(
      args: SelectSubset<T, knex_migrations_lockDeleteArgs<ExtArgs>>,
    ): Prisma__knex_migrations_lockClient<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Knex_migrations_lock.
     * @param {knex_migrations_lockUpdateArgs} args - Arguments to update one Knex_migrations_lock.
     * @example
     * // Update one Knex_migrations_lock
     * const knex_migrations_lock = await prisma.knex_migrations_lock.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends knex_migrations_lockUpdateArgs>(
      args: SelectSubset<T, knex_migrations_lockUpdateArgs<ExtArgs>>,
    ): Prisma__knex_migrations_lockClient<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Knex_migrations_locks.
     * @param {knex_migrations_lockDeleteManyArgs} args - Arguments to filter Knex_migrations_locks to delete.
     * @example
     * // Delete a few Knex_migrations_locks
     * const { count } = await prisma.knex_migrations_lock.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends knex_migrations_lockDeleteManyArgs>(
      args?: SelectSubset<T, knex_migrations_lockDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Knex_migrations_locks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrations_lockUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Knex_migrations_locks
     * const knex_migrations_lock = await prisma.knex_migrations_lock.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends knex_migrations_lockUpdateManyArgs>(
      args: SelectSubset<T, knex_migrations_lockUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Knex_migrations_locks and returns the data updated in the database.
     * @param {knex_migrations_lockUpdateManyAndReturnArgs} args - Arguments to update many Knex_migrations_locks.
     * @example
     * // Update many Knex_migrations_locks
     * const knex_migrations_lock = await prisma.knex_migrations_lock.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Knex_migrations_locks and only return the `index`
     * const knex_migrations_lockWithIndexOnly = await prisma.knex_migrations_lock.updateManyAndReturn({
     *   select: { index: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends knex_migrations_lockUpdateManyAndReturnArgs>(
      args: SelectSubset<
        T,
        knex_migrations_lockUpdateManyAndReturnArgs<ExtArgs>
      >,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Knex_migrations_lock.
     * @param {knex_migrations_lockUpsertArgs} args - Arguments to update or create a Knex_migrations_lock.
     * @example
     * // Update or create a Knex_migrations_lock
     * const knex_migrations_lock = await prisma.knex_migrations_lock.upsert({
     *   create: {
     *     // ... data to create a Knex_migrations_lock
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Knex_migrations_lock we want to update
     *   }
     * })
     */
    upsert<T extends knex_migrations_lockUpsertArgs>(
      args: SelectSubset<T, knex_migrations_lockUpsertArgs<ExtArgs>>,
    ): Prisma__knex_migrations_lockClient<
      $Result.GetResult<
        Prisma.$knex_migrations_lockPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Knex_migrations_locks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrations_lockCountArgs} args - Arguments to filter Knex_migrations_locks to count.
     * @example
     * // Count the number of Knex_migrations_locks
     * const count = await prisma.knex_migrations_lock.count({
     *   where: {
     *     // ... the filter for the Knex_migrations_locks we want to count
     *   }
     * })
     **/
    count<T extends knex_migrations_lockCountArgs>(
      args?: Subset<T, knex_migrations_lockCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              Knex_migrations_lockCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Knex_migrations_lock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Knex_migrations_lockAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends Knex_migrations_lockAggregateArgs>(
      args: Subset<T, Knex_migrations_lockAggregateArgs>,
    ): Prisma.PrismaPromise<GetKnex_migrations_lockAggregateType<T>>;

    /**
     * Group by Knex_migrations_lock.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {knex_migrations_lockGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends knex_migrations_lockGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: knex_migrations_lockGroupByArgs["orderBy"] }
        : { orderBy?: knex_migrations_lockGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      "Field ",
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, knex_migrations_lockGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetKnex_migrations_lockGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the knex_migrations_lock model
     */
    readonly fields: knex_migrations_lockFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for knex_migrations_lock.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__knex_migrations_lockClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the knex_migrations_lock model
   */
  interface knex_migrations_lockFieldRefs {
    readonly index: FieldRef<"knex_migrations_lock", "Int">;
    readonly is_locked: FieldRef<"knex_migrations_lock", "Int">;
  }

  // Custom InputTypes
  /**
   * knex_migrations_lock findUnique
   */
  export type knex_migrations_lockFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations_lock to fetch.
     */
    where: knex_migrations_lockWhereUniqueInput;
  };

  /**
   * knex_migrations_lock findUniqueOrThrow
   */
  export type knex_migrations_lockFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations_lock to fetch.
     */
    where: knex_migrations_lockWhereUniqueInput;
  };

  /**
   * knex_migrations_lock findFirst
   */
  export type knex_migrations_lockFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations_lock to fetch.
     */
    where?: knex_migrations_lockWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of knex_migrations_locks to fetch.
     */
    orderBy?:
      | knex_migrations_lockOrderByWithRelationInput
      | knex_migrations_lockOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for knex_migrations_locks.
     */
    cursor?: knex_migrations_lockWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` knex_migrations_locks from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` knex_migrations_locks.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of knex_migrations_locks.
     */
    distinct?:
      | Knex_migrations_lockScalarFieldEnum
      | Knex_migrations_lockScalarFieldEnum[];
  };

  /**
   * knex_migrations_lock findFirstOrThrow
   */
  export type knex_migrations_lockFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations_lock to fetch.
     */
    where?: knex_migrations_lockWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of knex_migrations_locks to fetch.
     */
    orderBy?:
      | knex_migrations_lockOrderByWithRelationInput
      | knex_migrations_lockOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for knex_migrations_locks.
     */
    cursor?: knex_migrations_lockWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` knex_migrations_locks from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` knex_migrations_locks.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of knex_migrations_locks.
     */
    distinct?:
      | Knex_migrations_lockScalarFieldEnum
      | Knex_migrations_lockScalarFieldEnum[];
  };

  /**
   * knex_migrations_lock findMany
   */
  export type knex_migrations_lockFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * Filter, which knex_migrations_locks to fetch.
     */
    where?: knex_migrations_lockWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of knex_migrations_locks to fetch.
     */
    orderBy?:
      | knex_migrations_lockOrderByWithRelationInput
      | knex_migrations_lockOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing knex_migrations_locks.
     */
    cursor?: knex_migrations_lockWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` knex_migrations_locks from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` knex_migrations_locks.
     */
    skip?: number;
    distinct?:
      | Knex_migrations_lockScalarFieldEnum
      | Knex_migrations_lockScalarFieldEnum[];
  };

  /**
   * knex_migrations_lock create
   */
  export type knex_migrations_lockCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * The data needed to create a knex_migrations_lock.
     */
    data?: XOR<
      knex_migrations_lockCreateInput,
      knex_migrations_lockUncheckedCreateInput
    >;
  };

  /**
   * knex_migrations_lock createMany
   */
  export type knex_migrations_lockCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many knex_migrations_locks.
     */
    data:
      | knex_migrations_lockCreateManyInput
      | knex_migrations_lockCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * knex_migrations_lock createManyAndReturn
   */
  export type knex_migrations_lockCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * The data used to create many knex_migrations_locks.
     */
    data:
      | knex_migrations_lockCreateManyInput
      | knex_migrations_lockCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * knex_migrations_lock update
   */
  export type knex_migrations_lockUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * The data needed to update a knex_migrations_lock.
     */
    data: XOR<
      knex_migrations_lockUpdateInput,
      knex_migrations_lockUncheckedUpdateInput
    >;
    /**
     * Choose, which knex_migrations_lock to update.
     */
    where: knex_migrations_lockWhereUniqueInput;
  };

  /**
   * knex_migrations_lock updateMany
   */
  export type knex_migrations_lockUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update knex_migrations_locks.
     */
    data: XOR<
      knex_migrations_lockUpdateManyMutationInput,
      knex_migrations_lockUncheckedUpdateManyInput
    >;
    /**
     * Filter which knex_migrations_locks to update
     */
    where?: knex_migrations_lockWhereInput;
    /**
     * Limit how many knex_migrations_locks to update.
     */
    limit?: number;
  };

  /**
   * knex_migrations_lock updateManyAndReturn
   */
  export type knex_migrations_lockUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * The data used to update knex_migrations_locks.
     */
    data: XOR<
      knex_migrations_lockUpdateManyMutationInput,
      knex_migrations_lockUncheckedUpdateManyInput
    >;
    /**
     * Filter which knex_migrations_locks to update
     */
    where?: knex_migrations_lockWhereInput;
    /**
     * Limit how many knex_migrations_locks to update.
     */
    limit?: number;
  };

  /**
   * knex_migrations_lock upsert
   */
  export type knex_migrations_lockUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * The filter to search for the knex_migrations_lock to update in case it exists.
     */
    where: knex_migrations_lockWhereUniqueInput;
    /**
     * In case the knex_migrations_lock found by the `where` argument doesn't exist, create a new knex_migrations_lock with this data.
     */
    create: XOR<
      knex_migrations_lockCreateInput,
      knex_migrations_lockUncheckedCreateInput
    >;
    /**
     * In case the knex_migrations_lock was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      knex_migrations_lockUpdateInput,
      knex_migrations_lockUncheckedUpdateInput
    >;
  };

  /**
   * knex_migrations_lock delete
   */
  export type knex_migrations_lockDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
    /**
     * Filter which knex_migrations_lock to delete.
     */
    where: knex_migrations_lockWhereUniqueInput;
  };

  /**
   * knex_migrations_lock deleteMany
   */
  export type knex_migrations_lockDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which knex_migrations_locks to delete
     */
    where?: knex_migrations_lockWhereInput;
    /**
     * Limit how many knex_migrations_locks to delete.
     */
    limit?: number;
  };

  /**
   * knex_migrations_lock without action
   */
  export type knex_migrations_lockDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the knex_migrations_lock
     */
    select?: knex_migrations_lockSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the knex_migrations_lock
     */
    omit?: knex_migrations_lockOmit<ExtArgs> | null;
  };

  /**
   * Model receipt_addresses
   */

  export type AggregateReceipt_addresses = {
    _count: Receipt_addressesCountAggregateOutputType | null;
    _avg: Receipt_addressesAvgAggregateOutputType | null;
    _sum: Receipt_addressesSumAggregateOutputType | null;
    _min: Receipt_addressesMinAggregateOutputType | null;
    _max: Receipt_addressesMaxAggregateOutputType | null;
  };

  export type Receipt_addressesAvgAggregateOutputType = {
    id: number | null;
  };

  export type Receipt_addressesSumAggregateOutputType = {
    id: number | null;
  };

  export type Receipt_addressesMinAggregateOutputType = {
    id: number | null;
    address: string | null;
    province: string | null;
    district: string | null;
    sub_district: string | null;
    postal_code: string | null;
    telephone: string | null;
    fax_number: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type Receipt_addressesMaxAggregateOutputType = {
    id: number | null;
    address: string | null;
    province: string | null;
    district: string | null;
    sub_district: string | null;
    postal_code: string | null;
    telephone: string | null;
    fax_number: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type Receipt_addressesCountAggregateOutputType = {
    id: number;
    address: number;
    province: number;
    district: number;
    sub_district: number;
    postal_code: number;
    telephone: number;
    fax_number: number;
    created_at: number;
    updated_at: number;
    _all: number;
  };

  export type Receipt_addressesAvgAggregateInputType = {
    id?: true;
  };

  export type Receipt_addressesSumAggregateInputType = {
    id?: true;
  };

  export type Receipt_addressesMinAggregateInputType = {
    id?: true;
    address?: true;
    province?: true;
    district?: true;
    sub_district?: true;
    postal_code?: true;
    telephone?: true;
    fax_number?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type Receipt_addressesMaxAggregateInputType = {
    id?: true;
    address?: true;
    province?: true;
    district?: true;
    sub_district?: true;
    postal_code?: true;
    telephone?: true;
    fax_number?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type Receipt_addressesCountAggregateInputType = {
    id?: true;
    address?: true;
    province?: true;
    district?: true;
    sub_district?: true;
    postal_code?: true;
    telephone?: true;
    fax_number?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
  };

  export type Receipt_addressesAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which receipt_addresses to aggregate.
     */
    where?: receipt_addressesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of receipt_addresses to fetch.
     */
    orderBy?:
      | receipt_addressesOrderByWithRelationInput
      | receipt_addressesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: receipt_addressesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` receipt_addresses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` receipt_addresses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned receipt_addresses
     **/
    _count?: true | Receipt_addressesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: Receipt_addressesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: Receipt_addressesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: Receipt_addressesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: Receipt_addressesMaxAggregateInputType;
  };

  export type GetReceipt_addressesAggregateType<
    T extends Receipt_addressesAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateReceipt_addresses]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReceipt_addresses[P]>
      : GetScalarType<T[P], AggregateReceipt_addresses[P]>;
  };

  export type receipt_addressesGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: receipt_addressesWhereInput;
    orderBy?:
      | receipt_addressesOrderByWithAggregationInput
      | receipt_addressesOrderByWithAggregationInput[];
    by: Receipt_addressesScalarFieldEnum[] | Receipt_addressesScalarFieldEnum;
    having?: receipt_addressesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Receipt_addressesCountAggregateInputType | true;
    _avg?: Receipt_addressesAvgAggregateInputType;
    _sum?: Receipt_addressesSumAggregateInputType;
    _min?: Receipt_addressesMinAggregateInputType;
    _max?: Receipt_addressesMaxAggregateInputType;
  };

  export type Receipt_addressesGroupByOutputType = {
    id: number;
    address: string;
    province: string;
    district: string;
    sub_district: string;
    postal_code: string;
    telephone: string | null;
    fax_number: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    _count: Receipt_addressesCountAggregateOutputType | null;
    _avg: Receipt_addressesAvgAggregateOutputType | null;
    _sum: Receipt_addressesSumAggregateOutputType | null;
    _min: Receipt_addressesMinAggregateOutputType | null;
    _max: Receipt_addressesMaxAggregateOutputType | null;
  };

  type GetReceipt_addressesGroupByPayload<
    T extends receipt_addressesGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Receipt_addressesGroupByOutputType, T["by"]> & {
        [P in keyof T &
          keyof Receipt_addressesGroupByOutputType]: P extends "_count"
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], Receipt_addressesGroupByOutputType[P]>
          : GetScalarType<T[P], Receipt_addressesGroupByOutputType[P]>;
      }
    >
  >;

  export type receipt_addressesSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      address?: boolean;
      province?: boolean;
      district?: boolean;
      sub_district?: boolean;
      postal_code?: boolean;
      telephone?: boolean;
      fax_number?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["receipt_addresses"]
  >;

  export type receipt_addressesSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      address?: boolean;
      province?: boolean;
      district?: boolean;
      sub_district?: boolean;
      postal_code?: boolean;
      telephone?: boolean;
      fax_number?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["receipt_addresses"]
  >;

  export type receipt_addressesSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      address?: boolean;
      province?: boolean;
      district?: boolean;
      sub_district?: boolean;
      postal_code?: boolean;
      telephone?: boolean;
      fax_number?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["receipt_addresses"]
  >;

  export type receipt_addressesSelectScalar = {
    id?: boolean;
    address?: boolean;
    province?: boolean;
    district?: boolean;
    sub_district?: boolean;
    postal_code?: boolean;
    telephone?: boolean;
    fax_number?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
  };

  export type receipt_addressesOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | "id"
    | "address"
    | "province"
    | "district"
    | "sub_district"
    | "postal_code"
    | "telephone"
    | "fax_number"
    | "created_at"
    | "updated_at",
    ExtArgs["result"]["receipt_addresses"]
  >;

  export type $receipt_addressesPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "receipt_addresses";
    objects: {};
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        address: string;
        province: string;
        district: string;
        sub_district: string;
        postal_code: string;
        telephone: string | null;
        fax_number: string | null;
        created_at: Date | null;
        updated_at: Date | null;
      },
      ExtArgs["result"]["receipt_addresses"]
    >;
    composites: {};
  };

  type receipt_addressesGetPayload<
    S extends boolean | null | undefined | receipt_addressesDefaultArgs,
  > = $Result.GetResult<Prisma.$receipt_addressesPayload, S>;

  type receipt_addressesCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    receipt_addressesFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: Receipt_addressesCountAggregateInputType | true;
  };

  export interface receipt_addressesDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["receipt_addresses"];
      meta: { name: "receipt_addresses" };
    };
    /**
     * Find zero or one Receipt_addresses that matches the filter.
     * @param {receipt_addressesFindUniqueArgs} args - Arguments to find a Receipt_addresses
     * @example
     * // Get one Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends receipt_addressesFindUniqueArgs>(
      args: SelectSubset<T, receipt_addressesFindUniqueArgs<ExtArgs>>,
    ): Prisma__receipt_addressesClient<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Receipt_addresses that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {receipt_addressesFindUniqueOrThrowArgs} args - Arguments to find a Receipt_addresses
     * @example
     * // Get one Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends receipt_addressesFindUniqueOrThrowArgs>(
      args: SelectSubset<T, receipt_addressesFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__receipt_addressesClient<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Receipt_addresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {receipt_addressesFindFirstArgs} args - Arguments to find a Receipt_addresses
     * @example
     * // Get one Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends receipt_addressesFindFirstArgs>(
      args?: SelectSubset<T, receipt_addressesFindFirstArgs<ExtArgs>>,
    ): Prisma__receipt_addressesClient<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Receipt_addresses that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {receipt_addressesFindFirstOrThrowArgs} args - Arguments to find a Receipt_addresses
     * @example
     * // Get one Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends receipt_addressesFindFirstOrThrowArgs>(
      args?: SelectSubset<T, receipt_addressesFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__receipt_addressesClient<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Receipt_addresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {receipt_addressesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.findMany()
     *
     * // Get first 10 Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const receipt_addressesWithIdOnly = await prisma.receipt_addresses.findMany({ select: { id: true } })
     *
     */
    findMany<T extends receipt_addressesFindManyArgs>(
      args?: SelectSubset<T, receipt_addressesFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Receipt_addresses.
     * @param {receipt_addressesCreateArgs} args - Arguments to create a Receipt_addresses.
     * @example
     * // Create one Receipt_addresses
     * const Receipt_addresses = await prisma.receipt_addresses.create({
     *   data: {
     *     // ... data to create a Receipt_addresses
     *   }
     * })
     *
     */
    create<T extends receipt_addressesCreateArgs>(
      args: SelectSubset<T, receipt_addressesCreateArgs<ExtArgs>>,
    ): Prisma__receipt_addressesClient<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Receipt_addresses.
     * @param {receipt_addressesCreateManyArgs} args - Arguments to create many Receipt_addresses.
     * @example
     * // Create many Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends receipt_addressesCreateManyArgs>(
      args?: SelectSubset<T, receipt_addressesCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Receipt_addresses and returns the data saved in the database.
     * @param {receipt_addressesCreateManyAndReturnArgs} args - Arguments to create many Receipt_addresses.
     * @example
     * // Create many Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Receipt_addresses and only return the `id`
     * const receipt_addressesWithIdOnly = await prisma.receipt_addresses.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends receipt_addressesCreateManyAndReturnArgs>(
      args?: SelectSubset<T, receipt_addressesCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Receipt_addresses.
     * @param {receipt_addressesDeleteArgs} args - Arguments to delete one Receipt_addresses.
     * @example
     * // Delete one Receipt_addresses
     * const Receipt_addresses = await prisma.receipt_addresses.delete({
     *   where: {
     *     // ... filter to delete one Receipt_addresses
     *   }
     * })
     *
     */
    delete<T extends receipt_addressesDeleteArgs>(
      args: SelectSubset<T, receipt_addressesDeleteArgs<ExtArgs>>,
    ): Prisma__receipt_addressesClient<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Receipt_addresses.
     * @param {receipt_addressesUpdateArgs} args - Arguments to update one Receipt_addresses.
     * @example
     * // Update one Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends receipt_addressesUpdateArgs>(
      args: SelectSubset<T, receipt_addressesUpdateArgs<ExtArgs>>,
    ): Prisma__receipt_addressesClient<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Receipt_addresses.
     * @param {receipt_addressesDeleteManyArgs} args - Arguments to filter Receipt_addresses to delete.
     * @example
     * // Delete a few Receipt_addresses
     * const { count } = await prisma.receipt_addresses.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends receipt_addressesDeleteManyArgs>(
      args?: SelectSubset<T, receipt_addressesDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Receipt_addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {receipt_addressesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends receipt_addressesUpdateManyArgs>(
      args: SelectSubset<T, receipt_addressesUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Receipt_addresses and returns the data updated in the database.
     * @param {receipt_addressesUpdateManyAndReturnArgs} args - Arguments to update many Receipt_addresses.
     * @example
     * // Update many Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Receipt_addresses and only return the `id`
     * const receipt_addressesWithIdOnly = await prisma.receipt_addresses.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends receipt_addressesUpdateManyAndReturnArgs>(
      args: SelectSubset<T, receipt_addressesUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Receipt_addresses.
     * @param {receipt_addressesUpsertArgs} args - Arguments to update or create a Receipt_addresses.
     * @example
     * // Update or create a Receipt_addresses
     * const receipt_addresses = await prisma.receipt_addresses.upsert({
     *   create: {
     *     // ... data to create a Receipt_addresses
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Receipt_addresses we want to update
     *   }
     * })
     */
    upsert<T extends receipt_addressesUpsertArgs>(
      args: SelectSubset<T, receipt_addressesUpsertArgs<ExtArgs>>,
    ): Prisma__receipt_addressesClient<
      $Result.GetResult<
        Prisma.$receipt_addressesPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Receipt_addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {receipt_addressesCountArgs} args - Arguments to filter Receipt_addresses to count.
     * @example
     * // Count the number of Receipt_addresses
     * const count = await prisma.receipt_addresses.count({
     *   where: {
     *     // ... the filter for the Receipt_addresses we want to count
     *   }
     * })
     **/
    count<T extends receipt_addressesCountArgs>(
      args?: Subset<T, receipt_addressesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<
              T["select"],
              Receipt_addressesCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Receipt_addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Receipt_addressesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends Receipt_addressesAggregateArgs>(
      args: Subset<T, Receipt_addressesAggregateArgs>,
    ): Prisma.PrismaPromise<GetReceipt_addressesAggregateType<T>>;

    /**
     * Group by Receipt_addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {receipt_addressesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends receipt_addressesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: receipt_addressesGroupByArgs["orderBy"] }
        : { orderBy?: receipt_addressesGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      "Field ",
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, receipt_addressesGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetReceipt_addressesGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the receipt_addresses model
     */
    readonly fields: receipt_addressesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for receipt_addresses.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__receipt_addressesClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the receipt_addresses model
   */
  interface receipt_addressesFieldRefs {
    readonly id: FieldRef<"receipt_addresses", "Int">;
    readonly address: FieldRef<"receipt_addresses", "String">;
    readonly province: FieldRef<"receipt_addresses", "String">;
    readonly district: FieldRef<"receipt_addresses", "String">;
    readonly sub_district: FieldRef<"receipt_addresses", "String">;
    readonly postal_code: FieldRef<"receipt_addresses", "String">;
    readonly telephone: FieldRef<"receipt_addresses", "String">;
    readonly fax_number: FieldRef<"receipt_addresses", "String">;
    readonly created_at: FieldRef<"receipt_addresses", "DateTime">;
    readonly updated_at: FieldRef<"receipt_addresses", "DateTime">;
  }

  // Custom InputTypes
  /**
   * receipt_addresses findUnique
   */
  export type receipt_addressesFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * Filter, which receipt_addresses to fetch.
     */
    where: receipt_addressesWhereUniqueInput;
  };

  /**
   * receipt_addresses findUniqueOrThrow
   */
  export type receipt_addressesFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * Filter, which receipt_addresses to fetch.
     */
    where: receipt_addressesWhereUniqueInput;
  };

  /**
   * receipt_addresses findFirst
   */
  export type receipt_addressesFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * Filter, which receipt_addresses to fetch.
     */
    where?: receipt_addressesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of receipt_addresses to fetch.
     */
    orderBy?:
      | receipt_addressesOrderByWithRelationInput
      | receipt_addressesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for receipt_addresses.
     */
    cursor?: receipt_addressesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` receipt_addresses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` receipt_addresses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of receipt_addresses.
     */
    distinct?:
      | Receipt_addressesScalarFieldEnum
      | Receipt_addressesScalarFieldEnum[];
  };

  /**
   * receipt_addresses findFirstOrThrow
   */
  export type receipt_addressesFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * Filter, which receipt_addresses to fetch.
     */
    where?: receipt_addressesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of receipt_addresses to fetch.
     */
    orderBy?:
      | receipt_addressesOrderByWithRelationInput
      | receipt_addressesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for receipt_addresses.
     */
    cursor?: receipt_addressesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` receipt_addresses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` receipt_addresses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of receipt_addresses.
     */
    distinct?:
      | Receipt_addressesScalarFieldEnum
      | Receipt_addressesScalarFieldEnum[];
  };

  /**
   * receipt_addresses findMany
   */
  export type receipt_addressesFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * Filter, which receipt_addresses to fetch.
     */
    where?: receipt_addressesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of receipt_addresses to fetch.
     */
    orderBy?:
      | receipt_addressesOrderByWithRelationInput
      | receipt_addressesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing receipt_addresses.
     */
    cursor?: receipt_addressesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` receipt_addresses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` receipt_addresses.
     */
    skip?: number;
    distinct?:
      | Receipt_addressesScalarFieldEnum
      | Receipt_addressesScalarFieldEnum[];
  };

  /**
   * receipt_addresses create
   */
  export type receipt_addressesCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * The data needed to create a receipt_addresses.
     */
    data: XOR<
      receipt_addressesCreateInput,
      receipt_addressesUncheckedCreateInput
    >;
  };

  /**
   * receipt_addresses createMany
   */
  export type receipt_addressesCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many receipt_addresses.
     */
    data: receipt_addressesCreateManyInput | receipt_addressesCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * receipt_addresses createManyAndReturn
   */
  export type receipt_addressesCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * The data used to create many receipt_addresses.
     */
    data: receipt_addressesCreateManyInput | receipt_addressesCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * receipt_addresses update
   */
  export type receipt_addressesUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * The data needed to update a receipt_addresses.
     */
    data: XOR<
      receipt_addressesUpdateInput,
      receipt_addressesUncheckedUpdateInput
    >;
    /**
     * Choose, which receipt_addresses to update.
     */
    where: receipt_addressesWhereUniqueInput;
  };

  /**
   * receipt_addresses updateMany
   */
  export type receipt_addressesUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update receipt_addresses.
     */
    data: XOR<
      receipt_addressesUpdateManyMutationInput,
      receipt_addressesUncheckedUpdateManyInput
    >;
    /**
     * Filter which receipt_addresses to update
     */
    where?: receipt_addressesWhereInput;
    /**
     * Limit how many receipt_addresses to update.
     */
    limit?: number;
  };

  /**
   * receipt_addresses updateManyAndReturn
   */
  export type receipt_addressesUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * The data used to update receipt_addresses.
     */
    data: XOR<
      receipt_addressesUpdateManyMutationInput,
      receipt_addressesUncheckedUpdateManyInput
    >;
    /**
     * Filter which receipt_addresses to update
     */
    where?: receipt_addressesWhereInput;
    /**
     * Limit how many receipt_addresses to update.
     */
    limit?: number;
  };

  /**
   * receipt_addresses upsert
   */
  export type receipt_addressesUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * The filter to search for the receipt_addresses to update in case it exists.
     */
    where: receipt_addressesWhereUniqueInput;
    /**
     * In case the receipt_addresses found by the `where` argument doesn't exist, create a new receipt_addresses with this data.
     */
    create: XOR<
      receipt_addressesCreateInput,
      receipt_addressesUncheckedCreateInput
    >;
    /**
     * In case the receipt_addresses was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      receipt_addressesUpdateInput,
      receipt_addressesUncheckedUpdateInput
    >;
  };

  /**
   * receipt_addresses delete
   */
  export type receipt_addressesDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
    /**
     * Filter which receipt_addresses to delete.
     */
    where: receipt_addressesWhereUniqueInput;
  };

  /**
   * receipt_addresses deleteMany
   */
  export type receipt_addressesDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which receipt_addresses to delete
     */
    where?: receipt_addressesWhereInput;
    /**
     * Limit how many receipt_addresses to delete.
     */
    limit?: number;
  };

  /**
   * receipt_addresses without action
   */
  export type receipt_addressesDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the receipt_addresses
     */
    select?: receipt_addressesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the receipt_addresses
     */
    omit?: receipt_addressesOmit<ExtArgs> | null;
  };

  /**
   * Model sample_list
   */

  export type AggregateSample_list = {
    _count: Sample_listCountAggregateOutputType | null;
    _avg: Sample_listAvgAggregateOutputType | null;
    _sum: Sample_listSumAggregateOutputType | null;
    _min: Sample_listMinAggregateOutputType | null;
    _max: Sample_listMaxAggregateOutputType | null;
  };

  export type Sample_listAvgAggregateOutputType = {
    id: number | null;
    sample_qty: number | null;
  };

  export type Sample_listSumAggregateOutputType = {
    id: number | null;
    sample_qty: number | null;
  };

  export type Sample_listMinAggregateOutputType = {
    id: number | null;
    request_no: string | null;
    sent_sample_date: Date | null;
    animal_type: string | null;
    sample_specimen: string | null;
    panel: string | null;
    method: string | null;
    sample_qty: number | null;
    is_deleted: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type Sample_listMaxAggregateOutputType = {
    id: number | null;
    request_no: string | null;
    sent_sample_date: Date | null;
    animal_type: string | null;
    sample_specimen: string | null;
    panel: string | null;
    method: string | null;
    sample_qty: number | null;
    is_deleted: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type Sample_listCountAggregateOutputType = {
    id: number;
    request_no: number;
    sent_sample_date: number;
    animal_type: number;
    sample_specimen: number;
    panel: number;
    method: number;
    sample_qty: number;
    is_deleted: number;
    created_at: number;
    updated_at: number;
    _all: number;
  };

  export type Sample_listAvgAggregateInputType = {
    id?: true;
    sample_qty?: true;
  };

  export type Sample_listSumAggregateInputType = {
    id?: true;
    sample_qty?: true;
  };

  export type Sample_listMinAggregateInputType = {
    id?: true;
    request_no?: true;
    sent_sample_date?: true;
    animal_type?: true;
    sample_specimen?: true;
    panel?: true;
    method?: true;
    sample_qty?: true;
    is_deleted?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type Sample_listMaxAggregateInputType = {
    id?: true;
    request_no?: true;
    sent_sample_date?: true;
    animal_type?: true;
    sample_specimen?: true;
    panel?: true;
    method?: true;
    sample_qty?: true;
    is_deleted?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type Sample_listCountAggregateInputType = {
    id?: true;
    request_no?: true;
    sent_sample_date?: true;
    animal_type?: true;
    sample_specimen?: true;
    panel?: true;
    method?: true;
    sample_qty?: true;
    is_deleted?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
  };

  export type Sample_listAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which sample_list to aggregate.
     */
    where?: sample_listWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of sample_lists to fetch.
     */
    orderBy?:
      | sample_listOrderByWithRelationInput
      | sample_listOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: sample_listWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` sample_lists from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` sample_lists.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned sample_lists
     **/
    _count?: true | Sample_listCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: Sample_listAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: Sample_listSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: Sample_listMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: Sample_listMaxAggregateInputType;
  };

  export type GetSample_listAggregateType<T extends Sample_listAggregateArgs> =
    {
      [P in keyof T & keyof AggregateSample_list]: P extends "_count" | "count"
        ? T[P] extends true
          ? number
          : GetScalarType<T[P], AggregateSample_list[P]>
        : GetScalarType<T[P], AggregateSample_list[P]>;
    };

  export type sample_listGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: sample_listWhereInput;
    orderBy?:
      | sample_listOrderByWithAggregationInput
      | sample_listOrderByWithAggregationInput[];
    by: Sample_listScalarFieldEnum[] | Sample_listScalarFieldEnum;
    having?: sample_listScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Sample_listCountAggregateInputType | true;
    _avg?: Sample_listAvgAggregateInputType;
    _sum?: Sample_listSumAggregateInputType;
    _min?: Sample_listMinAggregateInputType;
    _max?: Sample_listMaxAggregateInputType;
  };

  export type Sample_listGroupByOutputType = {
    id: number;
    request_no: string;
    sent_sample_date: Date | null;
    animal_type: string | null;
    sample_specimen: string | null;
    panel: string | null;
    method: string | null;
    sample_qty: number | null;
    is_deleted: boolean;
    created_at: Date | null;
    updated_at: Date | null;
    _count: Sample_listCountAggregateOutputType | null;
    _avg: Sample_listAvgAggregateOutputType | null;
    _sum: Sample_listSumAggregateOutputType | null;
    _min: Sample_listMinAggregateOutputType | null;
    _max: Sample_listMaxAggregateOutputType | null;
  };

  type GetSample_listGroupByPayload<T extends sample_listGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<Sample_listGroupByOutputType, T["by"]> & {
          [P in keyof T &
            keyof Sample_listGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Sample_listGroupByOutputType[P]>
            : GetScalarType<T[P], Sample_listGroupByOutputType[P]>;
        }
      >
    >;

  export type sample_listSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      request_no?: boolean;
      sent_sample_date?: boolean;
      animal_type?: boolean;
      sample_specimen?: boolean;
      panel?: boolean;
      method?: boolean;
      sample_qty?: boolean;
      is_deleted?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      document_request?: boolean | document_requestDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["sample_list"]
  >;

  export type sample_listSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      request_no?: boolean;
      sent_sample_date?: boolean;
      animal_type?: boolean;
      sample_specimen?: boolean;
      panel?: boolean;
      method?: boolean;
      sample_qty?: boolean;
      is_deleted?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      document_request?: boolean | document_requestDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["sample_list"]
  >;

  export type sample_listSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      request_no?: boolean;
      sent_sample_date?: boolean;
      animal_type?: boolean;
      sample_specimen?: boolean;
      panel?: boolean;
      method?: boolean;
      sample_qty?: boolean;
      is_deleted?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      document_request?: boolean | document_requestDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["sample_list"]
  >;

  export type sample_listSelectScalar = {
    id?: boolean;
    request_no?: boolean;
    sent_sample_date?: boolean;
    animal_type?: boolean;
    sample_specimen?: boolean;
    panel?: boolean;
    method?: boolean;
    sample_qty?: boolean;
    is_deleted?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
  };

  export type sample_listOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | "id"
    | "request_no"
    | "sent_sample_date"
    | "animal_type"
    | "sample_specimen"
    | "panel"
    | "method"
    | "sample_qty"
    | "is_deleted"
    | "created_at"
    | "updated_at",
    ExtArgs["result"]["sample_list"]
  >;
  export type sample_listInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    document_request?: boolean | document_requestDefaultArgs<ExtArgs>;
  };
  export type sample_listIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    document_request?: boolean | document_requestDefaultArgs<ExtArgs>;
  };
  export type sample_listIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    document_request?: boolean | document_requestDefaultArgs<ExtArgs>;
  };

  export type $sample_listPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "sample_list";
    objects: {
      document_request: Prisma.$document_requestPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        request_no: string;
        sent_sample_date: Date | null;
        animal_type: string | null;
        sample_specimen: string | null;
        panel: string | null;
        method: string | null;
        sample_qty: number | null;
        is_deleted: boolean;
        created_at: Date | null;
        updated_at: Date | null;
      },
      ExtArgs["result"]["sample_list"]
    >;
    composites: {};
  };

  type sample_listGetPayload<
    S extends boolean | null | undefined | sample_listDefaultArgs,
  > = $Result.GetResult<Prisma.$sample_listPayload, S>;

  type sample_listCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    sample_listFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: Sample_listCountAggregateInputType | true;
  };

  export interface sample_listDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["sample_list"];
      meta: { name: "sample_list" };
    };
    /**
     * Find zero or one Sample_list that matches the filter.
     * @param {sample_listFindUniqueArgs} args - Arguments to find a Sample_list
     * @example
     * // Get one Sample_list
     * const sample_list = await prisma.sample_list.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends sample_listFindUniqueArgs>(
      args: SelectSubset<T, sample_listFindUniqueArgs<ExtArgs>>,
    ): Prisma__sample_listClient<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Sample_list that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {sample_listFindUniqueOrThrowArgs} args - Arguments to find a Sample_list
     * @example
     * // Get one Sample_list
     * const sample_list = await prisma.sample_list.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends sample_listFindUniqueOrThrowArgs>(
      args: SelectSubset<T, sample_listFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__sample_listClient<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Sample_list that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sample_listFindFirstArgs} args - Arguments to find a Sample_list
     * @example
     * // Get one Sample_list
     * const sample_list = await prisma.sample_list.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends sample_listFindFirstArgs>(
      args?: SelectSubset<T, sample_listFindFirstArgs<ExtArgs>>,
    ): Prisma__sample_listClient<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Sample_list that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sample_listFindFirstOrThrowArgs} args - Arguments to find a Sample_list
     * @example
     * // Get one Sample_list
     * const sample_list = await prisma.sample_list.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends sample_listFindFirstOrThrowArgs>(
      args?: SelectSubset<T, sample_listFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__sample_listClient<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Sample_lists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sample_listFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sample_lists
     * const sample_lists = await prisma.sample_list.findMany()
     *
     * // Get first 10 Sample_lists
     * const sample_lists = await prisma.sample_list.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const sample_listWithIdOnly = await prisma.sample_list.findMany({ select: { id: true } })
     *
     */
    findMany<T extends sample_listFindManyArgs>(
      args?: SelectSubset<T, sample_listFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Sample_list.
     * @param {sample_listCreateArgs} args - Arguments to create a Sample_list.
     * @example
     * // Create one Sample_list
     * const Sample_list = await prisma.sample_list.create({
     *   data: {
     *     // ... data to create a Sample_list
     *   }
     * })
     *
     */
    create<T extends sample_listCreateArgs>(
      args: SelectSubset<T, sample_listCreateArgs<ExtArgs>>,
    ): Prisma__sample_listClient<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Sample_lists.
     * @param {sample_listCreateManyArgs} args - Arguments to create many Sample_lists.
     * @example
     * // Create many Sample_lists
     * const sample_list = await prisma.sample_list.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends sample_listCreateManyArgs>(
      args?: SelectSubset<T, sample_listCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Sample_lists and returns the data saved in the database.
     * @param {sample_listCreateManyAndReturnArgs} args - Arguments to create many Sample_lists.
     * @example
     * // Create many Sample_lists
     * const sample_list = await prisma.sample_list.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Sample_lists and only return the `id`
     * const sample_listWithIdOnly = await prisma.sample_list.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends sample_listCreateManyAndReturnArgs>(
      args?: SelectSubset<T, sample_listCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Sample_list.
     * @param {sample_listDeleteArgs} args - Arguments to delete one Sample_list.
     * @example
     * // Delete one Sample_list
     * const Sample_list = await prisma.sample_list.delete({
     *   where: {
     *     // ... filter to delete one Sample_list
     *   }
     * })
     *
     */
    delete<T extends sample_listDeleteArgs>(
      args: SelectSubset<T, sample_listDeleteArgs<ExtArgs>>,
    ): Prisma__sample_listClient<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Sample_list.
     * @param {sample_listUpdateArgs} args - Arguments to update one Sample_list.
     * @example
     * // Update one Sample_list
     * const sample_list = await prisma.sample_list.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends sample_listUpdateArgs>(
      args: SelectSubset<T, sample_listUpdateArgs<ExtArgs>>,
    ): Prisma__sample_listClient<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Sample_lists.
     * @param {sample_listDeleteManyArgs} args - Arguments to filter Sample_lists to delete.
     * @example
     * // Delete a few Sample_lists
     * const { count } = await prisma.sample_list.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends sample_listDeleteManyArgs>(
      args?: SelectSubset<T, sample_listDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sample_lists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sample_listUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sample_lists
     * const sample_list = await prisma.sample_list.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends sample_listUpdateManyArgs>(
      args: SelectSubset<T, sample_listUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Sample_lists and returns the data updated in the database.
     * @param {sample_listUpdateManyAndReturnArgs} args - Arguments to update many Sample_lists.
     * @example
     * // Update many Sample_lists
     * const sample_list = await prisma.sample_list.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Sample_lists and only return the `id`
     * const sample_listWithIdOnly = await prisma.sample_list.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends sample_listUpdateManyAndReturnArgs>(
      args: SelectSubset<T, sample_listUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Sample_list.
     * @param {sample_listUpsertArgs} args - Arguments to update or create a Sample_list.
     * @example
     * // Update or create a Sample_list
     * const sample_list = await prisma.sample_list.upsert({
     *   create: {
     *     // ... data to create a Sample_list
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Sample_list we want to update
     *   }
     * })
     */
    upsert<T extends sample_listUpsertArgs>(
      args: SelectSubset<T, sample_listUpsertArgs<ExtArgs>>,
    ): Prisma__sample_listClient<
      $Result.GetResult<
        Prisma.$sample_listPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Sample_lists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sample_listCountArgs} args - Arguments to filter Sample_lists to count.
     * @example
     * // Count the number of Sample_lists
     * const count = await prisma.sample_list.count({
     *   where: {
     *     // ... the filter for the Sample_lists we want to count
     *   }
     * })
     **/
    count<T extends sample_listCountArgs>(
      args?: Subset<T, sample_listCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], Sample_listCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Sample_list.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Sample_listAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends Sample_listAggregateArgs>(
      args: Subset<T, Sample_listAggregateArgs>,
    ): Prisma.PrismaPromise<GetSample_listAggregateType<T>>;

    /**
     * Group by Sample_list.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {sample_listGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends sample_listGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: sample_listGroupByArgs["orderBy"] }
        : { orderBy?: sample_listGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      "Field ",
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, sample_listGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetSample_listGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the sample_list model
     */
    readonly fields: sample_listFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for sample_list.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__sample_listClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    document_request<T extends document_requestDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, document_requestDefaultArgs<ExtArgs>>,
    ): Prisma__document_requestClient<
      | $Result.GetResult<
          Prisma.$document_requestPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the sample_list model
   */
  interface sample_listFieldRefs {
    readonly id: FieldRef<"sample_list", "Int">;
    readonly request_no: FieldRef<"sample_list", "String">;
    readonly sent_sample_date: FieldRef<"sample_list", "DateTime">;
    readonly animal_type: FieldRef<"sample_list", "String">;
    readonly sample_specimen: FieldRef<"sample_list", "String">;
    readonly panel: FieldRef<"sample_list", "String">;
    readonly method: FieldRef<"sample_list", "String">;
    readonly sample_qty: FieldRef<"sample_list", "Int">;
    readonly is_deleted: FieldRef<"sample_list", "Boolean">;
    readonly created_at: FieldRef<"sample_list", "DateTime">;
    readonly updated_at: FieldRef<"sample_list", "DateTime">;
  }

  // Custom InputTypes
  /**
   * sample_list findUnique
   */
  export type sample_listFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * Filter, which sample_list to fetch.
     */
    where: sample_listWhereUniqueInput;
  };

  /**
   * sample_list findUniqueOrThrow
   */
  export type sample_listFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * Filter, which sample_list to fetch.
     */
    where: sample_listWhereUniqueInput;
  };

  /**
   * sample_list findFirst
   */
  export type sample_listFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * Filter, which sample_list to fetch.
     */
    where?: sample_listWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of sample_lists to fetch.
     */
    orderBy?:
      | sample_listOrderByWithRelationInput
      | sample_listOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for sample_lists.
     */
    cursor?: sample_listWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` sample_lists from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` sample_lists.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of sample_lists.
     */
    distinct?: Sample_listScalarFieldEnum | Sample_listScalarFieldEnum[];
  };

  /**
   * sample_list findFirstOrThrow
   */
  export type sample_listFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * Filter, which sample_list to fetch.
     */
    where?: sample_listWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of sample_lists to fetch.
     */
    orderBy?:
      | sample_listOrderByWithRelationInput
      | sample_listOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for sample_lists.
     */
    cursor?: sample_listWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` sample_lists from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` sample_lists.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of sample_lists.
     */
    distinct?: Sample_listScalarFieldEnum | Sample_listScalarFieldEnum[];
  };

  /**
   * sample_list findMany
   */
  export type sample_listFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * Filter, which sample_lists to fetch.
     */
    where?: sample_listWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of sample_lists to fetch.
     */
    orderBy?:
      | sample_listOrderByWithRelationInput
      | sample_listOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing sample_lists.
     */
    cursor?: sample_listWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` sample_lists from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` sample_lists.
     */
    skip?: number;
    distinct?: Sample_listScalarFieldEnum | Sample_listScalarFieldEnum[];
  };

  /**
   * sample_list create
   */
  export type sample_listCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * The data needed to create a sample_list.
     */
    data: XOR<sample_listCreateInput, sample_listUncheckedCreateInput>;
  };

  /**
   * sample_list createMany
   */
  export type sample_listCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many sample_lists.
     */
    data: sample_listCreateManyInput | sample_listCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * sample_list createManyAndReturn
   */
  export type sample_listCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * The data used to create many sample_lists.
     */
    data: sample_listCreateManyInput | sample_listCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * sample_list update
   */
  export type sample_listUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * The data needed to update a sample_list.
     */
    data: XOR<sample_listUpdateInput, sample_listUncheckedUpdateInput>;
    /**
     * Choose, which sample_list to update.
     */
    where: sample_listWhereUniqueInput;
  };

  /**
   * sample_list updateMany
   */
  export type sample_listUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update sample_lists.
     */
    data: XOR<
      sample_listUpdateManyMutationInput,
      sample_listUncheckedUpdateManyInput
    >;
    /**
     * Filter which sample_lists to update
     */
    where?: sample_listWhereInput;
    /**
     * Limit how many sample_lists to update.
     */
    limit?: number;
  };

  /**
   * sample_list updateManyAndReturn
   */
  export type sample_listUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * The data used to update sample_lists.
     */
    data: XOR<
      sample_listUpdateManyMutationInput,
      sample_listUncheckedUpdateManyInput
    >;
    /**
     * Filter which sample_lists to update
     */
    where?: sample_listWhereInput;
    /**
     * Limit how many sample_lists to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * sample_list upsert
   */
  export type sample_listUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * The filter to search for the sample_list to update in case it exists.
     */
    where: sample_listWhereUniqueInput;
    /**
     * In case the sample_list found by the `where` argument doesn't exist, create a new sample_list with this data.
     */
    create: XOR<sample_listCreateInput, sample_listUncheckedCreateInput>;
    /**
     * In case the sample_list was found with the provided `where` argument, update it with this data.
     */
    update: XOR<sample_listUpdateInput, sample_listUncheckedUpdateInput>;
  };

  /**
   * sample_list delete
   */
  export type sample_listDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
    /**
     * Filter which sample_list to delete.
     */
    where: sample_listWhereUniqueInput;
  };

  /**
   * sample_list deleteMany
   */
  export type sample_listDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which sample_lists to delete
     */
    where?: sample_listWhereInput;
    /**
     * Limit how many sample_lists to delete.
     */
    limit?: number;
  };

  /**
   * sample_list without action
   */
  export type sample_listDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the sample_list
     */
    select?: sample_listSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the sample_list
     */
    omit?: sample_listOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: sample_listInclude<ExtArgs> | null;
  };

  /**
   * Model users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null;
    _avg: UsersAvgAggregateOutputType | null;
    _sum: UsersSumAggregateOutputType | null;
    _min: UsersMinAggregateOutputType | null;
    _max: UsersMaxAggregateOutputType | null;
  };

  export type UsersAvgAggregateOutputType = {
    id: number | null;
  };

  export type UsersSumAggregateOutputType = {
    id: number | null;
  };

  export type UsersMinAggregateOutputType = {
    id: number | null;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    password: string | null;
    role: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type UsersMaxAggregateOutputType = {
    id: number | null;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    password: string | null;
    role: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type UsersCountAggregateOutputType = {
    id: number;
    username: number;
    first_name: number;
    last_name: number;
    email: number;
    password: number;
    role: number;
    is_active: number;
    created_at: number;
    updated_at: number;
    _all: number;
  };

  export type UsersAvgAggregateInputType = {
    id?: true;
  };

  export type UsersSumAggregateInputType = {
    id?: true;
  };

  export type UsersMinAggregateInputType = {
    id?: true;
    username?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    password?: true;
    role?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type UsersMaxAggregateInputType = {
    id?: true;
    username?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    password?: true;
    role?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type UsersCountAggregateInputType = {
    id?: true;
    username?: true;
    first_name?: true;
    last_name?: true;
    email?: true;
    password?: true;
    role?: true;
    is_active?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
  };

  export type UsersAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which users to aggregate.
     */
    where?: usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned users
     **/
    _count?: true | UsersCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: UsersAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: UsersSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UsersMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UsersMaxAggregateInputType;
  };

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
    [P in keyof T & keyof AggregateUsers]: P extends "_count" | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>;
  };

  export type usersGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: usersWhereInput;
    orderBy?:
      | usersOrderByWithAggregationInput
      | usersOrderByWithAggregationInput[];
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum;
    having?: usersScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UsersCountAggregateInputType | true;
    _avg?: UsersAvgAggregateInputType;
    _sum?: UsersSumAggregateInputType;
    _min?: UsersMinAggregateInputType;
    _max?: UsersMaxAggregateInputType;
  };

  export type UsersGroupByOutputType = {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    password: string;
    role: string | null;
    is_active: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
    _count: UsersCountAggregateOutputType | null;
    _avg: UsersAvgAggregateOutputType | null;
    _sum: UsersSumAggregateOutputType | null;
    _min: UsersMinAggregateOutputType | null;
    _max: UsersMaxAggregateOutputType | null;
  };

  type GetUsersGroupByPayload<T extends usersGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<UsersGroupByOutputType, T["by"]> & {
          [P in keyof T & keyof UsersGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>;
        }
      >
    >;

  export type usersSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      username?: boolean;
      first_name?: boolean;
      last_name?: boolean;
      email?: boolean;
      password?: boolean;
      role?: boolean;
      is_active?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      worker_profiles?: boolean | users$worker_profilesArgs<ExtArgs>;
      _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["users"]
  >;

  export type usersSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      username?: boolean;
      first_name?: boolean;
      last_name?: boolean;
      email?: boolean;
      password?: boolean;
      role?: boolean;
      is_active?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["users"]
  >;

  export type usersSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      username?: boolean;
      first_name?: boolean;
      last_name?: boolean;
      email?: boolean;
      password?: boolean;
      role?: boolean;
      is_active?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
    },
    ExtArgs["result"]["users"]
  >;

  export type usersSelectScalar = {
    id?: boolean;
    username?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    email?: boolean;
    password?: boolean;
    role?: boolean;
    is_active?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
  };

  export type usersOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | "id"
    | "username"
    | "first_name"
    | "last_name"
    | "email"
    | "password"
    | "role"
    | "is_active"
    | "created_at"
    | "updated_at",
    ExtArgs["result"]["users"]
  >;
  export type usersInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    worker_profiles?: boolean | users$worker_profilesArgs<ExtArgs>;
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type usersIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type usersIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $usersPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "users";
    objects: {
      worker_profiles: Prisma.$worker_profilesPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        username: string;
        first_name: string | null;
        last_name: string | null;
        email: string;
        password: string;
        role: string | null;
        is_active: boolean | null;
        created_at: Date | null;
        updated_at: Date | null;
      },
      ExtArgs["result"]["users"]
    >;
    composites: {};
  };

  type usersGetPayload<
    S extends boolean | null | undefined | usersDefaultArgs,
  > = $Result.GetResult<Prisma.$usersPayload, S>;

  type usersCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<usersFindManyArgs, "select" | "include" | "distinct" | "omit"> & {
    select?: UsersCountAggregateInputType | true;
  };

  export interface usersDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["users"];
      meta: { name: "users" };
    };
    /**
     * Find zero or one Users that matches the filter.
     * @param {usersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usersFindUniqueArgs>(
      args: SelectSubset<T, usersFindUniqueArgs<ExtArgs>>,
    ): Prisma__usersClient<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usersFindUniqueOrThrowArgs>(
      args: SelectSubset<T, usersFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__usersClient<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usersFindFirstArgs>(
      args?: SelectSubset<T, usersFindFirstArgs<ExtArgs>>,
    ): Prisma__usersClient<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usersFindFirstOrThrowArgs>(
      args?: SelectSubset<T, usersFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__usersClient<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     *
     */
    findMany<T extends usersFindManyArgs>(
      args?: SelectSubset<T, usersFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Users.
     * @param {usersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     *
     */
    create<T extends usersCreateArgs>(
      args: SelectSubset<T, usersCreateArgs<ExtArgs>>,
    ): Prisma__usersClient<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {usersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends usersCreateManyArgs>(
      args?: SelectSubset<T, usersCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {usersCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends usersCreateManyAndReturnArgs>(
      args?: SelectSubset<T, usersCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Users.
     * @param {usersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     *
     */
    delete<T extends usersDeleteArgs>(
      args: SelectSubset<T, usersDeleteArgs<ExtArgs>>,
    ): Prisma__usersClient<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Users.
     * @param {usersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends usersUpdateArgs>(
      args: SelectSubset<T, usersUpdateArgs<ExtArgs>>,
    ): Prisma__usersClient<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {usersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends usersDeleteManyArgs>(
      args?: SelectSubset<T, usersDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends usersUpdateManyArgs>(
      args: SelectSubset<T, usersUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {usersUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const usersWithIdOnly = await prisma.users.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends usersUpdateManyAndReturnArgs>(
      args: SelectSubset<T, usersUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Users.
     * @param {usersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends usersUpsertArgs>(
      args: SelectSubset<T, usersUpsertArgs<ExtArgs>>,
    ): Prisma__usersClient<
      $Result.GetResult<
        Prisma.$usersPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends usersCountArgs>(
      args?: Subset<T, usersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], UsersCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UsersAggregateArgs>(
      args: Subset<T, UsersAggregateArgs>,
    ): Prisma.PrismaPromise<GetUsersAggregateType<T>>;

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends usersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usersGroupByArgs["orderBy"] }
        : { orderBy?: usersGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      "Field ",
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, usersGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetUsersGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the users model
     */
    readonly fields: usersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usersClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    worker_profiles<T extends users$worker_profilesArgs<ExtArgs> = {}>(
      args?: Subset<T, users$worker_profilesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$worker_profilesPayload<ExtArgs>,
          T,
          "findMany",
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the users model
   */
  interface usersFieldRefs {
    readonly id: FieldRef<"users", "Int">;
    readonly username: FieldRef<"users", "String">;
    readonly first_name: FieldRef<"users", "String">;
    readonly last_name: FieldRef<"users", "String">;
    readonly email: FieldRef<"users", "String">;
    readonly password: FieldRef<"users", "String">;
    readonly role: FieldRef<"users", "String">;
    readonly is_active: FieldRef<"users", "Boolean">;
    readonly created_at: FieldRef<"users", "DateTime">;
    readonly updated_at: FieldRef<"users", "DateTime">;
  }

  // Custom InputTypes
  /**
   * users findUnique
   */
  export type usersFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput;
  };

  /**
   * users findUniqueOrThrow
   */
  export type usersFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where: usersWhereUniqueInput;
  };

  /**
   * users findFirst
   */
  export type usersFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[];
  };

  /**
   * users findFirstOrThrow
   */
  export type usersFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for users.
     */
    cursor?: usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[];
  };

  /**
   * users findMany
   */
  export type usersFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * Filter, which users to fetch.
     */
    where?: usersWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of users to fetch.
     */
    orderBy?: usersOrderByWithRelationInput | usersOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing users.
     */
    cursor?: usersWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` users.
     */
    skip?: number;
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[];
  };

  /**
   * users create
   */
  export type usersCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * The data needed to create a users.
     */
    data: XOR<usersCreateInput, usersUncheckedCreateInput>;
  };

  /**
   * users createMany
   */
  export type usersCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * users createManyAndReturn
   */
  export type usersCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * The data used to create many users.
     */
    data: usersCreateManyInput | usersCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * users update
   */
  export type usersUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * The data needed to update a users.
     */
    data: XOR<usersUpdateInput, usersUncheckedUpdateInput>;
    /**
     * Choose, which users to update.
     */
    where: usersWhereUniqueInput;
  };

  /**
   * users updateMany
   */
  export type usersUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>;
    /**
     * Filter which users to update
     */
    where?: usersWhereInput;
    /**
     * Limit how many users to update.
     */
    limit?: number;
  };

  /**
   * users updateManyAndReturn
   */
  export type usersUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * The data used to update users.
     */
    data: XOR<usersUpdateManyMutationInput, usersUncheckedUpdateManyInput>;
    /**
     * Filter which users to update
     */
    where?: usersWhereInput;
    /**
     * Limit how many users to update.
     */
    limit?: number;
  };

  /**
   * users upsert
   */
  export type usersUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * The filter to search for the users to update in case it exists.
     */
    where: usersWhereUniqueInput;
    /**
     * In case the users found by the `where` argument doesn't exist, create a new users with this data.
     */
    create: XOR<usersCreateInput, usersUncheckedCreateInput>;
    /**
     * In case the users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usersUpdateInput, usersUncheckedUpdateInput>;
  };

  /**
   * users delete
   */
  export type usersDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
    /**
     * Filter which users to delete.
     */
    where: usersWhereUniqueInput;
  };

  /**
   * users deleteMany
   */
  export type usersDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which users to delete
     */
    where?: usersWhereInput;
    /**
     * Limit how many users to delete.
     */
    limit?: number;
  };

  /**
   * users.worker_profiles
   */
  export type users$worker_profilesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    where?: worker_profilesWhereInput;
    orderBy?:
      | worker_profilesOrderByWithRelationInput
      | worker_profilesOrderByWithRelationInput[];
    cursor?: worker_profilesWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | Worker_profilesScalarFieldEnum
      | Worker_profilesScalarFieldEnum[];
  };

  /**
   * users without action
   */
  export type usersDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the users
     */
    select?: usersSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the users
     */
    omit?: usersOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usersInclude<ExtArgs> | null;
  };

  /**
   * Model worker_profiles
   */

  export type AggregateWorker_profiles = {
    _count: Worker_profilesCountAggregateOutputType | null;
    _avg: Worker_profilesAvgAggregateOutputType | null;
    _sum: Worker_profilesSumAggregateOutputType | null;
    _min: Worker_profilesMinAggregateOutputType | null;
    _max: Worker_profilesMaxAggregateOutputType | null;
  };

  export type Worker_profilesAvgAggregateOutputType = {
    id: number | null;
    user_id: number | null;
  };

  export type Worker_profilesSumAggregateOutputType = {
    id: number | null;
    user_id: number | null;
  };

  export type Worker_profilesMinAggregateOutputType = {
    id: number | null;
    id_card_number: string | null;
    user_id: number | null;
    title: string | null;
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    mobile_phone_number: string | null;
    email: string | null;
    id_card_file_path: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type Worker_profilesMaxAggregateOutputType = {
    id: number | null;
    id_card_number: string | null;
    user_id: number | null;
    title: string | null;
    first_name: string | null;
    last_name: string | null;
    phone_number: string | null;
    mobile_phone_number: string | null;
    email: string | null;
    id_card_file_path: string | null;
    created_at: Date | null;
    updated_at: Date | null;
  };

  export type Worker_profilesCountAggregateOutputType = {
    id: number;
    id_card_number: number;
    user_id: number;
    title: number;
    first_name: number;
    last_name: number;
    phone_number: number;
    mobile_phone_number: number;
    email: number;
    id_card_file_path: number;
    created_at: number;
    updated_at: number;
    _all: number;
  };

  export type Worker_profilesAvgAggregateInputType = {
    id?: true;
    user_id?: true;
  };

  export type Worker_profilesSumAggregateInputType = {
    id?: true;
    user_id?: true;
  };

  export type Worker_profilesMinAggregateInputType = {
    id?: true;
    id_card_number?: true;
    user_id?: true;
    title?: true;
    first_name?: true;
    last_name?: true;
    phone_number?: true;
    mobile_phone_number?: true;
    email?: true;
    id_card_file_path?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type Worker_profilesMaxAggregateInputType = {
    id?: true;
    id_card_number?: true;
    user_id?: true;
    title?: true;
    first_name?: true;
    last_name?: true;
    phone_number?: true;
    mobile_phone_number?: true;
    email?: true;
    id_card_file_path?: true;
    created_at?: true;
    updated_at?: true;
  };

  export type Worker_profilesCountAggregateInputType = {
    id?: true;
    id_card_number?: true;
    user_id?: true;
    title?: true;
    first_name?: true;
    last_name?: true;
    phone_number?: true;
    mobile_phone_number?: true;
    email?: true;
    id_card_file_path?: true;
    created_at?: true;
    updated_at?: true;
    _all?: true;
  };

  export type Worker_profilesAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which worker_profiles to aggregate.
     */
    where?: worker_profilesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of worker_profiles to fetch.
     */
    orderBy?:
      | worker_profilesOrderByWithRelationInput
      | worker_profilesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: worker_profilesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` worker_profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` worker_profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned worker_profiles
     **/
    _count?: true | Worker_profilesCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: Worker_profilesAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: Worker_profilesSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: Worker_profilesMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: Worker_profilesMaxAggregateInputType;
  };

  export type GetWorker_profilesAggregateType<
    T extends Worker_profilesAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateWorker_profiles]: P extends
      | "_count"
      | "count"
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorker_profiles[P]>
      : GetScalarType<T[P], AggregateWorker_profiles[P]>;
  };

  export type worker_profilesGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: worker_profilesWhereInput;
    orderBy?:
      | worker_profilesOrderByWithAggregationInput
      | worker_profilesOrderByWithAggregationInput[];
    by: Worker_profilesScalarFieldEnum[] | Worker_profilesScalarFieldEnum;
    having?: worker_profilesScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: Worker_profilesCountAggregateInputType | true;
    _avg?: Worker_profilesAvgAggregateInputType;
    _sum?: Worker_profilesSumAggregateInputType;
    _min?: Worker_profilesMinAggregateInputType;
    _max?: Worker_profilesMaxAggregateInputType;
  };

  export type Worker_profilesGroupByOutputType = {
    id: number;
    id_card_number: string;
    user_id: number;
    title: string | null;
    first_name: string;
    last_name: string;
    phone_number: string | null;
    mobile_phone_number: string;
    email: string | null;
    id_card_file_path: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    _count: Worker_profilesCountAggregateOutputType | null;
    _avg: Worker_profilesAvgAggregateOutputType | null;
    _sum: Worker_profilesSumAggregateOutputType | null;
    _min: Worker_profilesMinAggregateOutputType | null;
    _max: Worker_profilesMaxAggregateOutputType | null;
  };

  type GetWorker_profilesGroupByPayload<T extends worker_profilesGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<Worker_profilesGroupByOutputType, T["by"]> & {
          [P in keyof T &
            keyof Worker_profilesGroupByOutputType]: P extends "_count"
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Worker_profilesGroupByOutputType[P]>
            : GetScalarType<T[P], Worker_profilesGroupByOutputType[P]>;
        }
      >
    >;

  export type worker_profilesSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      id_card_number?: boolean;
      user_id?: boolean;
      title?: boolean;
      first_name?: boolean;
      last_name?: boolean;
      phone_number?: boolean;
      mobile_phone_number?: boolean;
      email?: boolean;
      id_card_file_path?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      users?: boolean | usersDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["worker_profiles"]
  >;

  export type worker_profilesSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      id_card_number?: boolean;
      user_id?: boolean;
      title?: boolean;
      first_name?: boolean;
      last_name?: boolean;
      phone_number?: boolean;
      mobile_phone_number?: boolean;
      email?: boolean;
      id_card_file_path?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      users?: boolean | usersDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["worker_profiles"]
  >;

  export type worker_profilesSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      id_card_number?: boolean;
      user_id?: boolean;
      title?: boolean;
      first_name?: boolean;
      last_name?: boolean;
      phone_number?: boolean;
      mobile_phone_number?: boolean;
      email?: boolean;
      id_card_file_path?: boolean;
      created_at?: boolean;
      updated_at?: boolean;
      users?: boolean | usersDefaultArgs<ExtArgs>;
    },
    ExtArgs["result"]["worker_profiles"]
  >;

  export type worker_profilesSelectScalar = {
    id?: boolean;
    id_card_number?: boolean;
    user_id?: boolean;
    title?: boolean;
    first_name?: boolean;
    last_name?: boolean;
    phone_number?: boolean;
    mobile_phone_number?: boolean;
    email?: boolean;
    id_card_file_path?: boolean;
    created_at?: boolean;
    updated_at?: boolean;
  };

  export type worker_profilesOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | "id"
    | "id_card_number"
    | "user_id"
    | "title"
    | "first_name"
    | "last_name"
    | "phone_number"
    | "mobile_phone_number"
    | "email"
    | "id_card_file_path"
    | "created_at"
    | "updated_at",
    ExtArgs["result"]["worker_profiles"]
  >;
  export type worker_profilesInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    users?: boolean | usersDefaultArgs<ExtArgs>;
  };
  export type worker_profilesIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    users?: boolean | usersDefaultArgs<ExtArgs>;
  };
  export type worker_profilesIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    users?: boolean | usersDefaultArgs<ExtArgs>;
  };

  export type $worker_profilesPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: "worker_profiles";
    objects: {
      users: Prisma.$usersPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: number;
        id_card_number: string;
        user_id: number;
        title: string | null;
        first_name: string;
        last_name: string;
        phone_number: string | null;
        mobile_phone_number: string;
        email: string | null;
        id_card_file_path: string | null;
        created_at: Date | null;
        updated_at: Date | null;
      },
      ExtArgs["result"]["worker_profiles"]
    >;
    composites: {};
  };

  type worker_profilesGetPayload<
    S extends boolean | null | undefined | worker_profilesDefaultArgs,
  > = $Result.GetResult<Prisma.$worker_profilesPayload, S>;

  type worker_profilesCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    worker_profilesFindManyArgs,
    "select" | "include" | "distinct" | "omit"
  > & {
    select?: Worker_profilesCountAggregateInputType | true;
  };

  export interface worker_profilesDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>["model"]["worker_profiles"];
      meta: { name: "worker_profiles" };
    };
    /**
     * Find zero or one Worker_profiles that matches the filter.
     * @param {worker_profilesFindUniqueArgs} args - Arguments to find a Worker_profiles
     * @example
     * // Get one Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends worker_profilesFindUniqueArgs>(
      args: SelectSubset<T, worker_profilesFindUniqueArgs<ExtArgs>>,
    ): Prisma__worker_profilesClient<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "findUnique",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Worker_profiles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {worker_profilesFindUniqueOrThrowArgs} args - Arguments to find a Worker_profiles
     * @example
     * // Get one Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends worker_profilesFindUniqueOrThrowArgs>(
      args: SelectSubset<T, worker_profilesFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__worker_profilesClient<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "findUniqueOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Worker_profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {worker_profilesFindFirstArgs} args - Arguments to find a Worker_profiles
     * @example
     * // Get one Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends worker_profilesFindFirstArgs>(
      args?: SelectSubset<T, worker_profilesFindFirstArgs<ExtArgs>>,
    ): Prisma__worker_profilesClient<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "findFirst",
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Worker_profiles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {worker_profilesFindFirstOrThrowArgs} args - Arguments to find a Worker_profiles
     * @example
     * // Get one Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends worker_profilesFindFirstOrThrowArgs>(
      args?: SelectSubset<T, worker_profilesFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__worker_profilesClient<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "findFirstOrThrow",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Worker_profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {worker_profilesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.findMany()
     *
     * // Get first 10 Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const worker_profilesWithIdOnly = await prisma.worker_profiles.findMany({ select: { id: true } })
     *
     */
    findMany<T extends worker_profilesFindManyArgs>(
      args?: SelectSubset<T, worker_profilesFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "findMany",
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Worker_profiles.
     * @param {worker_profilesCreateArgs} args - Arguments to create a Worker_profiles.
     * @example
     * // Create one Worker_profiles
     * const Worker_profiles = await prisma.worker_profiles.create({
     *   data: {
     *     // ... data to create a Worker_profiles
     *   }
     * })
     *
     */
    create<T extends worker_profilesCreateArgs>(
      args: SelectSubset<T, worker_profilesCreateArgs<ExtArgs>>,
    ): Prisma__worker_profilesClient<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "create",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Worker_profiles.
     * @param {worker_profilesCreateManyArgs} args - Arguments to create many Worker_profiles.
     * @example
     * // Create many Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends worker_profilesCreateManyArgs>(
      args?: SelectSubset<T, worker_profilesCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Worker_profiles and returns the data saved in the database.
     * @param {worker_profilesCreateManyAndReturnArgs} args - Arguments to create many Worker_profiles.
     * @example
     * // Create many Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Worker_profiles and only return the `id`
     * const worker_profilesWithIdOnly = await prisma.worker_profiles.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends worker_profilesCreateManyAndReturnArgs>(
      args?: SelectSubset<T, worker_profilesCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "createManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Worker_profiles.
     * @param {worker_profilesDeleteArgs} args - Arguments to delete one Worker_profiles.
     * @example
     * // Delete one Worker_profiles
     * const Worker_profiles = await prisma.worker_profiles.delete({
     *   where: {
     *     // ... filter to delete one Worker_profiles
     *   }
     * })
     *
     */
    delete<T extends worker_profilesDeleteArgs>(
      args: SelectSubset<T, worker_profilesDeleteArgs<ExtArgs>>,
    ): Prisma__worker_profilesClient<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "delete",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Worker_profiles.
     * @param {worker_profilesUpdateArgs} args - Arguments to update one Worker_profiles.
     * @example
     * // Update one Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends worker_profilesUpdateArgs>(
      args: SelectSubset<T, worker_profilesUpdateArgs<ExtArgs>>,
    ): Prisma__worker_profilesClient<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "update",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Worker_profiles.
     * @param {worker_profilesDeleteManyArgs} args - Arguments to filter Worker_profiles to delete.
     * @example
     * // Delete a few Worker_profiles
     * const { count } = await prisma.worker_profiles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends worker_profilesDeleteManyArgs>(
      args?: SelectSubset<T, worker_profilesDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Worker_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {worker_profilesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends worker_profilesUpdateManyArgs>(
      args: SelectSubset<T, worker_profilesUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Worker_profiles and returns the data updated in the database.
     * @param {worker_profilesUpdateManyAndReturnArgs} args - Arguments to update many Worker_profiles.
     * @example
     * // Update many Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Worker_profiles and only return the `id`
     * const worker_profilesWithIdOnly = await prisma.worker_profiles.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends worker_profilesUpdateManyAndReturnArgs>(
      args: SelectSubset<T, worker_profilesUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "updateManyAndReturn",
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Worker_profiles.
     * @param {worker_profilesUpsertArgs} args - Arguments to update or create a Worker_profiles.
     * @example
     * // Update or create a Worker_profiles
     * const worker_profiles = await prisma.worker_profiles.upsert({
     *   create: {
     *     // ... data to create a Worker_profiles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Worker_profiles we want to update
     *   }
     * })
     */
    upsert<T extends worker_profilesUpsertArgs>(
      args: SelectSubset<T, worker_profilesUpsertArgs<ExtArgs>>,
    ): Prisma__worker_profilesClient<
      $Result.GetResult<
        Prisma.$worker_profilesPayload<ExtArgs>,
        T,
        "upsert",
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Worker_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {worker_profilesCountArgs} args - Arguments to filter Worker_profiles to count.
     * @example
     * // Count the number of Worker_profiles
     * const count = await prisma.worker_profiles.count({
     *   where: {
     *     // ... the filter for the Worker_profiles we want to count
     *   }
     * })
     **/
    count<T extends worker_profilesCountArgs>(
      args?: Subset<T, worker_profilesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<"select", any>
        ? T["select"] extends true
          ? number
          : GetScalarType<T["select"], Worker_profilesCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Worker_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Worker_profilesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends Worker_profilesAggregateArgs>(
      args: Subset<T, Worker_profilesAggregateArgs>,
    ): Prisma.PrismaPromise<GetWorker_profilesAggregateType<T>>;

    /**
     * Group by Worker_profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {worker_profilesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends worker_profilesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<"skip", Keys<T>>,
        Extends<"take", Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: worker_profilesGroupByArgs["orderBy"] }
        : { orderBy?: worker_profilesGroupByArgs["orderBy"] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T["orderBy"]>>
      >,
      ByFields extends MaybeTupleToUnion<T["by"]>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T["having"]>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T["by"] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      "Field ",
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : "take" extends Keys<T>
            ? "orderBy" extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : "skip" extends Keys<T>
              ? "orderBy" extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, worker_profilesGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetWorker_profilesGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the worker_profiles model
     */
    readonly fields: worker_profilesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for worker_profiles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__worker_profilesClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends usersDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, usersDefaultArgs<ExtArgs>>,
    ): Prisma__usersClient<
      | $Result.GetResult<
          Prisma.$usersPayload<ExtArgs>,
          T,
          "findUniqueOrThrow",
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the worker_profiles model
   */
  interface worker_profilesFieldRefs {
    readonly id: FieldRef<"worker_profiles", "Int">;
    readonly id_card_number: FieldRef<"worker_profiles", "String">;
    readonly user_id: FieldRef<"worker_profiles", "Int">;
    readonly title: FieldRef<"worker_profiles", "String">;
    readonly first_name: FieldRef<"worker_profiles", "String">;
    readonly last_name: FieldRef<"worker_profiles", "String">;
    readonly phone_number: FieldRef<"worker_profiles", "String">;
    readonly mobile_phone_number: FieldRef<"worker_profiles", "String">;
    readonly email: FieldRef<"worker_profiles", "String">;
    readonly id_card_file_path: FieldRef<"worker_profiles", "String">;
    readonly created_at: FieldRef<"worker_profiles", "DateTime">;
    readonly updated_at: FieldRef<"worker_profiles", "DateTime">;
  }

  // Custom InputTypes
  /**
   * worker_profiles findUnique
   */
  export type worker_profilesFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * Filter, which worker_profiles to fetch.
     */
    where: worker_profilesWhereUniqueInput;
  };

  /**
   * worker_profiles findUniqueOrThrow
   */
  export type worker_profilesFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * Filter, which worker_profiles to fetch.
     */
    where: worker_profilesWhereUniqueInput;
  };

  /**
   * worker_profiles findFirst
   */
  export type worker_profilesFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * Filter, which worker_profiles to fetch.
     */
    where?: worker_profilesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of worker_profiles to fetch.
     */
    orderBy?:
      | worker_profilesOrderByWithRelationInput
      | worker_profilesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for worker_profiles.
     */
    cursor?: worker_profilesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` worker_profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` worker_profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of worker_profiles.
     */
    distinct?:
      | Worker_profilesScalarFieldEnum
      | Worker_profilesScalarFieldEnum[];
  };

  /**
   * worker_profiles findFirstOrThrow
   */
  export type worker_profilesFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * Filter, which worker_profiles to fetch.
     */
    where?: worker_profilesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of worker_profiles to fetch.
     */
    orderBy?:
      | worker_profilesOrderByWithRelationInput
      | worker_profilesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for worker_profiles.
     */
    cursor?: worker_profilesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` worker_profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` worker_profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of worker_profiles.
     */
    distinct?:
      | Worker_profilesScalarFieldEnum
      | Worker_profilesScalarFieldEnum[];
  };

  /**
   * worker_profiles findMany
   */
  export type worker_profilesFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * Filter, which worker_profiles to fetch.
     */
    where?: worker_profilesWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of worker_profiles to fetch.
     */
    orderBy?:
      | worker_profilesOrderByWithRelationInput
      | worker_profilesOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing worker_profiles.
     */
    cursor?: worker_profilesWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` worker_profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` worker_profiles.
     */
    skip?: number;
    distinct?:
      | Worker_profilesScalarFieldEnum
      | Worker_profilesScalarFieldEnum[];
  };

  /**
   * worker_profiles create
   */
  export type worker_profilesCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * The data needed to create a worker_profiles.
     */
    data: XOR<worker_profilesCreateInput, worker_profilesUncheckedCreateInput>;
  };

  /**
   * worker_profiles createMany
   */
  export type worker_profilesCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many worker_profiles.
     */
    data: worker_profilesCreateManyInput | worker_profilesCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * worker_profiles createManyAndReturn
   */
  export type worker_profilesCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * The data used to create many worker_profiles.
     */
    data: worker_profilesCreateManyInput | worker_profilesCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * worker_profiles update
   */
  export type worker_profilesUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * The data needed to update a worker_profiles.
     */
    data: XOR<worker_profilesUpdateInput, worker_profilesUncheckedUpdateInput>;
    /**
     * Choose, which worker_profiles to update.
     */
    where: worker_profilesWhereUniqueInput;
  };

  /**
   * worker_profiles updateMany
   */
  export type worker_profilesUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update worker_profiles.
     */
    data: XOR<
      worker_profilesUpdateManyMutationInput,
      worker_profilesUncheckedUpdateManyInput
    >;
    /**
     * Filter which worker_profiles to update
     */
    where?: worker_profilesWhereInput;
    /**
     * Limit how many worker_profiles to update.
     */
    limit?: number;
  };

  /**
   * worker_profiles updateManyAndReturn
   */
  export type worker_profilesUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * The data used to update worker_profiles.
     */
    data: XOR<
      worker_profilesUpdateManyMutationInput,
      worker_profilesUncheckedUpdateManyInput
    >;
    /**
     * Filter which worker_profiles to update
     */
    where?: worker_profilesWhereInput;
    /**
     * Limit how many worker_profiles to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * worker_profiles upsert
   */
  export type worker_profilesUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * The filter to search for the worker_profiles to update in case it exists.
     */
    where: worker_profilesWhereUniqueInput;
    /**
     * In case the worker_profiles found by the `where` argument doesn't exist, create a new worker_profiles with this data.
     */
    create: XOR<
      worker_profilesCreateInput,
      worker_profilesUncheckedCreateInput
    >;
    /**
     * In case the worker_profiles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      worker_profilesUpdateInput,
      worker_profilesUncheckedUpdateInput
    >;
  };

  /**
   * worker_profiles delete
   */
  export type worker_profilesDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
    /**
     * Filter which worker_profiles to delete.
     */
    where: worker_profilesWhereUniqueInput;
  };

  /**
   * worker_profiles deleteMany
   */
  export type worker_profilesDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which worker_profiles to delete
     */
    where?: worker_profilesWhereInput;
    /**
     * Limit how many worker_profiles to delete.
     */
    limit?: number;
  };

  /**
   * worker_profiles without action
   */
  export type worker_profilesDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the worker_profiles
     */
    select?: worker_profilesSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the worker_profiles
     */
    omit?: worker_profilesOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: worker_profilesInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: "ReadUncommitted";
    ReadCommitted: "ReadCommitted";
    RepeatableRead: "RepeatableRead";
    Serializable: "Serializable";
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const CompaniesScalarFieldEnum: {
    id: "id";
    company_name_en: "company_name_en";
    company_name_th: "company_name_th";
    tax_id: "tax_id";
    address: "address";
    sub_district: "sub_district";
    district: "district";
    province: "province";
    postal_code: "postal_code";
    telephone: "telephone";
    fax_number: "fax_number";
    created_at: "created_at";
    updated_at: "updated_at";
  };

  export type CompaniesScalarFieldEnum =
    (typeof CompaniesScalarFieldEnum)[keyof typeof CompaniesScalarFieldEnum];

  export const Document_requestScalarFieldEnum: {
    id: "id";
    request_no: "request_no";
    request_date: "request_date";
    user_id: "user_id";
    company_id: "company_id";
    document_type: "document_type";
    description: "description";
    status: "status";
    paid_status: "paid_status";
    created_at: "created_at";
    updated_at: "updated_at";
  };

  export type Document_requestScalarFieldEnum =
    (typeof Document_requestScalarFieldEnum)[keyof typeof Document_requestScalarFieldEnum];

  export const Knex_migrationsScalarFieldEnum: {
    id: "id";
    name: "name";
    batch: "batch";
    migration_time: "migration_time";
  };

  export type Knex_migrationsScalarFieldEnum =
    (typeof Knex_migrationsScalarFieldEnum)[keyof typeof Knex_migrationsScalarFieldEnum];

  export const Knex_migrations_lockScalarFieldEnum: {
    index: "index";
    is_locked: "is_locked";
  };

  export type Knex_migrations_lockScalarFieldEnum =
    (typeof Knex_migrations_lockScalarFieldEnum)[keyof typeof Knex_migrations_lockScalarFieldEnum];

  export const Receipt_addressesScalarFieldEnum: {
    id: "id";
    address: "address";
    province: "province";
    district: "district";
    sub_district: "sub_district";
    postal_code: "postal_code";
    telephone: "telephone";
    fax_number: "fax_number";
    created_at: "created_at";
    updated_at: "updated_at";
  };

  export type Receipt_addressesScalarFieldEnum =
    (typeof Receipt_addressesScalarFieldEnum)[keyof typeof Receipt_addressesScalarFieldEnum];

  export const Sample_listScalarFieldEnum: {
    id: "id";
    request_no: "request_no";
    sent_sample_date: "sent_sample_date";
    animal_type: "animal_type";
    sample_specimen: "sample_specimen";
    panel: "panel";
    method: "method";
    sample_qty: "sample_qty";
    is_deleted: "is_deleted";
    created_at: "created_at";
    updated_at: "updated_at";
  };

  export type Sample_listScalarFieldEnum =
    (typeof Sample_listScalarFieldEnum)[keyof typeof Sample_listScalarFieldEnum];

  export const UsersScalarFieldEnum: {
    id: "id";
    username: "username";
    first_name: "first_name";
    last_name: "last_name";
    email: "email";
    password: "password";
    role: "role";
    is_active: "is_active";
    created_at: "created_at";
    updated_at: "updated_at";
  };

  export type UsersScalarFieldEnum =
    (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum];

  export const Worker_profilesScalarFieldEnum: {
    id: "id";
    id_card_number: "id_card_number";
    user_id: "user_id";
    title: "title";
    first_name: "first_name";
    last_name: "last_name";
    phone_number: "phone_number";
    mobile_phone_number: "mobile_phone_number";
    email: "email";
    id_card_file_path: "id_card_file_path";
    created_at: "created_at";
    updated_at: "updated_at";
  };

  export type Worker_profilesScalarFieldEnum =
    (typeof Worker_profilesScalarFieldEnum)[keyof typeof Worker_profilesScalarFieldEnum];

  export const SortOrder: {
    asc: "asc";
    desc: "desc";
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const QueryMode: {
    default: "default";
    insensitive: "insensitive";
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: "first";
    last: "last";
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "Int"
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "Int[]"
  >;

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "String"
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "String[]"
  >;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "DateTime"
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "DateTime[]"
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "Boolean"
  >;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "Float"
  >;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    "Float[]"
  >;

  /**
   * Deep Input Types
   */

  export type companiesWhereInput = {
    AND?: companiesWhereInput | companiesWhereInput[];
    OR?: companiesWhereInput[];
    NOT?: companiesWhereInput | companiesWhereInput[];
    id?: IntFilter<"companies"> | number;
    company_name_en?: StringFilter<"companies"> | string;
    company_name_th?: StringFilter<"companies"> | string;
    tax_id?: StringNullableFilter<"companies"> | string | null;
    address?: StringFilter<"companies"> | string;
    sub_district?: StringFilter<"companies"> | string;
    district?: StringFilter<"companies"> | string;
    province?: StringFilter<"companies"> | string;
    postal_code?: StringFilter<"companies"> | string;
    telephone?: StringNullableFilter<"companies"> | string | null;
    fax_number?: StringNullableFilter<"companies"> | string | null;
    created_at?: DateTimeNullableFilter<"companies"> | Date | string | null;
    updated_at?: DateTimeNullableFilter<"companies"> | Date | string | null;
  };

  export type companiesOrderByWithRelationInput = {
    id?: SortOrder;
    company_name_en?: SortOrder;
    company_name_th?: SortOrder;
    tax_id?: SortOrderInput | SortOrder;
    address?: SortOrder;
    sub_district?: SortOrder;
    district?: SortOrder;
    province?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrderInput | SortOrder;
    fax_number?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
  };

  export type companiesWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      AND?: companiesWhereInput | companiesWhereInput[];
      OR?: companiesWhereInput[];
      NOT?: companiesWhereInput | companiesWhereInput[];
      company_name_en?: StringFilter<"companies"> | string;
      company_name_th?: StringFilter<"companies"> | string;
      tax_id?: StringNullableFilter<"companies"> | string | null;
      address?: StringFilter<"companies"> | string;
      sub_district?: StringFilter<"companies"> | string;
      district?: StringFilter<"companies"> | string;
      province?: StringFilter<"companies"> | string;
      postal_code?: StringFilter<"companies"> | string;
      telephone?: StringNullableFilter<"companies"> | string | null;
      fax_number?: StringNullableFilter<"companies"> | string | null;
      created_at?: DateTimeNullableFilter<"companies"> | Date | string | null;
      updated_at?: DateTimeNullableFilter<"companies"> | Date | string | null;
    },
    "id"
  >;

  export type companiesOrderByWithAggregationInput = {
    id?: SortOrder;
    company_name_en?: SortOrder;
    company_name_th?: SortOrder;
    tax_id?: SortOrderInput | SortOrder;
    address?: SortOrder;
    sub_district?: SortOrder;
    district?: SortOrder;
    province?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrderInput | SortOrder;
    fax_number?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    _count?: companiesCountOrderByAggregateInput;
    _avg?: companiesAvgOrderByAggregateInput;
    _max?: companiesMaxOrderByAggregateInput;
    _min?: companiesMinOrderByAggregateInput;
    _sum?: companiesSumOrderByAggregateInput;
  };

  export type companiesScalarWhereWithAggregatesInput = {
    AND?:
      | companiesScalarWhereWithAggregatesInput
      | companiesScalarWhereWithAggregatesInput[];
    OR?: companiesScalarWhereWithAggregatesInput[];
    NOT?:
      | companiesScalarWhereWithAggregatesInput
      | companiesScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<"companies"> | number;
    company_name_en?: StringWithAggregatesFilter<"companies"> | string;
    company_name_th?: StringWithAggregatesFilter<"companies"> | string;
    tax_id?: StringNullableWithAggregatesFilter<"companies"> | string | null;
    address?: StringWithAggregatesFilter<"companies"> | string;
    sub_district?: StringWithAggregatesFilter<"companies"> | string;
    district?: StringWithAggregatesFilter<"companies"> | string;
    province?: StringWithAggregatesFilter<"companies"> | string;
    postal_code?: StringWithAggregatesFilter<"companies"> | string;
    telephone?: StringNullableWithAggregatesFilter<"companies"> | string | null;
    fax_number?:
      | StringNullableWithAggregatesFilter<"companies">
      | string
      | null;
    created_at?:
      | DateTimeNullableWithAggregatesFilter<"companies">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableWithAggregatesFilter<"companies">
      | Date
      | string
      | null;
  };

  export type document_requestWhereInput = {
    AND?: document_requestWhereInput | document_requestWhereInput[];
    OR?: document_requestWhereInput[];
    NOT?: document_requestWhereInput | document_requestWhereInput[];
    id?: IntFilter<"document_request"> | number;
    request_no?: StringFilter<"document_request"> | string;
    request_date?:
      | DateTimeNullableFilter<"document_request">
      | Date
      | string
      | null;
    user_id?: IntFilter<"document_request"> | number;
    company_id?: IntFilter<"document_request"> | number;
    document_type?: StringFilter<"document_request"> | string;
    description?: StringNullableFilter<"document_request"> | string | null;
    status?: StringNullableFilter<"document_request"> | string | null;
    paid_status?: BoolNullableFilter<"document_request"> | boolean | null;
    created_at?:
      | DateTimeNullableFilter<"document_request">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableFilter<"document_request">
      | Date
      | string
      | null;
    sample_list?: Sample_listListRelationFilter;
  };

  export type document_requestOrderByWithRelationInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    request_date?: SortOrderInput | SortOrder;
    user_id?: SortOrder;
    company_id?: SortOrder;
    document_type?: SortOrder;
    description?: SortOrderInput | SortOrder;
    status?: SortOrderInput | SortOrder;
    paid_status?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    sample_list?: sample_listOrderByRelationAggregateInput;
  };

  export type document_requestWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      request_no?: string;
      AND?: document_requestWhereInput | document_requestWhereInput[];
      OR?: document_requestWhereInput[];
      NOT?: document_requestWhereInput | document_requestWhereInput[];
      request_date?:
        | DateTimeNullableFilter<"document_request">
        | Date
        | string
        | null;
      user_id?: IntFilter<"document_request"> | number;
      company_id?: IntFilter<"document_request"> | number;
      document_type?: StringFilter<"document_request"> | string;
      description?: StringNullableFilter<"document_request"> | string | null;
      status?: StringNullableFilter<"document_request"> | string | null;
      paid_status?: BoolNullableFilter<"document_request"> | boolean | null;
      created_at?:
        | DateTimeNullableFilter<"document_request">
        | Date
        | string
        | null;
      updated_at?:
        | DateTimeNullableFilter<"document_request">
        | Date
        | string
        | null;
      sample_list?: Sample_listListRelationFilter;
    },
    "id" | "request_no"
  >;

  export type document_requestOrderByWithAggregationInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    request_date?: SortOrderInput | SortOrder;
    user_id?: SortOrder;
    company_id?: SortOrder;
    document_type?: SortOrder;
    description?: SortOrderInput | SortOrder;
    status?: SortOrderInput | SortOrder;
    paid_status?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    _count?: document_requestCountOrderByAggregateInput;
    _avg?: document_requestAvgOrderByAggregateInput;
    _max?: document_requestMaxOrderByAggregateInput;
    _min?: document_requestMinOrderByAggregateInput;
    _sum?: document_requestSumOrderByAggregateInput;
  };

  export type document_requestScalarWhereWithAggregatesInput = {
    AND?:
      | document_requestScalarWhereWithAggregatesInput
      | document_requestScalarWhereWithAggregatesInput[];
    OR?: document_requestScalarWhereWithAggregatesInput[];
    NOT?:
      | document_requestScalarWhereWithAggregatesInput
      | document_requestScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<"document_request"> | number;
    request_no?: StringWithAggregatesFilter<"document_request"> | string;
    request_date?:
      | DateTimeNullableWithAggregatesFilter<"document_request">
      | Date
      | string
      | null;
    user_id?: IntWithAggregatesFilter<"document_request"> | number;
    company_id?: IntWithAggregatesFilter<"document_request"> | number;
    document_type?: StringWithAggregatesFilter<"document_request"> | string;
    description?:
      | StringNullableWithAggregatesFilter<"document_request">
      | string
      | null;
    status?:
      | StringNullableWithAggregatesFilter<"document_request">
      | string
      | null;
    paid_status?:
      | BoolNullableWithAggregatesFilter<"document_request">
      | boolean
      | null;
    created_at?:
      | DateTimeNullableWithAggregatesFilter<"document_request">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableWithAggregatesFilter<"document_request">
      | Date
      | string
      | null;
  };

  export type knex_migrationsWhereInput = {
    AND?: knex_migrationsWhereInput | knex_migrationsWhereInput[];
    OR?: knex_migrationsWhereInput[];
    NOT?: knex_migrationsWhereInput | knex_migrationsWhereInput[];
    id?: IntFilter<"knex_migrations"> | number;
    name?: StringNullableFilter<"knex_migrations"> | string | null;
    batch?: IntNullableFilter<"knex_migrations"> | number | null;
    migration_time?:
      | DateTimeNullableFilter<"knex_migrations">
      | Date
      | string
      | null;
  };

  export type knex_migrationsOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrderInput | SortOrder;
    batch?: SortOrderInput | SortOrder;
    migration_time?: SortOrderInput | SortOrder;
  };

  export type knex_migrationsWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      AND?: knex_migrationsWhereInput | knex_migrationsWhereInput[];
      OR?: knex_migrationsWhereInput[];
      NOT?: knex_migrationsWhereInput | knex_migrationsWhereInput[];
      name?: StringNullableFilter<"knex_migrations"> | string | null;
      batch?: IntNullableFilter<"knex_migrations"> | number | null;
      migration_time?:
        | DateTimeNullableFilter<"knex_migrations">
        | Date
        | string
        | null;
    },
    "id"
  >;

  export type knex_migrationsOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrderInput | SortOrder;
    batch?: SortOrderInput | SortOrder;
    migration_time?: SortOrderInput | SortOrder;
    _count?: knex_migrationsCountOrderByAggregateInput;
    _avg?: knex_migrationsAvgOrderByAggregateInput;
    _max?: knex_migrationsMaxOrderByAggregateInput;
    _min?: knex_migrationsMinOrderByAggregateInput;
    _sum?: knex_migrationsSumOrderByAggregateInput;
  };

  export type knex_migrationsScalarWhereWithAggregatesInput = {
    AND?:
      | knex_migrationsScalarWhereWithAggregatesInput
      | knex_migrationsScalarWhereWithAggregatesInput[];
    OR?: knex_migrationsScalarWhereWithAggregatesInput[];
    NOT?:
      | knex_migrationsScalarWhereWithAggregatesInput
      | knex_migrationsScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<"knex_migrations"> | number;
    name?:
      | StringNullableWithAggregatesFilter<"knex_migrations">
      | string
      | null;
    batch?: IntNullableWithAggregatesFilter<"knex_migrations"> | number | null;
    migration_time?:
      | DateTimeNullableWithAggregatesFilter<"knex_migrations">
      | Date
      | string
      | null;
  };

  export type knex_migrations_lockWhereInput = {
    AND?: knex_migrations_lockWhereInput | knex_migrations_lockWhereInput[];
    OR?: knex_migrations_lockWhereInput[];
    NOT?: knex_migrations_lockWhereInput | knex_migrations_lockWhereInput[];
    index?: IntFilter<"knex_migrations_lock"> | number;
    is_locked?: IntNullableFilter<"knex_migrations_lock"> | number | null;
  };

  export type knex_migrations_lockOrderByWithRelationInput = {
    index?: SortOrder;
    is_locked?: SortOrderInput | SortOrder;
  };

  export type knex_migrations_lockWhereUniqueInput = Prisma.AtLeast<
    {
      index?: number;
      AND?: knex_migrations_lockWhereInput | knex_migrations_lockWhereInput[];
      OR?: knex_migrations_lockWhereInput[];
      NOT?: knex_migrations_lockWhereInput | knex_migrations_lockWhereInput[];
      is_locked?: IntNullableFilter<"knex_migrations_lock"> | number | null;
    },
    "index"
  >;

  export type knex_migrations_lockOrderByWithAggregationInput = {
    index?: SortOrder;
    is_locked?: SortOrderInput | SortOrder;
    _count?: knex_migrations_lockCountOrderByAggregateInput;
    _avg?: knex_migrations_lockAvgOrderByAggregateInput;
    _max?: knex_migrations_lockMaxOrderByAggregateInput;
    _min?: knex_migrations_lockMinOrderByAggregateInput;
    _sum?: knex_migrations_lockSumOrderByAggregateInput;
  };

  export type knex_migrations_lockScalarWhereWithAggregatesInput = {
    AND?:
      | knex_migrations_lockScalarWhereWithAggregatesInput
      | knex_migrations_lockScalarWhereWithAggregatesInput[];
    OR?: knex_migrations_lockScalarWhereWithAggregatesInput[];
    NOT?:
      | knex_migrations_lockScalarWhereWithAggregatesInput
      | knex_migrations_lockScalarWhereWithAggregatesInput[];
    index?: IntWithAggregatesFilter<"knex_migrations_lock"> | number;
    is_locked?:
      | IntNullableWithAggregatesFilter<"knex_migrations_lock">
      | number
      | null;
  };

  export type receipt_addressesWhereInput = {
    AND?: receipt_addressesWhereInput | receipt_addressesWhereInput[];
    OR?: receipt_addressesWhereInput[];
    NOT?: receipt_addressesWhereInput | receipt_addressesWhereInput[];
    id?: IntFilter<"receipt_addresses"> | number;
    address?: StringFilter<"receipt_addresses"> | string;
    province?: StringFilter<"receipt_addresses"> | string;
    district?: StringFilter<"receipt_addresses"> | string;
    sub_district?: StringFilter<"receipt_addresses"> | string;
    postal_code?: StringFilter<"receipt_addresses"> | string;
    telephone?: StringNullableFilter<"receipt_addresses"> | string | null;
    fax_number?: StringNullableFilter<"receipt_addresses"> | string | null;
    created_at?:
      | DateTimeNullableFilter<"receipt_addresses">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableFilter<"receipt_addresses">
      | Date
      | string
      | null;
  };

  export type receipt_addressesOrderByWithRelationInput = {
    id?: SortOrder;
    address?: SortOrder;
    province?: SortOrder;
    district?: SortOrder;
    sub_district?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrderInput | SortOrder;
    fax_number?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
  };

  export type receipt_addressesWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      AND?: receipt_addressesWhereInput | receipt_addressesWhereInput[];
      OR?: receipt_addressesWhereInput[];
      NOT?: receipt_addressesWhereInput | receipt_addressesWhereInput[];
      address?: StringFilter<"receipt_addresses"> | string;
      province?: StringFilter<"receipt_addresses"> | string;
      district?: StringFilter<"receipt_addresses"> | string;
      sub_district?: StringFilter<"receipt_addresses"> | string;
      postal_code?: StringFilter<"receipt_addresses"> | string;
      telephone?: StringNullableFilter<"receipt_addresses"> | string | null;
      fax_number?: StringNullableFilter<"receipt_addresses"> | string | null;
      created_at?:
        | DateTimeNullableFilter<"receipt_addresses">
        | Date
        | string
        | null;
      updated_at?:
        | DateTimeNullableFilter<"receipt_addresses">
        | Date
        | string
        | null;
    },
    "id"
  >;

  export type receipt_addressesOrderByWithAggregationInput = {
    id?: SortOrder;
    address?: SortOrder;
    province?: SortOrder;
    district?: SortOrder;
    sub_district?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrderInput | SortOrder;
    fax_number?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    _count?: receipt_addressesCountOrderByAggregateInput;
    _avg?: receipt_addressesAvgOrderByAggregateInput;
    _max?: receipt_addressesMaxOrderByAggregateInput;
    _min?: receipt_addressesMinOrderByAggregateInput;
    _sum?: receipt_addressesSumOrderByAggregateInput;
  };

  export type receipt_addressesScalarWhereWithAggregatesInput = {
    AND?:
      | receipt_addressesScalarWhereWithAggregatesInput
      | receipt_addressesScalarWhereWithAggregatesInput[];
    OR?: receipt_addressesScalarWhereWithAggregatesInput[];
    NOT?:
      | receipt_addressesScalarWhereWithAggregatesInput
      | receipt_addressesScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<"receipt_addresses"> | number;
    address?: StringWithAggregatesFilter<"receipt_addresses"> | string;
    province?: StringWithAggregatesFilter<"receipt_addresses"> | string;
    district?: StringWithAggregatesFilter<"receipt_addresses"> | string;
    sub_district?: StringWithAggregatesFilter<"receipt_addresses"> | string;
    postal_code?: StringWithAggregatesFilter<"receipt_addresses"> | string;
    telephone?:
      | StringNullableWithAggregatesFilter<"receipt_addresses">
      | string
      | null;
    fax_number?:
      | StringNullableWithAggregatesFilter<"receipt_addresses">
      | string
      | null;
    created_at?:
      | DateTimeNullableWithAggregatesFilter<"receipt_addresses">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableWithAggregatesFilter<"receipt_addresses">
      | Date
      | string
      | null;
  };

  export type sample_listWhereInput = {
    AND?: sample_listWhereInput | sample_listWhereInput[];
    OR?: sample_listWhereInput[];
    NOT?: sample_listWhereInput | sample_listWhereInput[];
    id?: IntFilter<"sample_list"> | number;
    request_no?: StringFilter<"sample_list"> | string;
    sent_sample_date?:
      | DateTimeNullableFilter<"sample_list">
      | Date
      | string
      | null;
    animal_type?: StringNullableFilter<"sample_list"> | string | null;
    sample_specimen?: StringNullableFilter<"sample_list"> | string | null;
    panel?: StringNullableFilter<"sample_list"> | string | null;
    method?: StringNullableFilter<"sample_list"> | string | null;
    sample_qty?: IntNullableFilter<"sample_list"> | number | null;
    is_deleted?: BoolFilter<"sample_list"> | boolean;
    created_at?: DateTimeNullableFilter<"sample_list"> | Date | string | null;
    updated_at?: DateTimeNullableFilter<"sample_list"> | Date | string | null;
    document_request?: XOR<
      Document_requestScalarRelationFilter,
      document_requestWhereInput
    >;
  };

  export type sample_listOrderByWithRelationInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    sent_sample_date?: SortOrderInput | SortOrder;
    animal_type?: SortOrderInput | SortOrder;
    sample_specimen?: SortOrderInput | SortOrder;
    panel?: SortOrderInput | SortOrder;
    method?: SortOrderInput | SortOrder;
    sample_qty?: SortOrderInput | SortOrder;
    is_deleted?: SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    document_request?: document_requestOrderByWithRelationInput;
  };

  export type sample_listWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      AND?: sample_listWhereInput | sample_listWhereInput[];
      OR?: sample_listWhereInput[];
      NOT?: sample_listWhereInput | sample_listWhereInput[];
      request_no?: StringFilter<"sample_list"> | string;
      sent_sample_date?:
        | DateTimeNullableFilter<"sample_list">
        | Date
        | string
        | null;
      animal_type?: StringNullableFilter<"sample_list"> | string | null;
      sample_specimen?: StringNullableFilter<"sample_list"> | string | null;
      panel?: StringNullableFilter<"sample_list"> | string | null;
      method?: StringNullableFilter<"sample_list"> | string | null;
      sample_qty?: IntNullableFilter<"sample_list"> | number | null;
      is_deleted?: BoolFilter<"sample_list"> | boolean;
      created_at?: DateTimeNullableFilter<"sample_list"> | Date | string | null;
      updated_at?: DateTimeNullableFilter<"sample_list"> | Date | string | null;
      document_request?: XOR<
        Document_requestScalarRelationFilter,
        document_requestWhereInput
      >;
    },
    "id"
  >;

  export type sample_listOrderByWithAggregationInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    sent_sample_date?: SortOrderInput | SortOrder;
    animal_type?: SortOrderInput | SortOrder;
    sample_specimen?: SortOrderInput | SortOrder;
    panel?: SortOrderInput | SortOrder;
    method?: SortOrderInput | SortOrder;
    sample_qty?: SortOrderInput | SortOrder;
    is_deleted?: SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    _count?: sample_listCountOrderByAggregateInput;
    _avg?: sample_listAvgOrderByAggregateInput;
    _max?: sample_listMaxOrderByAggregateInput;
    _min?: sample_listMinOrderByAggregateInput;
    _sum?: sample_listSumOrderByAggregateInput;
  };

  export type sample_listScalarWhereWithAggregatesInput = {
    AND?:
      | sample_listScalarWhereWithAggregatesInput
      | sample_listScalarWhereWithAggregatesInput[];
    OR?: sample_listScalarWhereWithAggregatesInput[];
    NOT?:
      | sample_listScalarWhereWithAggregatesInput
      | sample_listScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<"sample_list"> | number;
    request_no?: StringWithAggregatesFilter<"sample_list"> | string;
    sent_sample_date?:
      | DateTimeNullableWithAggregatesFilter<"sample_list">
      | Date
      | string
      | null;
    animal_type?:
      | StringNullableWithAggregatesFilter<"sample_list">
      | string
      | null;
    sample_specimen?:
      | StringNullableWithAggregatesFilter<"sample_list">
      | string
      | null;
    panel?: StringNullableWithAggregatesFilter<"sample_list"> | string | null;
    method?: StringNullableWithAggregatesFilter<"sample_list"> | string | null;
    sample_qty?: IntNullableWithAggregatesFilter<"sample_list"> | number | null;
    is_deleted?: BoolWithAggregatesFilter<"sample_list"> | boolean;
    created_at?:
      | DateTimeNullableWithAggregatesFilter<"sample_list">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableWithAggregatesFilter<"sample_list">
      | Date
      | string
      | null;
  };

  export type usersWhereInput = {
    AND?: usersWhereInput | usersWhereInput[];
    OR?: usersWhereInput[];
    NOT?: usersWhereInput | usersWhereInput[];
    id?: IntFilter<"users"> | number;
    username?: StringFilter<"users"> | string;
    first_name?: StringNullableFilter<"users"> | string | null;
    last_name?: StringNullableFilter<"users"> | string | null;
    email?: StringFilter<"users"> | string;
    password?: StringFilter<"users"> | string;
    role?: StringNullableFilter<"users"> | string | null;
    is_active?: BoolNullableFilter<"users"> | boolean | null;
    created_at?: DateTimeNullableFilter<"users"> | Date | string | null;
    updated_at?: DateTimeNullableFilter<"users"> | Date | string | null;
    worker_profiles?: Worker_profilesListRelationFilter;
  };

  export type usersOrderByWithRelationInput = {
    id?: SortOrder;
    username?: SortOrder;
    first_name?: SortOrderInput | SortOrder;
    last_name?: SortOrderInput | SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    role?: SortOrderInput | SortOrder;
    is_active?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    worker_profiles?: worker_profilesOrderByRelationAggregateInput;
  };

  export type usersWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      username?: string;
      email?: string;
      AND?: usersWhereInput | usersWhereInput[];
      OR?: usersWhereInput[];
      NOT?: usersWhereInput | usersWhereInput[];
      first_name?: StringNullableFilter<"users"> | string | null;
      last_name?: StringNullableFilter<"users"> | string | null;
      password?: StringFilter<"users"> | string;
      role?: StringNullableFilter<"users"> | string | null;
      is_active?: BoolNullableFilter<"users"> | boolean | null;
      created_at?: DateTimeNullableFilter<"users"> | Date | string | null;
      updated_at?: DateTimeNullableFilter<"users"> | Date | string | null;
      worker_profiles?: Worker_profilesListRelationFilter;
    },
    "id" | "username" | "email"
  >;

  export type usersOrderByWithAggregationInput = {
    id?: SortOrder;
    username?: SortOrder;
    first_name?: SortOrderInput | SortOrder;
    last_name?: SortOrderInput | SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    role?: SortOrderInput | SortOrder;
    is_active?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    _count?: usersCountOrderByAggregateInput;
    _avg?: usersAvgOrderByAggregateInput;
    _max?: usersMaxOrderByAggregateInput;
    _min?: usersMinOrderByAggregateInput;
    _sum?: usersSumOrderByAggregateInput;
  };

  export type usersScalarWhereWithAggregatesInput = {
    AND?:
      | usersScalarWhereWithAggregatesInput
      | usersScalarWhereWithAggregatesInput[];
    OR?: usersScalarWhereWithAggregatesInput[];
    NOT?:
      | usersScalarWhereWithAggregatesInput
      | usersScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<"users"> | number;
    username?: StringWithAggregatesFilter<"users"> | string;
    first_name?: StringNullableWithAggregatesFilter<"users"> | string | null;
    last_name?: StringNullableWithAggregatesFilter<"users"> | string | null;
    email?: StringWithAggregatesFilter<"users"> | string;
    password?: StringWithAggregatesFilter<"users"> | string;
    role?: StringNullableWithAggregatesFilter<"users"> | string | null;
    is_active?: BoolNullableWithAggregatesFilter<"users"> | boolean | null;
    created_at?:
      | DateTimeNullableWithAggregatesFilter<"users">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableWithAggregatesFilter<"users">
      | Date
      | string
      | null;
  };

  export type worker_profilesWhereInput = {
    AND?: worker_profilesWhereInput | worker_profilesWhereInput[];
    OR?: worker_profilesWhereInput[];
    NOT?: worker_profilesWhereInput | worker_profilesWhereInput[];
    id?: IntFilter<"worker_profiles"> | number;
    id_card_number?: StringFilter<"worker_profiles"> | string;
    user_id?: IntFilter<"worker_profiles"> | number;
    title?: StringNullableFilter<"worker_profiles"> | string | null;
    first_name?: StringFilter<"worker_profiles"> | string;
    last_name?: StringFilter<"worker_profiles"> | string;
    phone_number?: StringNullableFilter<"worker_profiles"> | string | null;
    mobile_phone_number?: StringFilter<"worker_profiles"> | string;
    email?: StringNullableFilter<"worker_profiles"> | string | null;
    id_card_file_path?: StringNullableFilter<"worker_profiles"> | string | null;
    created_at?:
      | DateTimeNullableFilter<"worker_profiles">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableFilter<"worker_profiles">
      | Date
      | string
      | null;
    users?: XOR<UsersScalarRelationFilter, usersWhereInput>;
  };

  export type worker_profilesOrderByWithRelationInput = {
    id?: SortOrder;
    id_card_number?: SortOrder;
    user_id?: SortOrder;
    title?: SortOrderInput | SortOrder;
    first_name?: SortOrder;
    last_name?: SortOrder;
    phone_number?: SortOrderInput | SortOrder;
    mobile_phone_number?: SortOrder;
    email?: SortOrderInput | SortOrder;
    id_card_file_path?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    users?: usersOrderByWithRelationInput;
  };

  export type worker_profilesWhereUniqueInput = Prisma.AtLeast<
    {
      id?: number;
      id_card_number?: string;
      AND?: worker_profilesWhereInput | worker_profilesWhereInput[];
      OR?: worker_profilesWhereInput[];
      NOT?: worker_profilesWhereInput | worker_profilesWhereInput[];
      user_id?: IntFilter<"worker_profiles"> | number;
      title?: StringNullableFilter<"worker_profiles"> | string | null;
      first_name?: StringFilter<"worker_profiles"> | string;
      last_name?: StringFilter<"worker_profiles"> | string;
      phone_number?: StringNullableFilter<"worker_profiles"> | string | null;
      mobile_phone_number?: StringFilter<"worker_profiles"> | string;
      email?: StringNullableFilter<"worker_profiles"> | string | null;
      id_card_file_path?:
        | StringNullableFilter<"worker_profiles">
        | string
        | null;
      created_at?:
        | DateTimeNullableFilter<"worker_profiles">
        | Date
        | string
        | null;
      updated_at?:
        | DateTimeNullableFilter<"worker_profiles">
        | Date
        | string
        | null;
      users?: XOR<UsersScalarRelationFilter, usersWhereInput>;
    },
    "id" | "id_card_number"
  >;

  export type worker_profilesOrderByWithAggregationInput = {
    id?: SortOrder;
    id_card_number?: SortOrder;
    user_id?: SortOrder;
    title?: SortOrderInput | SortOrder;
    first_name?: SortOrder;
    last_name?: SortOrder;
    phone_number?: SortOrderInput | SortOrder;
    mobile_phone_number?: SortOrder;
    email?: SortOrderInput | SortOrder;
    id_card_file_path?: SortOrderInput | SortOrder;
    created_at?: SortOrderInput | SortOrder;
    updated_at?: SortOrderInput | SortOrder;
    _count?: worker_profilesCountOrderByAggregateInput;
    _avg?: worker_profilesAvgOrderByAggregateInput;
    _max?: worker_profilesMaxOrderByAggregateInput;
    _min?: worker_profilesMinOrderByAggregateInput;
    _sum?: worker_profilesSumOrderByAggregateInput;
  };

  export type worker_profilesScalarWhereWithAggregatesInput = {
    AND?:
      | worker_profilesScalarWhereWithAggregatesInput
      | worker_profilesScalarWhereWithAggregatesInput[];
    OR?: worker_profilesScalarWhereWithAggregatesInput[];
    NOT?:
      | worker_profilesScalarWhereWithAggregatesInput
      | worker_profilesScalarWhereWithAggregatesInput[];
    id?: IntWithAggregatesFilter<"worker_profiles"> | number;
    id_card_number?: StringWithAggregatesFilter<"worker_profiles"> | string;
    user_id?: IntWithAggregatesFilter<"worker_profiles"> | number;
    title?:
      | StringNullableWithAggregatesFilter<"worker_profiles">
      | string
      | null;
    first_name?: StringWithAggregatesFilter<"worker_profiles"> | string;
    last_name?: StringWithAggregatesFilter<"worker_profiles"> | string;
    phone_number?:
      | StringNullableWithAggregatesFilter<"worker_profiles">
      | string
      | null;
    mobile_phone_number?:
      | StringWithAggregatesFilter<"worker_profiles">
      | string;
    email?:
      | StringNullableWithAggregatesFilter<"worker_profiles">
      | string
      | null;
    id_card_file_path?:
      | StringNullableWithAggregatesFilter<"worker_profiles">
      | string
      | null;
    created_at?:
      | DateTimeNullableWithAggregatesFilter<"worker_profiles">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableWithAggregatesFilter<"worker_profiles">
      | Date
      | string
      | null;
  };

  export type companiesCreateInput = {
    company_name_en: string;
    company_name_th: string;
    tax_id?: string | null;
    address: string;
    sub_district: string;
    district: string;
    province: string;
    postal_code: string;
    telephone?: string | null;
    fax_number?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type companiesUncheckedCreateInput = {
    id?: number;
    company_name_en: string;
    company_name_th: string;
    tax_id?: string | null;
    address: string;
    sub_district: string;
    district: string;
    province: string;
    postal_code: string;
    telephone?: string | null;
    fax_number?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type companiesUpdateInput = {
    company_name_en?: StringFieldUpdateOperationsInput | string;
    company_name_th?: StringFieldUpdateOperationsInput | string;
    tax_id?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: StringFieldUpdateOperationsInput | string;
    sub_district?: StringFieldUpdateOperationsInput | string;
    district?: StringFieldUpdateOperationsInput | string;
    province?: StringFieldUpdateOperationsInput | string;
    postal_code?: StringFieldUpdateOperationsInput | string;
    telephone?: NullableStringFieldUpdateOperationsInput | string | null;
    fax_number?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type companiesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    company_name_en?: StringFieldUpdateOperationsInput | string;
    company_name_th?: StringFieldUpdateOperationsInput | string;
    tax_id?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: StringFieldUpdateOperationsInput | string;
    sub_district?: StringFieldUpdateOperationsInput | string;
    district?: StringFieldUpdateOperationsInput | string;
    province?: StringFieldUpdateOperationsInput | string;
    postal_code?: StringFieldUpdateOperationsInput | string;
    telephone?: NullableStringFieldUpdateOperationsInput | string | null;
    fax_number?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type companiesCreateManyInput = {
    id?: number;
    company_name_en: string;
    company_name_th: string;
    tax_id?: string | null;
    address: string;
    sub_district: string;
    district: string;
    province: string;
    postal_code: string;
    telephone?: string | null;
    fax_number?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type companiesUpdateManyMutationInput = {
    company_name_en?: StringFieldUpdateOperationsInput | string;
    company_name_th?: StringFieldUpdateOperationsInput | string;
    tax_id?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: StringFieldUpdateOperationsInput | string;
    sub_district?: StringFieldUpdateOperationsInput | string;
    district?: StringFieldUpdateOperationsInput | string;
    province?: StringFieldUpdateOperationsInput | string;
    postal_code?: StringFieldUpdateOperationsInput | string;
    telephone?: NullableStringFieldUpdateOperationsInput | string | null;
    fax_number?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type companiesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    company_name_en?: StringFieldUpdateOperationsInput | string;
    company_name_th?: StringFieldUpdateOperationsInput | string;
    tax_id?: NullableStringFieldUpdateOperationsInput | string | null;
    address?: StringFieldUpdateOperationsInput | string;
    sub_district?: StringFieldUpdateOperationsInput | string;
    district?: StringFieldUpdateOperationsInput | string;
    province?: StringFieldUpdateOperationsInput | string;
    postal_code?: StringFieldUpdateOperationsInput | string;
    telephone?: NullableStringFieldUpdateOperationsInput | string | null;
    fax_number?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type document_requestCreateInput = {
    request_no: string;
    request_date?: Date | string | null;
    user_id: number;
    company_id: number;
    document_type: string;
    description?: string | null;
    status?: string | null;
    paid_status?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    sample_list?: sample_listCreateNestedManyWithoutDocument_requestInput;
  };

  export type document_requestUncheckedCreateInput = {
    id?: number;
    request_no: string;
    request_date?: Date | string | null;
    user_id: number;
    company_id: number;
    document_type: string;
    description?: string | null;
    status?: string | null;
    paid_status?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    sample_list?: sample_listUncheckedCreateNestedManyWithoutDocument_requestInput;
  };

  export type document_requestUpdateInput = {
    request_no?: StringFieldUpdateOperationsInput | string;
    request_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user_id?: IntFieldUpdateOperationsInput | number;
    company_id?: IntFieldUpdateOperationsInput | number;
    document_type?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: NullableStringFieldUpdateOperationsInput | string | null;
    paid_status?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    sample_list?: sample_listUpdateManyWithoutDocument_requestNestedInput;
  };

  export type document_requestUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    request_no?: StringFieldUpdateOperationsInput | string;
    request_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user_id?: IntFieldUpdateOperationsInput | number;
    company_id?: IntFieldUpdateOperationsInput | number;
    document_type?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: NullableStringFieldUpdateOperationsInput | string | null;
    paid_status?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    sample_list?: sample_listUncheckedUpdateManyWithoutDocument_requestNestedInput;
  };

  export type document_requestCreateManyInput = {
    id?: number;
    request_no: string;
    request_date?: Date | string | null;
    user_id: number;
    company_id: number;
    document_type: string;
    description?: string | null;
    status?: string | null;
    paid_status?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type document_requestUpdateManyMutationInput = {
    request_no?: StringFieldUpdateOperationsInput | string;
    request_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user_id?: IntFieldUpdateOperationsInput | number;
    company_id?: IntFieldUpdateOperationsInput | number;
    document_type?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: NullableStringFieldUpdateOperationsInput | string | null;
    paid_status?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type document_requestUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    request_no?: StringFieldUpdateOperationsInput | string;
    request_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user_id?: IntFieldUpdateOperationsInput | number;
    company_id?: IntFieldUpdateOperationsInput | number;
    document_type?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: NullableStringFieldUpdateOperationsInput | string | null;
    paid_status?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type knex_migrationsCreateInput = {
    name?: string | null;
    batch?: number | null;
    migration_time?: Date | string | null;
  };

  export type knex_migrationsUncheckedCreateInput = {
    id?: number;
    name?: string | null;
    batch?: number | null;
    migration_time?: Date | string | null;
  };

  export type knex_migrationsUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    batch?: NullableIntFieldUpdateOperationsInput | number | null;
    migration_time?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type knex_migrationsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    batch?: NullableIntFieldUpdateOperationsInput | number | null;
    migration_time?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type knex_migrationsCreateManyInput = {
    id?: number;
    name?: string | null;
    batch?: number | null;
    migration_time?: Date | string | null;
  };

  export type knex_migrationsUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    batch?: NullableIntFieldUpdateOperationsInput | number | null;
    migration_time?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type knex_migrationsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    batch?: NullableIntFieldUpdateOperationsInput | number | null;
    migration_time?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type knex_migrations_lockCreateInput = {
    is_locked?: number | null;
  };

  export type knex_migrations_lockUncheckedCreateInput = {
    index?: number;
    is_locked?: number | null;
  };

  export type knex_migrations_lockUpdateInput = {
    is_locked?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type knex_migrations_lockUncheckedUpdateInput = {
    index?: IntFieldUpdateOperationsInput | number;
    is_locked?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type knex_migrations_lockCreateManyInput = {
    index?: number;
    is_locked?: number | null;
  };

  export type knex_migrations_lockUpdateManyMutationInput = {
    is_locked?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type knex_migrations_lockUncheckedUpdateManyInput = {
    index?: IntFieldUpdateOperationsInput | number;
    is_locked?: NullableIntFieldUpdateOperationsInput | number | null;
  };

  export type receipt_addressesCreateInput = {
    address: string;
    province: string;
    district: string;
    sub_district: string;
    postal_code: string;
    telephone?: string | null;
    fax_number?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type receipt_addressesUncheckedCreateInput = {
    id?: number;
    address: string;
    province: string;
    district: string;
    sub_district: string;
    postal_code: string;
    telephone?: string | null;
    fax_number?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type receipt_addressesUpdateInput = {
    address?: StringFieldUpdateOperationsInput | string;
    province?: StringFieldUpdateOperationsInput | string;
    district?: StringFieldUpdateOperationsInput | string;
    sub_district?: StringFieldUpdateOperationsInput | string;
    postal_code?: StringFieldUpdateOperationsInput | string;
    telephone?: NullableStringFieldUpdateOperationsInput | string | null;
    fax_number?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type receipt_addressesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    address?: StringFieldUpdateOperationsInput | string;
    province?: StringFieldUpdateOperationsInput | string;
    district?: StringFieldUpdateOperationsInput | string;
    sub_district?: StringFieldUpdateOperationsInput | string;
    postal_code?: StringFieldUpdateOperationsInput | string;
    telephone?: NullableStringFieldUpdateOperationsInput | string | null;
    fax_number?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type receipt_addressesCreateManyInput = {
    id?: number;
    address: string;
    province: string;
    district: string;
    sub_district: string;
    postal_code: string;
    telephone?: string | null;
    fax_number?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type receipt_addressesUpdateManyMutationInput = {
    address?: StringFieldUpdateOperationsInput | string;
    province?: StringFieldUpdateOperationsInput | string;
    district?: StringFieldUpdateOperationsInput | string;
    sub_district?: StringFieldUpdateOperationsInput | string;
    postal_code?: StringFieldUpdateOperationsInput | string;
    telephone?: NullableStringFieldUpdateOperationsInput | string | null;
    fax_number?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type receipt_addressesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    address?: StringFieldUpdateOperationsInput | string;
    province?: StringFieldUpdateOperationsInput | string;
    district?: StringFieldUpdateOperationsInput | string;
    sub_district?: StringFieldUpdateOperationsInput | string;
    postal_code?: StringFieldUpdateOperationsInput | string;
    telephone?: NullableStringFieldUpdateOperationsInput | string | null;
    fax_number?: NullableStringFieldUpdateOperationsInput | string | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type sample_listCreateInput = {
    sent_sample_date?: Date | string | null;
    animal_type?: string | null;
    sample_specimen?: string | null;
    panel?: string | null;
    method?: string | null;
    sample_qty?: number | null;
    is_deleted?: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    document_request: document_requestCreateNestedOneWithoutSample_listInput;
  };

  export type sample_listUncheckedCreateInput = {
    id?: number;
    request_no: string;
    sent_sample_date?: Date | string | null;
    animal_type?: string | null;
    sample_specimen?: string | null;
    panel?: string | null;
    method?: string | null;
    sample_qty?: number | null;
    is_deleted?: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type sample_listUpdateInput = {
    sent_sample_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    animal_type?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_specimen?: NullableStringFieldUpdateOperationsInput | string | null;
    panel?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_qty?: NullableIntFieldUpdateOperationsInput | number | null;
    is_deleted?: BoolFieldUpdateOperationsInput | boolean;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    document_request?: document_requestUpdateOneRequiredWithoutSample_listNestedInput;
  };

  export type sample_listUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    request_no?: StringFieldUpdateOperationsInput | string;
    sent_sample_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    animal_type?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_specimen?: NullableStringFieldUpdateOperationsInput | string | null;
    panel?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_qty?: NullableIntFieldUpdateOperationsInput | number | null;
    is_deleted?: BoolFieldUpdateOperationsInput | boolean;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type sample_listCreateManyInput = {
    id?: number;
    request_no: string;
    sent_sample_date?: Date | string | null;
    animal_type?: string | null;
    sample_specimen?: string | null;
    panel?: string | null;
    method?: string | null;
    sample_qty?: number | null;
    is_deleted?: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type sample_listUpdateManyMutationInput = {
    sent_sample_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    animal_type?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_specimen?: NullableStringFieldUpdateOperationsInput | string | null;
    panel?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_qty?: NullableIntFieldUpdateOperationsInput | number | null;
    is_deleted?: BoolFieldUpdateOperationsInput | boolean;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type sample_listUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    request_no?: StringFieldUpdateOperationsInput | string;
    sent_sample_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    animal_type?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_specimen?: NullableStringFieldUpdateOperationsInput | string | null;
    panel?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_qty?: NullableIntFieldUpdateOperationsInput | number | null;
    is_deleted?: BoolFieldUpdateOperationsInput | boolean;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type usersCreateInput = {
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    password: string;
    role?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    worker_profiles?: worker_profilesCreateNestedManyWithoutUsersInput;
  };

  export type usersUncheckedCreateInput = {
    id?: number;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    password: string;
    role?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    worker_profiles?: worker_profilesUncheckedCreateNestedManyWithoutUsersInput;
  };

  export type usersUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string;
    first_name?: NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    role?: NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    worker_profiles?: worker_profilesUpdateManyWithoutUsersNestedInput;
  };

  export type usersUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    username?: StringFieldUpdateOperationsInput | string;
    first_name?: NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    role?: NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    worker_profiles?: worker_profilesUncheckedUpdateManyWithoutUsersNestedInput;
  };

  export type usersCreateManyInput = {
    id?: number;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    password: string;
    role?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type usersUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string;
    first_name?: NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    role?: NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type usersUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    username?: StringFieldUpdateOperationsInput | string;
    first_name?: NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    role?: NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type worker_profilesCreateInput = {
    id_card_number: string;
    title?: string | null;
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    mobile_phone_number: string;
    email?: string | null;
    id_card_file_path?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
    users: usersCreateNestedOneWithoutWorker_profilesInput;
  };

  export type worker_profilesUncheckedCreateInput = {
    id?: number;
    id_card_number: string;
    user_id: number;
    title?: string | null;
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    mobile_phone_number: string;
    email?: string | null;
    id_card_file_path?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type worker_profilesUpdateInput = {
    id_card_number?: StringFieldUpdateOperationsInput | string;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: StringFieldUpdateOperationsInput | string;
    last_name?: StringFieldUpdateOperationsInput | string;
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null;
    mobile_phone_number?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    id_card_file_path?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    users?: usersUpdateOneRequiredWithoutWorker_profilesNestedInput;
  };

  export type worker_profilesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number;
    id_card_number?: StringFieldUpdateOperationsInput | string;
    user_id?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: StringFieldUpdateOperationsInput | string;
    last_name?: StringFieldUpdateOperationsInput | string;
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null;
    mobile_phone_number?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    id_card_file_path?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type worker_profilesCreateManyInput = {
    id?: number;
    id_card_number: string;
    user_id: number;
    title?: string | null;
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    mobile_phone_number: string;
    email?: string | null;
    id_card_file_path?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type worker_profilesUpdateManyMutationInput = {
    id_card_number?: StringFieldUpdateOperationsInput | string;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: StringFieldUpdateOperationsInput | string;
    last_name?: StringFieldUpdateOperationsInput | string;
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null;
    mobile_phone_number?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    id_card_file_path?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type worker_profilesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number;
    id_card_number?: StringFieldUpdateOperationsInput | string;
    user_id?: IntFieldUpdateOperationsInput | number;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: StringFieldUpdateOperationsInput | string;
    last_name?: StringFieldUpdateOperationsInput | string;
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null;
    mobile_phone_number?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    id_card_file_path?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type companiesCountOrderByAggregateInput = {
    id?: SortOrder;
    company_name_en?: SortOrder;
    company_name_th?: SortOrder;
    tax_id?: SortOrder;
    address?: SortOrder;
    sub_district?: SortOrder;
    district?: SortOrder;
    province?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrder;
    fax_number?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type companiesAvgOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type companiesMaxOrderByAggregateInput = {
    id?: SortOrder;
    company_name_en?: SortOrder;
    company_name_th?: SortOrder;
    tax_id?: SortOrder;
    address?: SortOrder;
    sub_district?: SortOrder;
    district?: SortOrder;
    province?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrder;
    fax_number?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type companiesMinOrderByAggregateInput = {
    id?: SortOrder;
    company_name_en?: SortOrder;
    company_name_th?: SortOrder;
    tax_id?: SortOrder;
    address?: SortOrder;
    sub_district?: SortOrder;
    district?: SortOrder;
    province?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrder;
    fax_number?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type companiesSumOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?:
      | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
      | Date
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null;
  };

  export type Sample_listListRelationFilter = {
    every?: sample_listWhereInput;
    some?: sample_listWhereInput;
    none?: sample_listWhereInput;
  };

  export type sample_listOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type document_requestCountOrderByAggregateInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    request_date?: SortOrder;
    user_id?: SortOrder;
    company_id?: SortOrder;
    document_type?: SortOrder;
    description?: SortOrder;
    status?: SortOrder;
    paid_status?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type document_requestAvgOrderByAggregateInput = {
    id?: SortOrder;
    user_id?: SortOrder;
    company_id?: SortOrder;
  };

  export type document_requestMaxOrderByAggregateInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    request_date?: SortOrder;
    user_id?: SortOrder;
    company_id?: SortOrder;
    document_type?: SortOrder;
    description?: SortOrder;
    status?: SortOrder;
    paid_status?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type document_requestMinOrderByAggregateInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    request_date?: SortOrder;
    user_id?: SortOrder;
    company_id?: SortOrder;
    document_type?: SortOrder;
    description?: SortOrder;
    status?: SortOrder;
    paid_status?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type document_requestSumOrderByAggregateInput = {
    id?: SortOrder;
    user_id?: SortOrder;
    company_id?: SortOrder;
  };

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedBoolNullableFilter<$PrismaModel>;
    _max?: NestedBoolNullableFilter<$PrismaModel>;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type knex_migrationsCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    batch?: SortOrder;
    migration_time?: SortOrder;
  };

  export type knex_migrationsAvgOrderByAggregateInput = {
    id?: SortOrder;
    batch?: SortOrder;
  };

  export type knex_migrationsMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    batch?: SortOrder;
    migration_time?: SortOrder;
  };

  export type knex_migrationsMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    batch?: SortOrder;
    migration_time?: SortOrder;
  };

  export type knex_migrationsSumOrderByAggregateInput = {
    id?: SortOrder;
    batch?: SortOrder;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type knex_migrations_lockCountOrderByAggregateInput = {
    index?: SortOrder;
    is_locked?: SortOrder;
  };

  export type knex_migrations_lockAvgOrderByAggregateInput = {
    index?: SortOrder;
    is_locked?: SortOrder;
  };

  export type knex_migrations_lockMaxOrderByAggregateInput = {
    index?: SortOrder;
    is_locked?: SortOrder;
  };

  export type knex_migrations_lockMinOrderByAggregateInput = {
    index?: SortOrder;
    is_locked?: SortOrder;
  };

  export type knex_migrations_lockSumOrderByAggregateInput = {
    index?: SortOrder;
    is_locked?: SortOrder;
  };

  export type receipt_addressesCountOrderByAggregateInput = {
    id?: SortOrder;
    address?: SortOrder;
    province?: SortOrder;
    district?: SortOrder;
    sub_district?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrder;
    fax_number?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type receipt_addressesAvgOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type receipt_addressesMaxOrderByAggregateInput = {
    id?: SortOrder;
    address?: SortOrder;
    province?: SortOrder;
    district?: SortOrder;
    sub_district?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrder;
    fax_number?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type receipt_addressesMinOrderByAggregateInput = {
    id?: SortOrder;
    address?: SortOrder;
    province?: SortOrder;
    district?: SortOrder;
    sub_district?: SortOrder;
    postal_code?: SortOrder;
    telephone?: SortOrder;
    fax_number?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type receipt_addressesSumOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type Document_requestScalarRelationFilter = {
    is?: document_requestWhereInput;
    isNot?: document_requestWhereInput;
  };

  export type sample_listCountOrderByAggregateInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    sent_sample_date?: SortOrder;
    animal_type?: SortOrder;
    sample_specimen?: SortOrder;
    panel?: SortOrder;
    method?: SortOrder;
    sample_qty?: SortOrder;
    is_deleted?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type sample_listAvgOrderByAggregateInput = {
    id?: SortOrder;
    sample_qty?: SortOrder;
  };

  export type sample_listMaxOrderByAggregateInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    sent_sample_date?: SortOrder;
    animal_type?: SortOrder;
    sample_specimen?: SortOrder;
    panel?: SortOrder;
    method?: SortOrder;
    sample_qty?: SortOrder;
    is_deleted?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type sample_listMinOrderByAggregateInput = {
    id?: SortOrder;
    request_no?: SortOrder;
    sent_sample_date?: SortOrder;
    animal_type?: SortOrder;
    sample_specimen?: SortOrder;
    panel?: SortOrder;
    method?: SortOrder;
    sample_qty?: SortOrder;
    is_deleted?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type sample_listSumOrderByAggregateInput = {
    id?: SortOrder;
    sample_qty?: SortOrder;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type Worker_profilesListRelationFilter = {
    every?: worker_profilesWhereInput;
    some?: worker_profilesWhereInput;
    none?: worker_profilesWhereInput;
  };

  export type worker_profilesOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type usersCountOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    first_name?: SortOrder;
    last_name?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    role?: SortOrder;
    is_active?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type usersAvgOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type usersMaxOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    first_name?: SortOrder;
    last_name?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    role?: SortOrder;
    is_active?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type usersMinOrderByAggregateInput = {
    id?: SortOrder;
    username?: SortOrder;
    first_name?: SortOrder;
    last_name?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    role?: SortOrder;
    is_active?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type usersSumOrderByAggregateInput = {
    id?: SortOrder;
  };

  export type UsersScalarRelationFilter = {
    is?: usersWhereInput;
    isNot?: usersWhereInput;
  };

  export type worker_profilesCountOrderByAggregateInput = {
    id?: SortOrder;
    id_card_number?: SortOrder;
    user_id?: SortOrder;
    title?: SortOrder;
    first_name?: SortOrder;
    last_name?: SortOrder;
    phone_number?: SortOrder;
    mobile_phone_number?: SortOrder;
    email?: SortOrder;
    id_card_file_path?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type worker_profilesAvgOrderByAggregateInput = {
    id?: SortOrder;
    user_id?: SortOrder;
  };

  export type worker_profilesMaxOrderByAggregateInput = {
    id?: SortOrder;
    id_card_number?: SortOrder;
    user_id?: SortOrder;
    title?: SortOrder;
    first_name?: SortOrder;
    last_name?: SortOrder;
    phone_number?: SortOrder;
    mobile_phone_number?: SortOrder;
    email?: SortOrder;
    id_card_file_path?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type worker_profilesMinOrderByAggregateInput = {
    id?: SortOrder;
    id_card_number?: SortOrder;
    user_id?: SortOrder;
    title?: SortOrder;
    first_name?: SortOrder;
    last_name?: SortOrder;
    phone_number?: SortOrder;
    mobile_phone_number?: SortOrder;
    email?: SortOrder;
    id_card_file_path?: SortOrder;
    created_at?: SortOrder;
    updated_at?: SortOrder;
  };

  export type worker_profilesSumOrderByAggregateInput = {
    id?: SortOrder;
    user_id?: SortOrder;
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type sample_listCreateNestedManyWithoutDocument_requestInput = {
    create?:
      | XOR<
          sample_listCreateWithoutDocument_requestInput,
          sample_listUncheckedCreateWithoutDocument_requestInput
        >
      | sample_listCreateWithoutDocument_requestInput[]
      | sample_listUncheckedCreateWithoutDocument_requestInput[];
    connectOrCreate?:
      | sample_listCreateOrConnectWithoutDocument_requestInput
      | sample_listCreateOrConnectWithoutDocument_requestInput[];
    createMany?: sample_listCreateManyDocument_requestInputEnvelope;
    connect?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
  };

  export type sample_listUncheckedCreateNestedManyWithoutDocument_requestInput =
    {
      create?:
        | XOR<
            sample_listCreateWithoutDocument_requestInput,
            sample_listUncheckedCreateWithoutDocument_requestInput
          >
        | sample_listCreateWithoutDocument_requestInput[]
        | sample_listUncheckedCreateWithoutDocument_requestInput[];
      connectOrCreate?:
        | sample_listCreateOrConnectWithoutDocument_requestInput
        | sample_listCreateOrConnectWithoutDocument_requestInput[];
      createMany?: sample_listCreateManyDocument_requestInputEnvelope;
      connect?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
    };

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null;
  };

  export type sample_listUpdateManyWithoutDocument_requestNestedInput = {
    create?:
      | XOR<
          sample_listCreateWithoutDocument_requestInput,
          sample_listUncheckedCreateWithoutDocument_requestInput
        >
      | sample_listCreateWithoutDocument_requestInput[]
      | sample_listUncheckedCreateWithoutDocument_requestInput[];
    connectOrCreate?:
      | sample_listCreateOrConnectWithoutDocument_requestInput
      | sample_listCreateOrConnectWithoutDocument_requestInput[];
    upsert?:
      | sample_listUpsertWithWhereUniqueWithoutDocument_requestInput
      | sample_listUpsertWithWhereUniqueWithoutDocument_requestInput[];
    createMany?: sample_listCreateManyDocument_requestInputEnvelope;
    set?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
    disconnect?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
    delete?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
    connect?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
    update?:
      | sample_listUpdateWithWhereUniqueWithoutDocument_requestInput
      | sample_listUpdateWithWhereUniqueWithoutDocument_requestInput[];
    updateMany?:
      | sample_listUpdateManyWithWhereWithoutDocument_requestInput
      | sample_listUpdateManyWithWhereWithoutDocument_requestInput[];
    deleteMany?: sample_listScalarWhereInput | sample_listScalarWhereInput[];
  };

  export type sample_listUncheckedUpdateManyWithoutDocument_requestNestedInput =
    {
      create?:
        | XOR<
            sample_listCreateWithoutDocument_requestInput,
            sample_listUncheckedCreateWithoutDocument_requestInput
          >
        | sample_listCreateWithoutDocument_requestInput[]
        | sample_listUncheckedCreateWithoutDocument_requestInput[];
      connectOrCreate?:
        | sample_listCreateOrConnectWithoutDocument_requestInput
        | sample_listCreateOrConnectWithoutDocument_requestInput[];
      upsert?:
        | sample_listUpsertWithWhereUniqueWithoutDocument_requestInput
        | sample_listUpsertWithWhereUniqueWithoutDocument_requestInput[];
      createMany?: sample_listCreateManyDocument_requestInputEnvelope;
      set?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
      disconnect?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
      delete?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
      connect?: sample_listWhereUniqueInput | sample_listWhereUniqueInput[];
      update?:
        | sample_listUpdateWithWhereUniqueWithoutDocument_requestInput
        | sample_listUpdateWithWhereUniqueWithoutDocument_requestInput[];
      updateMany?:
        | sample_listUpdateManyWithWhereWithoutDocument_requestInput
        | sample_listUpdateManyWithWhereWithoutDocument_requestInput[];
      deleteMany?: sample_listScalarWhereInput | sample_listScalarWhereInput[];
    };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type document_requestCreateNestedOneWithoutSample_listInput = {
    create?: XOR<
      document_requestCreateWithoutSample_listInput,
      document_requestUncheckedCreateWithoutSample_listInput
    >;
    connectOrCreate?: document_requestCreateOrConnectWithoutSample_listInput;
    connect?: document_requestWhereUniqueInput;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type document_requestUpdateOneRequiredWithoutSample_listNestedInput = {
    create?: XOR<
      document_requestCreateWithoutSample_listInput,
      document_requestUncheckedCreateWithoutSample_listInput
    >;
    connectOrCreate?: document_requestCreateOrConnectWithoutSample_listInput;
    upsert?: document_requestUpsertWithoutSample_listInput;
    connect?: document_requestWhereUniqueInput;
    update?: XOR<
      XOR<
        document_requestUpdateToOneWithWhereWithoutSample_listInput,
        document_requestUpdateWithoutSample_listInput
      >,
      document_requestUncheckedUpdateWithoutSample_listInput
    >;
  };

  export type worker_profilesCreateNestedManyWithoutUsersInput = {
    create?:
      | XOR<
          worker_profilesCreateWithoutUsersInput,
          worker_profilesUncheckedCreateWithoutUsersInput
        >
      | worker_profilesCreateWithoutUsersInput[]
      | worker_profilesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?:
      | worker_profilesCreateOrConnectWithoutUsersInput
      | worker_profilesCreateOrConnectWithoutUsersInput[];
    createMany?: worker_profilesCreateManyUsersInputEnvelope;
    connect?:
      | worker_profilesWhereUniqueInput
      | worker_profilesWhereUniqueInput[];
  };

  export type worker_profilesUncheckedCreateNestedManyWithoutUsersInput = {
    create?:
      | XOR<
          worker_profilesCreateWithoutUsersInput,
          worker_profilesUncheckedCreateWithoutUsersInput
        >
      | worker_profilesCreateWithoutUsersInput[]
      | worker_profilesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?:
      | worker_profilesCreateOrConnectWithoutUsersInput
      | worker_profilesCreateOrConnectWithoutUsersInput[];
    createMany?: worker_profilesCreateManyUsersInputEnvelope;
    connect?:
      | worker_profilesWhereUniqueInput
      | worker_profilesWhereUniqueInput[];
  };

  export type worker_profilesUpdateManyWithoutUsersNestedInput = {
    create?:
      | XOR<
          worker_profilesCreateWithoutUsersInput,
          worker_profilesUncheckedCreateWithoutUsersInput
        >
      | worker_profilesCreateWithoutUsersInput[]
      | worker_profilesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?:
      | worker_profilesCreateOrConnectWithoutUsersInput
      | worker_profilesCreateOrConnectWithoutUsersInput[];
    upsert?:
      | worker_profilesUpsertWithWhereUniqueWithoutUsersInput
      | worker_profilesUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: worker_profilesCreateManyUsersInputEnvelope;
    set?: worker_profilesWhereUniqueInput | worker_profilesWhereUniqueInput[];
    disconnect?:
      | worker_profilesWhereUniqueInput
      | worker_profilesWhereUniqueInput[];
    delete?:
      | worker_profilesWhereUniqueInput
      | worker_profilesWhereUniqueInput[];
    connect?:
      | worker_profilesWhereUniqueInput
      | worker_profilesWhereUniqueInput[];
    update?:
      | worker_profilesUpdateWithWhereUniqueWithoutUsersInput
      | worker_profilesUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?:
      | worker_profilesUpdateManyWithWhereWithoutUsersInput
      | worker_profilesUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?:
      | worker_profilesScalarWhereInput
      | worker_profilesScalarWhereInput[];
  };

  export type worker_profilesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?:
      | XOR<
          worker_profilesCreateWithoutUsersInput,
          worker_profilesUncheckedCreateWithoutUsersInput
        >
      | worker_profilesCreateWithoutUsersInput[]
      | worker_profilesUncheckedCreateWithoutUsersInput[];
    connectOrCreate?:
      | worker_profilesCreateOrConnectWithoutUsersInput
      | worker_profilesCreateOrConnectWithoutUsersInput[];
    upsert?:
      | worker_profilesUpsertWithWhereUniqueWithoutUsersInput
      | worker_profilesUpsertWithWhereUniqueWithoutUsersInput[];
    createMany?: worker_profilesCreateManyUsersInputEnvelope;
    set?: worker_profilesWhereUniqueInput | worker_profilesWhereUniqueInput[];
    disconnect?:
      | worker_profilesWhereUniqueInput
      | worker_profilesWhereUniqueInput[];
    delete?:
      | worker_profilesWhereUniqueInput
      | worker_profilesWhereUniqueInput[];
    connect?:
      | worker_profilesWhereUniqueInput
      | worker_profilesWhereUniqueInput[];
    update?:
      | worker_profilesUpdateWithWhereUniqueWithoutUsersInput
      | worker_profilesUpdateWithWhereUniqueWithoutUsersInput[];
    updateMany?:
      | worker_profilesUpdateManyWithWhereWithoutUsersInput
      | worker_profilesUpdateManyWithWhereWithoutUsersInput[];
    deleteMany?:
      | worker_profilesScalarWhereInput
      | worker_profilesScalarWhereInput[];
  };

  export type usersCreateNestedOneWithoutWorker_profilesInput = {
    create?: XOR<
      usersCreateWithoutWorker_profilesInput,
      usersUncheckedCreateWithoutWorker_profilesInput
    >;
    connectOrCreate?: usersCreateOrConnectWithoutWorker_profilesInput;
    connect?: usersWhereUniqueInput;
  };

  export type usersUpdateOneRequiredWithoutWorker_profilesNestedInput = {
    create?: XOR<
      usersCreateWithoutWorker_profilesInput,
      usersUncheckedCreateWithoutWorker_profilesInput
    >;
    connectOrCreate?: usersCreateOrConnectWithoutWorker_profilesInput;
    upsert?: usersUpsertWithoutWorker_profilesInput;
    connect?: usersWhereUniqueInput;
    update?: XOR<
      XOR<
        usersUpdateToOneWithWhereWithoutWorker_profilesInput,
        usersUpdateWithoutWorker_profilesInput
      >,
      usersUncheckedUpdateWithoutWorker_profilesInput
    >;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
        | Date[]
        | string[]
        | ListDateTimeFieldRefInput<$PrismaModel>
        | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
        | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
        | Date
        | string
        | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null;
  };

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null;
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedBoolNullableFilter<$PrismaModel>;
    _max?: NestedBoolNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type sample_listCreateWithoutDocument_requestInput = {
    sent_sample_date?: Date | string | null;
    animal_type?: string | null;
    sample_specimen?: string | null;
    panel?: string | null;
    method?: string | null;
    sample_qty?: number | null;
    is_deleted?: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type sample_listUncheckedCreateWithoutDocument_requestInput = {
    id?: number;
    sent_sample_date?: Date | string | null;
    animal_type?: string | null;
    sample_specimen?: string | null;
    panel?: string | null;
    method?: string | null;
    sample_qty?: number | null;
    is_deleted?: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type sample_listCreateOrConnectWithoutDocument_requestInput = {
    where: sample_listWhereUniqueInput;
    create: XOR<
      sample_listCreateWithoutDocument_requestInput,
      sample_listUncheckedCreateWithoutDocument_requestInput
    >;
  };

  export type sample_listCreateManyDocument_requestInputEnvelope = {
    data:
      | sample_listCreateManyDocument_requestInput
      | sample_listCreateManyDocument_requestInput[];
    skipDuplicates?: boolean;
  };

  export type sample_listUpsertWithWhereUniqueWithoutDocument_requestInput = {
    where: sample_listWhereUniqueInput;
    update: XOR<
      sample_listUpdateWithoutDocument_requestInput,
      sample_listUncheckedUpdateWithoutDocument_requestInput
    >;
    create: XOR<
      sample_listCreateWithoutDocument_requestInput,
      sample_listUncheckedCreateWithoutDocument_requestInput
    >;
  };

  export type sample_listUpdateWithWhereUniqueWithoutDocument_requestInput = {
    where: sample_listWhereUniqueInput;
    data: XOR<
      sample_listUpdateWithoutDocument_requestInput,
      sample_listUncheckedUpdateWithoutDocument_requestInput
    >;
  };

  export type sample_listUpdateManyWithWhereWithoutDocument_requestInput = {
    where: sample_listScalarWhereInput;
    data: XOR<
      sample_listUpdateManyMutationInput,
      sample_listUncheckedUpdateManyWithoutDocument_requestInput
    >;
  };

  export type sample_listScalarWhereInput = {
    AND?: sample_listScalarWhereInput | sample_listScalarWhereInput[];
    OR?: sample_listScalarWhereInput[];
    NOT?: sample_listScalarWhereInput | sample_listScalarWhereInput[];
    id?: IntFilter<"sample_list"> | number;
    request_no?: StringFilter<"sample_list"> | string;
    sent_sample_date?:
      | DateTimeNullableFilter<"sample_list">
      | Date
      | string
      | null;
    animal_type?: StringNullableFilter<"sample_list"> | string | null;
    sample_specimen?: StringNullableFilter<"sample_list"> | string | null;
    panel?: StringNullableFilter<"sample_list"> | string | null;
    method?: StringNullableFilter<"sample_list"> | string | null;
    sample_qty?: IntNullableFilter<"sample_list"> | number | null;
    is_deleted?: BoolFilter<"sample_list"> | boolean;
    created_at?: DateTimeNullableFilter<"sample_list"> | Date | string | null;
    updated_at?: DateTimeNullableFilter<"sample_list"> | Date | string | null;
  };

  export type document_requestCreateWithoutSample_listInput = {
    request_no: string;
    request_date?: Date | string | null;
    user_id: number;
    company_id: number;
    document_type: string;
    description?: string | null;
    status?: string | null;
    paid_status?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type document_requestUncheckedCreateWithoutSample_listInput = {
    id?: number;
    request_no: string;
    request_date?: Date | string | null;
    user_id: number;
    company_id: number;
    document_type: string;
    description?: string | null;
    status?: string | null;
    paid_status?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type document_requestCreateOrConnectWithoutSample_listInput = {
    where: document_requestWhereUniqueInput;
    create: XOR<
      document_requestCreateWithoutSample_listInput,
      document_requestUncheckedCreateWithoutSample_listInput
    >;
  };

  export type document_requestUpsertWithoutSample_listInput = {
    update: XOR<
      document_requestUpdateWithoutSample_listInput,
      document_requestUncheckedUpdateWithoutSample_listInput
    >;
    create: XOR<
      document_requestCreateWithoutSample_listInput,
      document_requestUncheckedCreateWithoutSample_listInput
    >;
    where?: document_requestWhereInput;
  };

  export type document_requestUpdateToOneWithWhereWithoutSample_listInput = {
    where?: document_requestWhereInput;
    data: XOR<
      document_requestUpdateWithoutSample_listInput,
      document_requestUncheckedUpdateWithoutSample_listInput
    >;
  };

  export type document_requestUpdateWithoutSample_listInput = {
    request_no?: StringFieldUpdateOperationsInput | string;
    request_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user_id?: IntFieldUpdateOperationsInput | number;
    company_id?: IntFieldUpdateOperationsInput | number;
    document_type?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: NullableStringFieldUpdateOperationsInput | string | null;
    paid_status?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type document_requestUncheckedUpdateWithoutSample_listInput = {
    id?: IntFieldUpdateOperationsInput | number;
    request_no?: StringFieldUpdateOperationsInput | string;
    request_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user_id?: IntFieldUpdateOperationsInput | number;
    company_id?: IntFieldUpdateOperationsInput | number;
    document_type?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    status?: NullableStringFieldUpdateOperationsInput | string | null;
    paid_status?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type worker_profilesCreateWithoutUsersInput = {
    id_card_number: string;
    title?: string | null;
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    mobile_phone_number: string;
    email?: string | null;
    id_card_file_path?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type worker_profilesUncheckedCreateWithoutUsersInput = {
    id?: number;
    id_card_number: string;
    title?: string | null;
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    mobile_phone_number: string;
    email?: string | null;
    id_card_file_path?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type worker_profilesCreateOrConnectWithoutUsersInput = {
    where: worker_profilesWhereUniqueInput;
    create: XOR<
      worker_profilesCreateWithoutUsersInput,
      worker_profilesUncheckedCreateWithoutUsersInput
    >;
  };

  export type worker_profilesCreateManyUsersInputEnvelope = {
    data:
      | worker_profilesCreateManyUsersInput
      | worker_profilesCreateManyUsersInput[];
    skipDuplicates?: boolean;
  };

  export type worker_profilesUpsertWithWhereUniqueWithoutUsersInput = {
    where: worker_profilesWhereUniqueInput;
    update: XOR<
      worker_profilesUpdateWithoutUsersInput,
      worker_profilesUncheckedUpdateWithoutUsersInput
    >;
    create: XOR<
      worker_profilesCreateWithoutUsersInput,
      worker_profilesUncheckedCreateWithoutUsersInput
    >;
  };

  export type worker_profilesUpdateWithWhereUniqueWithoutUsersInput = {
    where: worker_profilesWhereUniqueInput;
    data: XOR<
      worker_profilesUpdateWithoutUsersInput,
      worker_profilesUncheckedUpdateWithoutUsersInput
    >;
  };

  export type worker_profilesUpdateManyWithWhereWithoutUsersInput = {
    where: worker_profilesScalarWhereInput;
    data: XOR<
      worker_profilesUpdateManyMutationInput,
      worker_profilesUncheckedUpdateManyWithoutUsersInput
    >;
  };

  export type worker_profilesScalarWhereInput = {
    AND?: worker_profilesScalarWhereInput | worker_profilesScalarWhereInput[];
    OR?: worker_profilesScalarWhereInput[];
    NOT?: worker_profilesScalarWhereInput | worker_profilesScalarWhereInput[];
    id?: IntFilter<"worker_profiles"> | number;
    id_card_number?: StringFilter<"worker_profiles"> | string;
    user_id?: IntFilter<"worker_profiles"> | number;
    title?: StringNullableFilter<"worker_profiles"> | string | null;
    first_name?: StringFilter<"worker_profiles"> | string;
    last_name?: StringFilter<"worker_profiles"> | string;
    phone_number?: StringNullableFilter<"worker_profiles"> | string | null;
    mobile_phone_number?: StringFilter<"worker_profiles"> | string;
    email?: StringNullableFilter<"worker_profiles"> | string | null;
    id_card_file_path?: StringNullableFilter<"worker_profiles"> | string | null;
    created_at?:
      | DateTimeNullableFilter<"worker_profiles">
      | Date
      | string
      | null;
    updated_at?:
      | DateTimeNullableFilter<"worker_profiles">
      | Date
      | string
      | null;
  };

  export type usersCreateWithoutWorker_profilesInput = {
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    password: string;
    role?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type usersUncheckedCreateWithoutWorker_profilesInput = {
    id?: number;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    email: string;
    password: string;
    role?: string | null;
    is_active?: boolean | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type usersCreateOrConnectWithoutWorker_profilesInput = {
    where: usersWhereUniqueInput;
    create: XOR<
      usersCreateWithoutWorker_profilesInput,
      usersUncheckedCreateWithoutWorker_profilesInput
    >;
  };

  export type usersUpsertWithoutWorker_profilesInput = {
    update: XOR<
      usersUpdateWithoutWorker_profilesInput,
      usersUncheckedUpdateWithoutWorker_profilesInput
    >;
    create: XOR<
      usersCreateWithoutWorker_profilesInput,
      usersUncheckedCreateWithoutWorker_profilesInput
    >;
    where?: usersWhereInput;
  };

  export type usersUpdateToOneWithWhereWithoutWorker_profilesInput = {
    where?: usersWhereInput;
    data: XOR<
      usersUpdateWithoutWorker_profilesInput,
      usersUncheckedUpdateWithoutWorker_profilesInput
    >;
  };

  export type usersUpdateWithoutWorker_profilesInput = {
    username?: StringFieldUpdateOperationsInput | string;
    first_name?: NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    role?: NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type usersUncheckedUpdateWithoutWorker_profilesInput = {
    id?: IntFieldUpdateOperationsInput | number;
    username?: StringFieldUpdateOperationsInput | string;
    first_name?: NullableStringFieldUpdateOperationsInput | string | null;
    last_name?: NullableStringFieldUpdateOperationsInput | string | null;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    role?: NullableStringFieldUpdateOperationsInput | string | null;
    is_active?: NullableBoolFieldUpdateOperationsInput | boolean | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type sample_listCreateManyDocument_requestInput = {
    id?: number;
    sent_sample_date?: Date | string | null;
    animal_type?: string | null;
    sample_specimen?: string | null;
    panel?: string | null;
    method?: string | null;
    sample_qty?: number | null;
    is_deleted?: boolean;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type sample_listUpdateWithoutDocument_requestInput = {
    sent_sample_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    animal_type?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_specimen?: NullableStringFieldUpdateOperationsInput | string | null;
    panel?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_qty?: NullableIntFieldUpdateOperationsInput | number | null;
    is_deleted?: BoolFieldUpdateOperationsInput | boolean;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type sample_listUncheckedUpdateWithoutDocument_requestInput = {
    id?: IntFieldUpdateOperationsInput | number;
    sent_sample_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    animal_type?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_specimen?: NullableStringFieldUpdateOperationsInput | string | null;
    panel?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_qty?: NullableIntFieldUpdateOperationsInput | number | null;
    is_deleted?: BoolFieldUpdateOperationsInput | boolean;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type sample_listUncheckedUpdateManyWithoutDocument_requestInput = {
    id?: IntFieldUpdateOperationsInput | number;
    sent_sample_date?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    animal_type?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_specimen?: NullableStringFieldUpdateOperationsInput | string | null;
    panel?: NullableStringFieldUpdateOperationsInput | string | null;
    method?: NullableStringFieldUpdateOperationsInput | string | null;
    sample_qty?: NullableIntFieldUpdateOperationsInput | number | null;
    is_deleted?: BoolFieldUpdateOperationsInput | boolean;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type worker_profilesCreateManyUsersInput = {
    id?: number;
    id_card_number: string;
    title?: string | null;
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    mobile_phone_number: string;
    email?: string | null;
    id_card_file_path?: string | null;
    created_at?: Date | string | null;
    updated_at?: Date | string | null;
  };

  export type worker_profilesUpdateWithoutUsersInput = {
    id_card_number?: StringFieldUpdateOperationsInput | string;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: StringFieldUpdateOperationsInput | string;
    last_name?: StringFieldUpdateOperationsInput | string;
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null;
    mobile_phone_number?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    id_card_file_path?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type worker_profilesUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number;
    id_card_number?: StringFieldUpdateOperationsInput | string;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: StringFieldUpdateOperationsInput | string;
    last_name?: StringFieldUpdateOperationsInput | string;
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null;
    mobile_phone_number?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    id_card_file_path?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type worker_profilesUncheckedUpdateManyWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number;
    id_card_number?: StringFieldUpdateOperationsInput | string;
    title?: NullableStringFieldUpdateOperationsInput | string | null;
    first_name?: StringFieldUpdateOperationsInput | string;
    last_name?: StringFieldUpdateOperationsInput | string;
    phone_number?: NullableStringFieldUpdateOperationsInput | string | null;
    mobile_phone_number?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    id_card_file_path?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    created_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    updated_at?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
