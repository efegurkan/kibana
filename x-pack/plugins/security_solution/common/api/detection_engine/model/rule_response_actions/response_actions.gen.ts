/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from 'zod';

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: Response Actions Schema
 *   version: not applicable
 */

export type ResponseActionTypes = z.infer<typeof ResponseActionTypes>;
export const ResponseActionTypes = z.enum(['.osquery', '.endpoint']);
export type ResponseActionTypesEnum = typeof ResponseActionTypes.enum;
export const ResponseActionTypesEnum = ResponseActionTypes.enum;

export type EcsMapping = z.infer<typeof EcsMapping>;
export const EcsMapping = z.object({}).catchall(
  z.object({
    field: z.string().optional(),
    value: z.union([z.string(), z.array(z.string())]).optional(),
  })
);

export type OsqueryQuery = z.infer<typeof OsqueryQuery>;
export const OsqueryQuery = z.object({
  /**
   * Query ID
   */
  id: z.string(),
  /**
   * Query to execute
   */
  query: z.string(),
  ecs_mapping: EcsMapping.optional(),
  /**
   * Query version
   */
  version: z.string().optional(),
  platform: z.string().optional(),
  removed: z.boolean().optional(),
  snapshot: z.boolean().optional(),
});

export type OsqueryParams = z.infer<typeof OsqueryParams>;
export const OsqueryParams = z.object({
  query: z.string().optional(),
  ecs_mapping: EcsMapping.optional(),
  queries: z.array(OsqueryQuery).optional(),
  pack_id: z.string().optional(),
  saved_query_id: z.string().optional(),
  timeout: z.number().optional(),
});

export type OsqueryParamsCamelCase = z.infer<typeof OsqueryParamsCamelCase>;
export const OsqueryParamsCamelCase = z.object({
  query: z.string().optional(),
  ecsMapping: EcsMapping.optional(),
  queries: z.array(OsqueryQuery).optional(),
  packId: z.string().optional(),
  savedQueryId: z.string().optional(),
  timeout: z.number().optional(),
});

export type OsqueryResponseAction = z.infer<typeof OsqueryResponseAction>;
export const OsqueryResponseAction = z.object({
  action_type_id: z.literal('.osquery'),
  params: OsqueryParams,
});

export type RuleResponseOsqueryAction = z.infer<typeof RuleResponseOsqueryAction>;
export const RuleResponseOsqueryAction = z.object({
  actionTypeId: z.literal('.osquery'),
  params: OsqueryParamsCamelCase,
});

export type DefaultParams = z.infer<typeof DefaultParams>;
export const DefaultParams = z.object({
  command: z.literal('isolate'),
  comment: z.string().optional(),
});

export type ProcessesParams = z.infer<typeof ProcessesParams>;
export const ProcessesParams = z.object({
  command: z.enum(['kill-process', 'suspend-process']),
  comment: z.string().optional(),
  config: z.object({
    /**
     * Field to use instead of process.pid
     */
    field: z.string(),
    /**
     * Whether to overwrite field with process.pid
     */
    overwrite: z.boolean().optional().default(true),
  }),
});

export type EndpointResponseAction = z.infer<typeof EndpointResponseAction>;
export const EndpointResponseAction = z.object({
  action_type_id: z.literal('.endpoint'),
  params: z.union([DefaultParams, ProcessesParams]),
});

export type RuleResponseEndpointAction = z.infer<typeof RuleResponseEndpointAction>;
export const RuleResponseEndpointAction = z.object({
  actionTypeId: z.literal('.endpoint'),
  params: z.union([DefaultParams, ProcessesParams]),
});

export type ResponseAction = z.infer<typeof ResponseAction>;
export const ResponseAction = z.union([OsqueryResponseAction, EndpointResponseAction]);

export type RuleResponseAction = z.infer<typeof RuleResponseAction>;
export const RuleResponseAction = z.union([RuleResponseOsqueryAction, RuleResponseEndpointAction]);
