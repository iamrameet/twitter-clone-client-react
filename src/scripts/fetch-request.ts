// <reference path=""/>

import UserRequest from "../helper/user";
import TweetRequest from "../helper/tweet";
import HashtagRequest from "../helper/hashtag";
import NotificationRequest from "../helper/notification";

type ParamsType<T extends string> =
  T extends `${infer Prefix}:${infer Param}?/${infer Suffix}`
    ? [Param?, ...ParamsType<`/${Suffix}`>]
    : T extends `${infer Prefix}:${infer Param}/${infer Suffix}`
    ? [Param, ...ParamsType<`/${Suffix}`>]
    : T extends `${infer Prefix}:${infer Param}`
    ? [Param]
    : [];

type QueriesType<T extends string> =
T extends `${infer Prefix}?${infer Query}/${infer Suffix}`
  ? [ ...QueriesType<`/${Suffix}`>]
  : T extends `${infer Prefix}?${infer Query}&${infer Suffix}`
    ? [Query, ...QueriesType<`&${Suffix}`>]
    : T extends `${infer Prefix}&${infer Query}&${infer Suffix}`
    ? [Query, ...QueriesType<`&${Suffix}`>]
    : T extends `${infer Prefix}?${infer Query}`
    ? [Query]
    : T extends `${infer Prefix}&${infer Query}`
    ? [Query]
    : [];

type EndpointWithoutParam<T extends string> = T extends `${infer Prefix}:${infer Param}` ? Prefix : never;

type GetEndPointResponseMap = {
  [key in keyof typeof UserRequest.get as `/user${key}`]: {
    params: ParamsType<key>,
    queries: QueriesType<key>,
    returns: ReturnType<typeof UserRequest.get[key]>
  }
} & {
  [key in keyof typeof TweetRequest.get as `/tweet${key}`]: {
    params: ParamsType<key>,
    queries: QueriesType<key>,
    returns: ReturnType<typeof TweetRequest.get[key]>
  };
} & {
  [key in keyof typeof HashtagRequest.get as `/hashtag${key}`]: {
    params: ParamsType<key>,
    queries: QueriesType<key>,
    returns: ReturnType<typeof HashtagRequest.get[key]>
  };
} & {
  [key in keyof typeof NotificationRequest.get as `/notification${key}`]: {
    params: ParamsType<key>,
    queries: QueriesType<key>,
    returns: ReturnType<typeof NotificationRequest.get[key]>
  };
};

export type { GetEndPointResponseMap };

type PostEndPointResponseMap = {
  [key in keyof typeof UserRequest.post as `/user${key}`]: {
    params: ParamsType<key>,
    queries: QueriesType<key>,
    returns: ReturnType<typeof UserRequest.post[key]>
  };
} & {
  [key in keyof typeof TweetRequest.post as `/tweet${key}`]: {
    params: ParamsType<key>,
    queries: QueriesType<key>,
    returns: ReturnType<typeof TweetRequest.post[key]>
  };
};

type PutEndPointResponseMap = {
  [key in keyof typeof UserRequest.put as `/user${key}`]: {
    params: ParamsType<key>,
    returns: ReturnType<typeof UserRequest.put[key]>
  };
};

type DeleteEndPointResponseMap = {
  [key in keyof typeof UserRequest.delete as `/user${key}`]: {
    params: ParamsType<key>,
    returns: ReturnType<typeof UserRequest.delete[key]>
  };
} & {
  [key in keyof typeof TweetRequest.delete as `/tweet${key}`]: {
    params: ParamsType<key>,
    returns: ReturnType<typeof TweetRequest.delete[key]>
  };
};

type EndPointResponseMap = {
  get: GetEndPointResponseMap;
  post: PostEndPointResponseMap;
  put: PutEndPointResponseMap;
  delete: DeleteEndPointResponseMap;
};

type Ternary<M, K, E> = K extends keyof M ? M : E;
type ObjectFromOptionalArray<T extends (string | undefined)[]> = {
  [K in T[number] as K extends undefined ? never : K]: string | number | boolean;
};



// type array = ["a", "c", ("b" | undefined)?];
// type objects = ObjectFromOptionalArray<array>;


type EndPointType<T extends keyof EndPointResponseMap> = EndPointResponseMap[T] extends PostEndPointResponseMap
  ? PostEndPointResponseMap
  : EndPointResponseMap[T] extends GetEndPointResponseMap
  ? GetEndPointResponseMap
  : EndPointResponseMap[T] extends PutEndPointResponseMap
  ? PutEndPointResponseMap
  : EndPointResponseMap[T] extends DeleteEndPointResponseMap
  ? DeleteEndPointResponseMap
  : never;

type EndPointReturnType<M extends keyof EndPointResponseMap, U extends keyof EndPointResponseMap[M]> = EndPointResponseMap[M][U] extends { returns: any } ? EndPointResponseMap[M][U]["returns"] : never;

export default class FetchRequest{

  static #host = "http://localhost/" as const;
  // static #host = "https://twitter-clone-excs.onrender.com/";
  static #APIHost = this.#host + "api";
  static get host(){
    return this.#host;
  }

  static #parsePathWithParams(path: string, fields: { [field: string]: string | number | boolean }){
    for(const key in fields){
      const regex = new RegExp(":" + key + "\\??(\/|$)")
      path = path.replace(regex, fields[key] + "$1");
    }
    return path;
  }

  static #parsePathWithQueries(path: string, fields: { [field: string]: string | number | boolean }){
    for(const key in fields){
      const regex = new RegExp("([?&]" + key + ")")
      path = path.replace(regex, "$1=" + fields[key]);
    }
    return path;
  }

  static get<E extends keyof GetEndPointResponseMap>(
    endPoint: E,
    paramFields?: ObjectFromOptionalArray<GetEndPointResponseMap[E]["params"]>,
    queryFields?: { [param in GetEndPointResponseMap[E]["queries"][number]]: string | number | boolean }
  ): Promise<GetEndPointResponseMap[E]["returns"]> {
    return new Promise((resolve, reject) => {
      let path = this.#parsePathWithParams(endPoint, paramFields ?? {});
      path = this.#parsePathWithQueries(path, queryFields ?? {});
      fetch(this.#APIHost + path, {
        credentials: "include"
      })
      .then(async response => {
        if(!response.ok){
          return void reject(await response.text());
        }
        const object = await response.json();
        resolve(object);
      })
      .catch(ex => {
        console.log(ex);
        reject("GET request failed");
      });
    });
  }

  static post<E extends keyof PostEndPointResponseMap>(
    endPoint: E,
    data: {},
    fields?: { [param in PostEndPointResponseMap[E]["params"][number]]: string | number | boolean }
  ): Promise<PostEndPointResponseMap[E]["returns"]> {
    return new Promise((resolve, reject) => {
      fetch(this.#APIHost + this.#parsePathWithParams(endPoint, fields ?? {}), {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      })
      .then(async response => {
        if(!response.ok){
          return void reject(await response.text());
        }
        const object = await response.json();
        resolve(object);
      })
      .catch(ex => {
        console.log(ex);
        reject("POST request failed");
      });
    });
  }

  static delete<E extends keyof DeleteEndPointResponseMap>(
    endPoint: E,
    fields?: { [param in DeleteEndPointResponseMap[E]["params"][number]]: string | number | boolean }
  ): Promise<DeleteEndPointResponseMap[E]["returns"]> {
    return new Promise((resolve, reject) => {
      fetch(this.#APIHost + this.#parsePathWithParams(endPoint, fields ?? {}), {
        method: "DELETE",
        credentials: "include"
      })
      .then(async response => {
        if(!response.ok){
          return void reject(await response.text());
        }
        const object = await response.json();
        resolve(object);
      })
      .catch(ex => {
        console.log(ex);
        reject("DELETE request failed");
      });
    });
  }

  static put<E extends keyof PutEndPointResponseMap>(
    endPoint: E,
    data: {},
    fields?: { [param in PutEndPointResponseMap[E]["params"][number]]: string | number | boolean }
  ): Promise<PutEndPointResponseMap[E]["returns"]> {
    return new Promise((resolve, reject) => {
      fetch(this.#APIHost + this.#parsePathWithParams(endPoint, fields ?? {}), {
        method: "put",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      })
      .then(async response => {
        if(!response.ok){
          return void reject(await response.text());
        }
        const object = await response.json();
        resolve(object);
      })
      .catch(ex => {
        console.log(ex);
        reject("POST request failed");
      });
    });
  }

  static sendForm(form: HTMLFormElement, asFormData = false){

    const formData = new FormData(form);

    return new Promise((resolve, reject) => {
      (asFormData ? fetch(form.action, {
        method: form.method,
        body: formData
      }) : fetch(form.action, {
        method: form.method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>)
      }))
      .then(async response => {
        if(!response.ok){
          return void reject(await response.text());
        }
        const object = await response.json();
        resolve(object);
      })
      .catch(ex => {
        console.log(ex);
        reject("POST request failed");
      });
    });
  }

  static sendFormData<M extends keyof EndPointResponseMap, U extends keyof EndPointResponseMap[M]>(
    method: M,
    url: U,
    formData: FormData
  ): Promise<EndPointReturnType<M, U>> {
    return new Promise((resolve, reject) => {
      fetch(this.#APIHost + url.toString(), { method, credentials: "include", body: formData })
      .then(async response => {
        if(!response.ok){
          return void reject(await response.text());
        }
        const object = await response.json();
        resolve(object);
      })
      .catch(ex => {
        console.log(ex);
        reject("Unable to send form data");
      });
    });
  }

  static putFormData<E extends keyof PutEndPointResponseMap>(
    endPoint: E,
    formData: FormData,
    fields?: { [param in PutEndPointResponseMap[E]["params"][number]]: string | number | boolean }
  ): Promise<PutEndPointResponseMap[E]["returns"]> {
    return new Promise((resolve, reject) => {
      fetch(this.#APIHost + this.#parsePathWithParams(endPoint, fields ?? {}), {
        method: "put",
        credentials: "include",
        body: formData
      })
      .then(async response => {
        if(!response.ok){
          return void reject(await response.text());
        }
        const object = await response.json();
        resolve(object);
      })
      .catch(ex => {
        console.log(ex);
        reject("Unable to update");
      });
    });
  }

};