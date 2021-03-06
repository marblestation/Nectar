import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextPageContext
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import Api from './api';

const defaultParams = {
  fl: 'bibcode,title,id,pubdate,author,author_count,[fields author=10]',
  sort: 'date desc',
};

const normalizeQuery = (query: ParsedUrlQuery) => {
  return Object.keys(query).reduce((acc, k) => {
    const value = query[k];
    if (!value) {
      return acc;
    }
    return {
      ...acc,
      [k]: Array.isArray(value) ? value.join('') : value ?? '',
    };
  }, {});
};

const search = async ({ ctx, req, searchParams }: ISearchProps) => {
  const request = ctx ? ctx.req : req ? req : undefined;
  if (!request) {
    throw new Error('no context/request object found');
  }
  const query = ctx ? ctx.query : req ? req.query : {};

  const params: SearchParams = {
    ...defaultParams,
    ...normalizeQuery(query),
    ...searchParams,
  };

  if (!params.q) {
    throw new Error('no query');
  }

  const { data: searchResponse } = await Api.request<SearchPayload>(
    {
      url: '/search/query',
      params,
    },
    { req: request }
  );

  return searchResponse;
};

export interface SearchParams {
  q?: string;
  fl?: string;
  sort?: string;
  rows?: number;
}

export interface ISearchProps {
  ctx?: NextPageContext | GetServerSidePropsContext<ParsedUrlQuery>;
  req?: NextApiRequest;
  searchParams?: SearchParams;
}

export default search;

// export interface SearchParams {
//   query: string;
//   fields?: string;
//   sort?: string;
//   nextCursorMark?: string;
// }
// const search = async ({
//   query,
//   fields,
//   sort,
//   nextCursorMark,
// }: SearchParams) => {
//   if (query.length === 0) {
//     throw new Error('No Query');
//   }

//   const res = await API.get<SearchPayload>('search/query', {
//     params: {
//       q: query,
//       fl:
//         fields ??
//         'bibcode,title,id,pubdate,author,author_count,[fields author=10]',
//       sort: `id asc,${sort ?? 'date desc'}`,
//       cursorMark: nextCursorMark ?? '*',
//     },
//     paramsSerializer: (params) => {
//       console.log('params', params);
//       return qs.stringify(params);
//     },
//   });
//   return processResponse(res.data);
// };

// const processResponse = (payload: SearchPayload): SearchResult => {
//   const { response, nextCursorMark } = payload;

//   return {
//     ...response,
//     nextCursorMark,
//     docs: response.docs.map((d) => ({
//       ...d,
//       pubdate:
//         d.pubdate &&
//         d.pubdate.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/, '$2/$1'),
//     })),
//   };
// };

// export default search;

export interface SearchResult extends Response {
  // nextCursorMark: string;
}

export interface SearchPayload {
  responseHeader: ResponseHeader;
  response: Response;
  nextCursorMark: string;
}
export interface ResponseHeader {
  status: number;
  QTime: number;
  params: Params;
}
export interface Params {
  q: string;
  fl: string;
  fq_database: string;
  start: string;
  internal_logging_params: string;
  sort: string;
  fq: string;
  rows: string;
  __filter_database_fq_database?: string[] | null;
  wt: string;
  __clearBigQuery: string;
}
export interface Response {
  numFound: number;
  start: number;
  docs: DocsEntity[];
}
export interface DocsEntity {
  identifier: string[];
  pubdate: string;
  citation_count_norm: number;
  abstract: string;
  links_data: string[];
  pubnote: string[];
  property: string[];
  id: string;
  aff: string[];
  page: string[];
  bibcode: string;
  author: string[];
  esources: string[];
  orcid_pub: string[];
  email: string[];
  citation_count: number;
  pub: string;
  volume: string;
  doi: string[];
  keyword: string[];
  doctype: string;
  read_count: number;
  author_count: number;
  pub_raw: string;
  title: string[];
  '[citations]': [citations];
}
export interface citations {
  num_references: number;
  num_citations: number;
}
