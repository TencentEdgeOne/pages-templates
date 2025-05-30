interface ListResult {
  complete: boolean;
  cursor: string;
  keys: Array<ListKey>;
}
interface ListKey {
  key: string;
}
declare class KVNamespace {
  put(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream
  ): Promise<void>;
  get(
    key: string,
    object?: { type: string }
  ): Promise<string | object | ArrayBuffer | ReadableStream>;
  delete(key: string): Promise<void>;
  list(config: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<ListResult>;
}

export type { KVNamespace };
