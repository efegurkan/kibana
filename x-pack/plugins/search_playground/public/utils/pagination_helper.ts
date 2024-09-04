/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Pagination } from '../types';

export const getPageCounts = (pagination: Pagination) => {
  const { total, from, size } = pagination;
  const totalPage = Math.ceil(total / size);
  const page = Math.floor(from / size);
  return { totalPage, total, page, size };
};

export const getPaginationFromPage = (page: number, size: number, previousValue: Pagination) => {
  const from = page < 0 ? 0 : page * size;
  return { ...previousValue, from, size, page };
};
