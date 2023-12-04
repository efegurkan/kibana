/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ConnectorType } from '@kbn/search-connectors';

import { SyncJobsStats } from '../../../../../common/stats';

import { createApiLogic } from '../../../shared/api_logic/create_api_logic';
import { HttpLogic } from '../../../shared/http';

export type FetchSyncJobsStatsResponse = SyncJobsStats;

export interface FetchSyncJobsStatsApiLogicArgs {
  connectorType?: ConnectorType;
}

export const fetchSyncJobsStats = async ({ connectorType }: FetchSyncJobsStatsApiLogicArgs) => {
  const route = '/internal/enterprise_search/stats/sync_jobs';
  const options = connectorType ? { query: { connector_type: connectorType } } : undefined;
  return await HttpLogic.values.http.get<FetchSyncJobsStatsResponse>(route, options);
};

export const FetchSyncJobsStatsApiLogic = createApiLogic(
  ['enterprise_search_content', 'fetch_sync_jobs_stats_api_logic'],
  fetchSyncJobsStats
);
