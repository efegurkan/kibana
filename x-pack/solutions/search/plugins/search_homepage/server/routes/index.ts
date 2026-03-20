/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { IRouter } from '@kbn/core/server';
import type { Logger } from '@kbn/logging';
import type {
  SearchInferenceEndpointsPluginSetup,
  SearchInferenceEndpointsPluginStart,
} from '@kbn/search-inference-endpoints/server';

import { registerStatusRoutes } from './status';
import { registerApiKeyRoutes } from './api_key_routes';
import { registerStatsRoutes } from './size_stats';
import { registerDummyRoutes } from './dummy_routes';
import type { RouterContextData } from '../types';

interface RoutesDeps extends RouterContextData {
  inferenceEndpointsSetup: SearchInferenceEndpointsPluginSetup;
  getInferenceEndpointsStart: () => Promise<SearchInferenceEndpointsPluginStart>;
}

export function defineRoutes(router: IRouter, logger: Logger, deps: RoutesDeps) {
  registerApiKeyRoutes(router, logger);
  registerStatusRoutes(router, logger);
  registerStatsRoutes(router, logger, deps);
  registerDummyRoutes(router, logger, {
    inferenceEndpointsSetup: deps.inferenceEndpointsSetup,
    getInferenceEndpointsStart: deps.getInferenceEndpointsStart,
  });
}
