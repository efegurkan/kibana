/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Criteria,
  EuiButtonEmpty,
  EuiTableFieldDataColumnType,
  EuiBasicTable,
  EuiBasicTableProps,
  useEuiTheme,
  EuiSwitch,
  EuiCheckbox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTableSortingType,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { uniqBy } from 'lodash';
import type { CspBenchmarkRulesWithStates, RulesState } from './rules_container';
import * as TEST_SUBJECTS from './test_subjects';
import { RuleStateAttributesWithoutStates, useChangeCspRuleState } from './change_csp_rule_state';

export const RULES_ROWS_ENABLE_SWITCH_BUTTON = 'rules-row-enable-switch-button';
export const RULES_ROW_SELECT_ALL_CURRENT_PAGE = 'cloud-security-fields-selector-item-all';

type RulesTableProps = Pick<
  RulesState,
  'loading' | 'error' | 'rules_page' | 'total' | 'perPage' | 'page'
> & {
  setPagination(pagination: Pick<RulesState, 'perPage' | 'page'>): void;
  setSelectedRuleId(id: string | null): void;
  selectedRuleId: string | null;
  refetchRulesStates: () => void;
  selectedRules: CspBenchmarkRulesWithStates[];
  setSelectedRules: (rules: CspBenchmarkRulesWithStates[]) => void;
  onSortChange: (value: 'asc' | 'desc') => void;
};

type GetColumnProps = Pick<
  RulesTableProps,
  'setSelectedRuleId' | 'refetchRulesStates' | 'selectedRules' | 'setSelectedRules'
> & {
  postRequestChangeRulesStates: (
    actionOnRule: 'mute' | 'unmute',
    ruleIds: RuleStateAttributesWithoutStates[]
  ) => void;
  items: CspBenchmarkRulesWithStates[];
  setIsAllRulesSelectedThisPage: (isAllRulesSelected: boolean) => void;
  isAllRulesSelectedThisPage: boolean;
  isCurrentPageRulesASubset: (
    currentPageRulesArray: CspBenchmarkRulesWithStates[],
    selectedRulesArray: CspBenchmarkRulesWithStates[]
  ) => boolean;
};

export const RulesTable = ({
  setPagination,
  setSelectedRuleId,
  perPage: pageSize,
  rules_page: items,
  page,
  total,
  loading,
  error,
  selectedRuleId,
  refetchRulesStates,
  selectedRules,
  setSelectedRules,
  onSortChange,
}: RulesTableProps) => {
  const { euiTheme } = useEuiTheme();
  const euiPagination: EuiBasicTableProps<CspBenchmarkRulesWithStates>['pagination'] = {
    pageIndex: page,
    pageSize,
    totalItemCount: total,
    pageSizeOptions: [10, 25, 100],
  };
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const sorting: EuiTableSortingType<CspBenchmarkRulesWithStates> = {
    sort: {
      field: 'metadata.benchmark.rule_number' as keyof CspBenchmarkRulesWithStates,
      direction: sortDirection,
    },
  };

  const onTableChange = ({
    page: pagination,
    sort: sortOrder,
  }: Criteria<CspBenchmarkRulesWithStates>) => {
    if (!pagination) return;
    if (pagination) setPagination({ page: pagination.index, perPage: pagination.size });
    if (sortOrder) {
      setSortDirection(sortOrder.direction);
      onSortChange(sortOrder.direction);
    }
  };

  const rowProps = (row: CspBenchmarkRulesWithStates) => ({
    ['data-test-subj']: TEST_SUBJECTS.getCspBenchmarkRuleTableRowItemTestId(row.metadata?.id),
    style: {
      background: row.metadata?.id === selectedRuleId ? euiTheme.colors.highlight : undefined,
    },
  });

  const [isAllRulesSelectedThisPage, setIsAllRulesSelectedThisPage] = useState<boolean>(false);
  const postRequestChangeRulesStates = useChangeCspRuleState();

  const isCurrentPageRulesASubset = (
    currentPageRulesArray: CspBenchmarkRulesWithStates[],
    selectedRulesArray: CspBenchmarkRulesWithStates[]
  ) => {
    let i: number = 0;
    const newCurrentPageRulesArray = currentPageRulesArray.map((rule) => rule.metadata);
    const newSelectedRulesArray = selectedRulesArray.map((rule) => rule.metadata);

    while (i < newCurrentPageRulesArray.length) {
      if (!newSelectedRulesArray.includes(newCurrentPageRulesArray[i])) return false;
      i++;
    }
    return true;
  };

  useEffect(() => {
    if (selectedRules.length >= items.length && items.length > 0 && selectedRules.length > 0)
      setIsAllRulesSelectedThisPage(true);
    else setIsAllRulesSelectedThisPage(false);
  }, [items.length, selectedRules.length]);

  const columns = useMemo(
    () =>
      getColumns({
        setSelectedRuleId,
        refetchRulesStates,
        postRequestChangeRulesStates,
        selectedRules,
        setSelectedRules,
        items,
        setIsAllRulesSelectedThisPage,
        isAllRulesSelectedThisPage,
        isCurrentPageRulesASubset,
      }),
    [
      setSelectedRuleId,
      refetchRulesStates,
      postRequestChangeRulesStates,
      selectedRules,
      setSelectedRules,
      items,
      isAllRulesSelectedThisPage,
    ]
  );

  return (
    <>
      <EuiBasicTable
        data-test-subj={TEST_SUBJECTS.CSP_RULES_TABLE}
        loading={loading}
        error={error}
        items={items}
        columns={columns}
        pagination={euiPagination}
        onChange={onTableChange}
        itemId={(v) => v.metadata.id}
        rowProps={rowProps}
        sorting={sorting}
      />
    </>
  );
};

const getColumns = ({
  setSelectedRuleId,
  refetchRulesStates,
  postRequestChangeRulesStates,
  selectedRules,
  setSelectedRules,
  items,
  isAllRulesSelectedThisPage,
  isCurrentPageRulesASubset,
}: GetColumnProps): Array<EuiTableFieldDataColumnType<CspBenchmarkRulesWithStates>> => [
  {
    field: 'action',
    name: (
      <EuiCheckbox
        id={RULES_ROW_SELECT_ALL_CURRENT_PAGE}
        checked={isCurrentPageRulesASubset(items, selectedRules) && isAllRulesSelectedThisPage}
        onChange={(e) => {
          const uniqueSelectedRules = uniqBy([...selectedRules, ...items], 'metadata.id');
          const onChangeSelectAllThisPageFn = () => {
            setSelectedRules(uniqueSelectedRules);
          };
          const onChangeDeselectAllThisPageFn = () => {
            setSelectedRules(
              selectedRules.filter(
                (element: CspBenchmarkRulesWithStates) =>
                  !items.find(
                    (item: CspBenchmarkRulesWithStates) =>
                      item.metadata?.id === element.metadata?.id
                  )
              )
            );
          };
          return isCurrentPageRulesASubset(items, selectedRules) && isAllRulesSelectedThisPage
            ? onChangeDeselectAllThisPageFn()
            : onChangeSelectAllThisPageFn();
        }}
      />
    ),
    width: '40px',
    sortable: false,
    render: (rules, item: CspBenchmarkRulesWithStates) => {
      return (
        <EuiCheckbox
          checked={selectedRules.some(
            (rule: CspBenchmarkRulesWithStates) => rule.metadata?.id === item.metadata?.id
          )}
          id={`cloud-security-fields-selector-item-${item.metadata?.id}`}
          data-test-subj={`cloud-security-fields-selector-item-${item.metadata?.id}`}
          onChange={(e) => {
            const isChecked = e.target.checked;
            return isChecked
              ? setSelectedRules([...selectedRules, item])
              : setSelectedRules(
                  selectedRules.filter(
                    (rule: CspBenchmarkRulesWithStates) => rule.metadata?.id !== item.metadata?.id
                  )
                );
          }}
        />
      );
    },
  },
  {
    field: 'metadata.benchmark.rule_number',
    name: i18n.translate('xpack.csp.rules.rulesTable.ruleNumberColumnLabel', {
      defaultMessage: 'Rule Number',
    }),
    width: '120px',
    sortable: true,
  },
  {
    field: 'metadata.name',
    name: i18n.translate('xpack.csp.rules.rulesTable.nameColumnLabel', {
      defaultMessage: 'Name',
    }),
    width: '60%',
    truncateText: true,
    render: (name, rule: CspBenchmarkRulesWithStates) => (
      <EuiButtonEmpty
        className="eui-textTruncate"
        title={name}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          setSelectedRuleId(rule.metadata.id);
        }}
        data-test-subj={TEST_SUBJECTS.CSP_RULES_TABLE_ROW_ITEM_NAME}
      >
        {name}
      </EuiButtonEmpty>
    ),
  },
  {
    field: 'metadata.section',
    name: i18n.translate('xpack.csp.rules.rulesTable.cisSectionColumnLabel', {
      defaultMessage: 'CIS Section',
    }),
    width: '24%',
  },
  {
    field: 'metadata.name',
    name: i18n.translate('xpack.csp.rules.rulesTable.mutedColumnLabel', {
      defaultMessage: 'Enabled',
    }),
    align: 'right',
    width: '100px',
    truncateText: true,
    render: (name, rule: CspBenchmarkRulesWithStates) => {
      const rulesObjectRequest = {
        benchmark_id: rule?.metadata.benchmark.id,
        benchmark_version: rule?.metadata.benchmark.version,
        /* Rule number always exists from 8.7 */
        rule_number: rule?.metadata.benchmark.rule_number!,
        rule_id: rule?.metadata.id,
      };
      const isRuleMuted = rule?.state === 'muted';
      const nextRuleState = isRuleMuted ? 'unmute' : 'mute';

      const useChangeCspRuleStateFn = async () => {
        if (rule?.metadata.benchmark.rule_number) {
          await postRequestChangeRulesStates(nextRuleState, [rulesObjectRequest]);
          await refetchRulesStates();
        }
      };
      return (
        <EuiFlexGroup justifyContent="flexEnd">
          <EuiFlexItem grow={false}>
            <EuiSwitch
              className="eui-textTruncate"
              checked={!isRuleMuted}
              onChange={useChangeCspRuleStateFn}
              data-test-subj={RULES_ROWS_ENABLE_SWITCH_BUTTON}
              label=""
              compressed={true}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      );
    },
  },
];
