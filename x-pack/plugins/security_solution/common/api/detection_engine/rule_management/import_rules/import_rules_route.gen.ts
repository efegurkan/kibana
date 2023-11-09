/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from 'zod';
import { BooleanFromString } from '@kbn/zod-helpers';

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 */

import { ErrorSchema } from '../../model/error_schema.gen';
import { WarningSchema } from '../../model/warning_schema.gen';

export type ImportRulesRequestQuery = z.infer<typeof ImportRulesRequestQuery>;
export const ImportRulesRequestQuery = z.object({
  /**
   * Determines whether existing rules with the same `rule_id` are overwritten.
   */
  overwrite: BooleanFromString.optional().default(false),
  /**
   * Determines whether existing exception lists with the same `list_id` are overwritten.
   */
  overwrite_exceptions: BooleanFromString.optional().default(false),
  /**
   * Determines whether existing actions with the same `kibana.alert.rule.actions.id` are overwritten.
   */
  overwrite_action_connectors: BooleanFromString.optional().default(false),
  /**
   * Generates a new list ID for each imported exception list.
   */
  as_new_list: BooleanFromString.optional().default(false),
});
export type ImportRulesRequestQueryInput = z.input<typeof ImportRulesRequestQuery>;

export type ImportRulesResponse = z.infer<typeof ImportRulesResponse>;
export const ImportRulesResponse = z
  .object({
    exceptions_success: z.boolean(),
    exceptions_success_count: z.number().int().min(0),
    exceptions_errors: z.array(ErrorSchema),
    rules_count: z.number().int().min(0),
    success: z.boolean(),
    success_count: z.number().int().min(0),
    errors: z.array(ErrorSchema),
    action_connectors_errors: z.array(ErrorSchema),
    action_connectors_warnings: z.array(WarningSchema),
    action_connectors_success: z.boolean(),
    action_connectors_success_count: z.number().int().min(0),
  })
  .strict();
