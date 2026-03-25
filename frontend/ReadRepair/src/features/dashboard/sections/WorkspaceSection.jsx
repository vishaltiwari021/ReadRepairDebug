import EnvironmentPanel from "../components/EnvironmentPanel.jsx";
import DocumentSetupPanel from "../components/DocumentSetupPanel.jsx";
import ReplicaDriftPanel from "../components/ReplicaDriftPanel.jsx";
import ActionsPanel from "../components/ActionsPanel.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import ActivityTimeline from "../components/ActivityTimeline.jsx";
import { useReadRepairDashboard } from "../hooks/useReadRepairDashboard.js";

function WorkspaceSection() {
  const { state, actions } = useReadRepairDashboard();

  return (
    <section className="my-16" id="workspace">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-primary font-bold tracking-wider text-sm uppercase block mb-3">Live Workspace</span>
        <h2 className="text-4xl font-bold mb-4">Run the full read-repair flow from one dashboard.</h2>
        <p className="text-base-content/70">
          Each panel handles one job: connection setup, document changes, replica drift,
          repair actions, and result tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <EnvironmentPanel
          apiBaseUrl={state.apiBaseUrl}
          onApiBaseUrlChange={actions.setApiBaseUrl}
        />

        <DocumentSetupPanel
          docId={state.docId}
          name={state.name}
          balance={state.balance}
          newBalance={state.newBalance}
          onDocIdChange={actions.setDocId}
          onNameChange={actions.setName}
          onBalanceChange={actions.setBalance}
          onNewBalanceChange={actions.setNewBalance}
        />

        <ReplicaDriftPanel
          staleReplica={state.staleReplica}
          staleVersion={state.staleVersion}
          onStaleReplicaChange={actions.setStaleReplica}
          onStaleVersionChange={actions.setStaleVersion}
        />

        <div className="col-span-1 lg:col-span-2 xl:col-span-3">
          <ActionsPanel loadingAction={state.loadingAction} actions={actions} />
        </div>

        <div className="col-span-1 lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
          <OutputPanel
            title="Last Read Result"
            value={state.lastRead}
            emptyMessage="No read has been performed yet."
          />
          <OutputPanel
            title="Metrics Snapshot"
            value={state.metrics}
            emptyMessage="Load metrics to see backend state."
          />
        </div>

        <div className="col-span-1 lg:col-span-1 xl:col-span-2">
          <ActivityTimeline logs={state.logs} />
        </div>
      </div>
    </section>
  );
}

export default WorkspaceSection;
