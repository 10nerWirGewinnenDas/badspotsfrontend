/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum VoteType {
  UP = "UP",
  DOWN = "DOWN",
}

export interface Vote {
  id: string;
  type: VoteType;
  spotId: string;
  /** @format date-time */
  createdAt: string;
  voterId: string;
}

export interface Comment {
  id: string;
  authorName?: string;
  spotId: string;
  text: string;
  /** @format date-time */
  createdAt: string;
}

export interface BlackSpotCounts {
  votes: number;
  comments: number;
}

export interface GetBlackSpotDto {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  finished: boolean;
  archived: boolean;
  city: string;
  votes: Vote[];
  comments: Comment[];
  _count: BlackSpotCounts;
}

export interface CreateBlackSpotDto {
  name: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  archived: boolean;
  voterId?: string;
}

export interface BlackSpotCreatedDto {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  latitude: number;
  longitude: number;
  finished: boolean;
  archived: boolean;
  type: VoteType;
  spotId: string;
  /** @format date-time */
  createdAt: string;
  voterId: string;
  city: string;
}

export interface FileUploadDto {
  /** @format binary */
  file: File;
}

export interface CreateVoteDto {
  voterId?: string;
  type: "UP" | "DOWN";
  blackSpotId: string;
}

export interface GetVoteDto {
  id: string;
  type: VoteType;
  spotId: string;
  /** @format date-time */
  createdAt: string;
  voterId: string;
}

export interface CreateCommentDto {
  authorName?: string;
  spotId: string;
  text: string;
}

export interface GetCategoryDto {
  id: string;
  name: string;
  city: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title BlackSpots API
 * @version 2.0
 * @contact
 *
 * The BlackSpots API documentation
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @name BlackSpotsControllerFindAll
     * @request GET:/api/v2/blackspots
     */
    blackSpotsControllerFindAll: (
      query?: {
        topLeftLat?: number;
        topLeftLng?: number;
        bottomRightLat?: number;
        bottomRightLng?: number;
        voterId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetBlackSpotDto[], any>({
        path: `/api/v2/blackspots`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name BlackSpotsControllerCreate
     * @request POST:/api/v2/blackspots
     */
    blackSpotsControllerCreate: (data: CreateBlackSpotDto, params: RequestParams = {}) =>
      this.request<BlackSpotCreatedDto, any>({
        path: `/api/v2/blackspots`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name BlackSpotsControllerUploadImage
     * @request POST:/api/v2/blackspots/{id}/image
     */
    blackSpotsControllerUploadImage: (id: string, data: FileUploadDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v2/blackspots/${id}/image`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @name BlackSpotsControllerGetImage
     * @request GET:/api/v2/blackspots/{id}/image
     */
    blackSpotsControllerGetImage: (id: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/v2/blackspots/${id}/image`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name BlackSpotsControllerVote
     * @request POST:/api/v2/blackspots/{id}/vote
     */
    blackSpotsControllerVote: (id: string, data: CreateVoteDto, params: RequestParams = {}) =>
      this.request<GetVoteDto, any>({
        path: `/api/v2/blackspots/${id}/vote`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name BlackSpotsControllerUnVote
     * @request POST:/api/v2/blackspots/{id}/unVote
     */
    blackSpotsControllerUnVote: (id: string, data: CreateVoteDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v2/blackspots/${id}/unVote`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name BlackSpotCommentsControllerCreateComment
     * @request POST:/api/v2/blackspots/comments
     */
    blackSpotCommentsControllerCreateComment: (data: CreateCommentDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v2/blackspots/comments`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name BlackSpotStatsControllerIn10Km
     * @request GET:/api/v2/blackspots/stats/in10km
     */
    blackSpotStatsControllerIn10Km: (
      query: {
        longitude: number;
        latitude: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<GetBlackSpotDto[], any>({
        path: `/api/v2/blackspots/stats/in10km`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CategoriesControllerFindAll
     * @request GET:/api/v2/categories
     */
    categoriesControllerFindAll: (params: RequestParams = {}) =>
      this.request<GetCategoryDto[], any>({
        path: `/api/v2/categories`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
