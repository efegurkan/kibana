/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export const GET_STATUS_ROUTE = '/internal/search_homepage/status';
export const GET_USER_PRIVILEGES_ROUTE = '/internal/search_homepage/start_privileges/{indexName}';
export const GET_API_KEYS_ROUTE = '/internal/search_homepage/api_keys';
export const GET_STATS_ROUTE = '/internal/search_homepage/stats';

export const POST_REGISTER_FEATURE_ROUTE = '/internal/search_homepage/dummy/register_feature';
export const POST_CREATE_INFERENCE_ENDPOINT_ROUTE =
  '/internal/search_homepage/dummy/inference_endpoint';
export const POST_SAVE_RECOMMENDATIONS_ROUTE =
  '/internal/search_homepage/dummy/save_recommendations';
export const GET_RECOMMENDATIONS_ROUTE = '/internal/search_homepage/dummy/recommendations';
export const GET_INFERENCE_ENDPOINTS_ROUTE = '/internal/search_homepage/dummy/inference_endpoints';
export const GET_RESOLVE_ENDPOINTS_ROUTE =
  '/internal/search_homepage/dummy/resolve_endpoints/{featureId}';
export const GET_FEATURES_ROUTE = '/internal/search_homepage/dummy/features';
