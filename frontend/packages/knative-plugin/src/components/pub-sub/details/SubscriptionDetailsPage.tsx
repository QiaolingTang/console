import * as React from 'react';
import { useParams, useLocation } from 'react-router-dom-v5-compat';
import { useActivePerspective } from '@console/dynamic-plugin-sdk';
import { DetailsPage } from '@console/internal/components/factory';
import { navFactory } from '@console/internal/components/utils';
import { referenceForModel } from '@console/internal/module/k8s';
import {
  ActionMenu,
  ActionMenuVariant,
  ActionServiceProvider,
  useTabbedTableBreadcrumbsFor,
} from '@console/shared';
import { serverlessTab } from '../../../utils/serverless-tab-utils';
import SubscriptionDetails from './SubscriptionDetails';

const SubscriptionDetailsPage: React.FC<React.ComponentProps<typeof DetailsPage>> = (props) => {
  const { kindObj } = props;
  const params = useParams();
  const location = useLocation();
  const isAdminPerspective = useActivePerspective()[0] === 'admin';
  const customActionMenu = (kindObjData, obj) => {
    const resourceKind = referenceForModel(kindObjData);
    const context = { [resourceKind]: obj };
    return (
      <ActionServiceProvider context={context}>
        {({ actions, options, loaded }) =>
          loaded && (
            <ActionMenu actions={actions} options={options} variant={ActionMenuVariant.DROPDOWN} />
          )
        }
      </ActionServiceProvider>
    );
  };

  const pages = [navFactory.details(SubscriptionDetails), navFactory.editYaml()];
  const breadcrumbs = useTabbedTableBreadcrumbsFor(
    kindObj,
    location,
    params,
    'eventing',
    serverlessTab(kindObj.kind),
    undefined,
    isAdminPerspective,
  );

  return (
    <DetailsPage
      {...props}
      breadcrumbsFor={() => breadcrumbs}
      pages={pages}
      customActionMenu={customActionMenu}
    />
  );
};

export default SubscriptionDetailsPage;
