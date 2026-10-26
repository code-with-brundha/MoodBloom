import { useMemo, useState } from 'react';
import OverviewCard from './data/OverviewCard.jsx';
import ImportCard from './data/ImportCard.jsx';
import StorageInfoCard from './data/StorageInfoCard.jsx';
import { getOverview } from '../../utils/dataManagement.js';
import CloudExportCard from './CloudExportCard.jsx';

/**
 * Data Management section.
 * Keeps the Supabase export and existing browser-local management features.
 */
export default function DataManagementSection() {
  const [version, setVersion] = useState(0);
  const overview = useMemo(() => getOverview(), [version]);
  const refresh = () => setVersion((v) => v + 1);

  return (
    <div className="space-y-6">
      <CloudExportCard />
      <ImportCard onDone={refresh} />
      <StorageInfoCard />
    </div>
  );
}
