/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useFormContext } from 'react-hook-form';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { APIRoutes, ChatFormFields, Pagination } from '../types';
import { useKibana } from './use_kibana';
import { DEFAULT_PAGINATION } from '../../common';

export interface UseSearchPreviewArgs {
  query: string;
  pagination: Pagination;
}

export interface UseSearchPreviewResponse {
  results: SearchHit[];
  pagination: Pagination;
}

export const useSearchPreview = () => {
  const { getValues } = useFormContext();
  const { services } = useKibana();
  const { http } = services;

  return async ({
    query,
    pagination: paginationParam = DEFAULT_PAGINATION,
  }: UseSearchPreviewArgs): Promise<UseSearchPreviewResponse> => {
    const { results, pagination } = await http.post<{
      results: SearchHit[];
      pagination: Pagination;
    }>(APIRoutes.POST_SEARCH_QUERY, {
      body: JSON.stringify({
        search_query: query,
        elasticsearch_query: JSON.stringify(getValues(ChatFormFields.elasticsearchQuery)),
        indices: getValues(ChatFormFields.indices),
        size: paginationParam.size,
        from: paginationParam.from,
      }),
    });
    return { results, pagination };
  };
};
