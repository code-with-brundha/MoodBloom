import { useMemo, useState } from 'react';
import OverviewCard from './data/OverviewCard.jsx';
import ExportCard from './data/ExportCard.jsx';
import ImportCard from './data/ImportCard.jsx';
import ClearCard from './data/ClearCard.jsx';
import StorageInfoCard from './data/StorageInfoCard.jsx';
import { getOverview } from '../../utils/dataManagement.js';

/**
 * Data Management: overview, export, import, clear and storage information.
 * Everything here works on data saved in THIS browser only (no cloud, no Supabase yet).
 * TODO (next step, Supabase): add cloud export / account-level deletion and read from the user's real data.
 */
export default function DataManagementSection() {
  // Bump `version` after an import or a clear so the overview and lists are read from storage again.
  const [version, setVersion] = useState(0);
  const overview = useMemo(() => getOverview(), [version]); // eslint-disable-line react-hooks/exhaustive-deps
  const refresh = () => setVersion((v) => v + 1);

  return (
    <div className="space-y-6">
      <OverviewCard overview={overview} />
      <ExportCard overview={overview} />
      <ImportCard onDone={refresh} />
      <ClearCard overview={overview} onDone={refresh} />
      <StorageInfoCard />
    </div>
  );
}
