/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import type { IRouter } from '@kbn/core/server';
import type { Logger } from '@kbn/logging';
import type {
  SearchInferenceEndpointsPluginSetup,
  SearchInferenceEndpointsPluginStart,
} from '@kbn/search-inference-endpoints/server';

import {
  POST_REGISTER_FEATURE_ROUTE,
  POST_CREATE_INFERENCE_ENDPOINT_ROUTE,
  POST_SAVE_RECOMMENDATIONS_ROUTE,
  GET_RECOMMENDATIONS_ROUTE,
  GET_INFERENCE_ENDPOINTS_ROUTE,
  GET_RESOLVE_ENDPOINTS_ROUTE,
  GET_FEATURES_ROUTE,
} from '../../common/routes';

interface DummyRoutesDeps {
  inferenceEndpointsSetup: SearchInferenceEndpointsPluginSetup;
  getInferenceEndpointsStart: () => Promise<SearchInferenceEndpointsPluginStart>;
}

export const registerDummyRoutes = (
  router: IRouter,
  logger: Logger,
  { inferenceEndpointsSetup, getInferenceEndpointsStart }: DummyRoutesDeps
): void => {
  // POST - Register a feature
  router.post(
    {
      path: POST_REGISTER_FEATURE_ROUTE,
      security: {
        authz: {
          enabled: false,
          reason: 'This route is for dummy/testing purposes',
        },
      },
      validate: {
        body: schema.object({
          featureId: schema.string(),
          parentFeatureId: schema.maybe(schema.string()),
          featureName: schema.string(),
          featureDescription: schema.string(),
          taskType: schema.string(),
          maxNumberOfEndpoints: schema.maybe(schema.number()),
          recommendedEndpoints: schema.arrayOf(schema.string()),
        }),
      },
      options: {
        access: 'internal',
      },
    },
    async (_context, request, response) => {
      const result = inferenceEndpointsSetup.features.register(request.body);
      if (!result.ok) {
        return response.badRequest({ body: { message: result.error } });
      }
      return response.ok({ body: { ok: true } });
    }
  );

  // POST - Create inference endpoint (placeholder)
  router.post(
    {
      path: POST_CREATE_INFERENCE_ENDPOINT_ROUTE,
      security: {
        authz: {
          enabled: false,
          reason: 'This route is for dummy/testing purposes',
        },
      },
      validate: {
        body: schema.object({
          inferenceId: schema.string(),
          taskType: schema.string(),
          service: schema.string(),
          serviceSettings: schema.recordOf(schema.string(), schema.any()),
        }),
      },
      options: {
        access: 'internal',
      },
    },
    async (context, request, response) => {
      const { client } = (await context.core).elasticsearch;
      try {
        const result = await client.asCurrentUser.inference.put({
          inference_id: request.body.inferenceId,
          task_type: request.body.taskType,
          inference_config: {
            service: request.body.service,
            service_settings: request.body.serviceSettings,
          },
        });
        return response.ok({ body: result });
      } catch (e) {
        logger.error(e);
        return response.customError({
          statusCode: e.statusCode ?? 500,
          body: { message: e.message },
        });
      }
    }
  );

  // POST - Save recommendations for a feature
  router.post(
    {
      path: POST_SAVE_RECOMMENDATIONS_ROUTE,
      security: {
        authz: {
          enabled: false,
          reason: 'This route is for dummy/testing purposes',
        },
      },
      validate: {
        body: schema.object({
          featureId: schema.string(),
          recommendedEndpoints: schema.arrayOf(schema.string()),
        }),
      },
      options: {
        access: 'internal',
      },
    },
    async (_context, request, response) => {
      const start = await getInferenceEndpointsStart();
      const feature = start.features.get(request.body.featureId);
      if (!feature) {
        return response.notFound({
          body: { message: `Feature ${request.body.featureId} not found` },
        });
      }
      // Re-register with updated recommendations
      const result = start.features.register({
        ...feature,
        recommendedEndpoints: request.body.recommendedEndpoints,
      });
      if (!result.ok) {
        return response.badRequest({ body: { message: result.error } });
      }
      return response.ok({ body: { ok: true } });
    }
  );

  // GET - Get recommendations for all features
  router.get(
    {
      path: GET_RECOMMENDATIONS_ROUTE,
      security: {
        authz: {
          enabled: false,
          reason: 'This route is for dummy/testing purposes',
        },
      },
      validate: {},
      options: {
        access: 'internal',
      },
    },
    async (_context, _request, response) => {
      const start = await getInferenceEndpointsStart();
      const features = start.features.getAll();
      const recommendations = features.map((feature) => ({
        featureId: feature.featureId,
        recommendedEndpoints: feature.recommendedEndpoints,
      }));
      return response.ok({ body: recommendations });
    }
  );

  // GET - Get all inference endpoints
  router.get(
    {
      path: GET_INFERENCE_ENDPOINTS_ROUTE,
      security: {
        authz: {
          enabled: false,
          reason: 'This route is for dummy/testing purposes',
        },
      },
      validate: {},
      options: {
        access: 'internal',
      },
    },
    async (context, _request, response) => {
      const { client } = (await context.core).elasticsearch;
      try {
        const result = await client.asCurrentUser.inference.get({
          inference_id: '_all',
        });
        return response.ok({ body: result });
      } catch (e) {
        logger.error(e);
        return response.customError({
          statusCode: e.statusCode ?? 500,
          body: { message: e.message },
        });
      }
    }
  );

  // GET - Resolve endpoints for a feature
  router.get(
    {
      path: GET_RESOLVE_ENDPOINTS_ROUTE,
      security: {
        authz: {
          enabled: false,
          reason: 'This route is for dummy/testing purposes',
        },
      },
      validate: {
        params: schema.object({
          featureId: schema.string(),
        }),
      },
      options: {
        access: 'internal',
      },
    },
    async (_context, request, response) => {
      const start = await getInferenceEndpointsStart();
      try {
        const resolved = await start.endpoints.getForFeature(request.params.featureId);
        return response.ok({ body: resolved });
      } catch (e) {
        logger.error(e);
        return response.customError({
          statusCode: e.statusCode ?? 500,
          body: { message: e.message },
        });
      }
    }
  );

  // GET - Get all registered features
  router.get(
    {
      path: GET_FEATURES_ROUTE,
      security: {
        authz: {
          enabled: false,
          reason: 'This route is for dummy/testing purposes',
        },
      },
      validate: {},
      options: {
        access: 'internal',
      },
    },
    async (_context, _request, response) => {
      const start = await getInferenceEndpointsStart();
      const features = start.features.getAll();
      return response.ok({ body: features });
    }
  );
};
