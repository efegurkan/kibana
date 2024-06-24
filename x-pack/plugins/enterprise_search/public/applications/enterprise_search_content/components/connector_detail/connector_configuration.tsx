/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import { useActions, useValues } from 'kea';

import {
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSkeletonLoading,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';

import { i18n } from '@kbn/i18n';

import { ConnectorConfigurationComponent, ConnectorStatus } from '@kbn/search-connectors';

import { Status } from '../../../../../common/types/api';
import { docLinks } from '../../../shared/doc_links';
import { HttpLogic } from '../../../shared/http';
import { LicensingLogic } from '../../../shared/licensing';
import { hasNonEmptyAdvancedSnippet, isExampleConnector } from '../../utils/connector_helpers';
import { isLastSeenOld } from '../../utils/connector_status_helpers';

import { ConnectorFilteringLogic } from '../search_index/connector/sync_rules/connector_filtering_logic';

import { AttachIndexBox } from './attach_index_box';
import { AdvancedConfigOverrideCallout } from './components/advanced_config_override_callout';
import { ConfigurationSkeleton } from './components/configuration_skeleton';
import { ExampleConfigCallout } from './components/example_config_callout';
import { ConnectorViewLogic } from './connector_view_logic';
import { ConnectorDeployment } from './deployment';
import { NativeConnectorConfiguration } from './native_connector_configuration';

export const ConnectorConfiguration: React.FC = () => {
  const { connector, updateConnectorConfigurationStatus } = useValues(ConnectorViewLogic);
  const { hasPlatinumLicense } = useValues(LicensingLogic);
  const { http } = useValues(HttpLogic);
  const { advancedSnippet } = useValues(ConnectorFilteringLogic);

  const { updateConnectorConfiguration } = useActions(ConnectorViewLogic);

  if (!connector) {
    return <></>;
  }

  if (connector.is_native && connector.service_type) {
    return <NativeConnectorConfiguration />;
  }

  const isWaitingForConnector = !connector.status || connector.status === ConnectorStatus.CREATED;

  return (
    <>
      <EuiSpacer />
      {
        // TODO remove this callout when example status is removed
        isExampleConnector(connector) && <ExampleConfigCallout />
      }
      <EuiFlexGroup>
        <EuiFlexItem>
          <AttachIndexBox connector={connector} />
          <EuiSpacer />
          {connector.index_name && (
            <>
              <ConnectorDeployment />
              <EuiSpacer />
              <EuiPanel hasShadow={false} hasBorder>
                <EuiTitle size="s">
                  <h3>
                    {i18n.translate(
                      'xpack.enterpriseSearch.content.connector_detail.configurationConnector.configuration.title',
                      { defaultMessage: 'Configuration' }
                    )}
                  </h3>
                </EuiTitle>
                <EuiSpacer />
                <EuiSkeletonLoading
                  isLoading={isWaitingForConnector}
                  loadingContent={<ConfigurationSkeleton />}
                  loadedContent={
                    <ConnectorConfigurationComponent
                      connector={connector}
                      hasPlatinumLicense={hasPlatinumLicense}
                      isLoading={updateConnectorConfigurationStatus === Status.LOADING}
                      saveConfig={(configuration) =>
                        updateConnectorConfiguration({
                          configuration,
                          connectorId: connector.id,
                        })
                      }
                      subscriptionLink={docLinks.licenseManagement}
                      stackManagementLink={http.basePath.prepend(
                        '/app/management/stack/license_management'
                      )}
                    >
                      {!isLastSeenOld(connector) && (
                        <EuiCallOut
                          iconType="check"
                          color="success"
                          title={i18n.translate(
                            'xpack.enterpriseSearch.content.connector_detail.configurationConnector.connectorPackage.connectorConnected',
                            {
                              defaultMessage:
                                'Your connector {name} has connected to Search successfully.',
                              values: { name: connector.name },
                            }
                          )}
                        />
                      )}
                      <EuiSpacer size="s" />
                      {hasNonEmptyAdvancedSnippet(connector, advancedSnippet) && (
                        <AdvancedConfigOverrideCallout />
                      )}
                    </ConnectorConfigurationComponent>
                  }
                />
              </EuiPanel>
            </>
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
