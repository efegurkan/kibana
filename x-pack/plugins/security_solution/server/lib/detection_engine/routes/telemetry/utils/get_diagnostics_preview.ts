/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { Logger } from '@kbn/core/server';

import { PreviewTelemetryEventsSender } from '../../../../telemetry/preview_sender';
import type { ITelemetryReceiver } from '../../../../telemetry/receiver';
import { PreviewTaskMetricsService } from '../../../../telemetry/preview_task_metrics';
import type { ITelemetryEventsSender } from '../../../../telemetry/sender';
import { createTelemetryDiagnosticsTaskConfig } from '../../../../telemetry/tasks/diagnostic';
import { parseNdjson } from './parse_ndjson';

export const getDiagnosticsPreview = async ({
  logger,
  telemetryReceiver,
  telemetrySender,
}: {
  logger: Logger;
  telemetryReceiver: ITelemetryReceiver;
  telemetrySender: ITelemetryEventsSender;
}): Promise<object[][]> => {
  const taskExecutionPeriod = {
    last: new Date(0).toISOString(),
    current: new Date().toISOString(),
  };

  const taskSender = new PreviewTelemetryEventsSender(logger, telemetrySender);
  const taskMetricsService = new PreviewTaskMetricsService(logger, taskSender);
  const task = createTelemetryDiagnosticsTaskConfig();
  await task.runTask(
    'diagnostics-preview',
    logger,
    telemetryReceiver,
    taskSender,
    taskMetricsService,
    taskExecutionPeriod
  );
  const messages = taskSender.getSentMessages();
  const taskMetrics = taskMetricsService.getSentMessages();
  return parseNdjson([...messages, ...taskMetrics]);
};
