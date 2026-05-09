import "./AgentTable.css";
import { AgentData } from "../../lib/mocks/soporte.mock";

interface AgentTableProps {
  agents: AgentData[];
}

export default function AgentTable({ agents }: AgentTableProps) {
  return (
    <div className="agent-table">
      <div className="agent-table__header">
        <div className="agent-table__title">Rendimiento de Agentes</div>
      </div>

      <div className="agent-table__list">
        {agents.map((agent, index) => (
          <div key={agent.agente} className="agent-table__row">
            <div className="agent-table__left">
              <div
                className={`agent-table__rank ${
                  index === 0 ? "agent-table__rank--top" : ""
                }`}
              >
                {index + 1}
              </div>
              <div>
                <div className="agent-table__name">{agent.agente}</div>
                <div className="agent-table__tickets">
                  {agent.tickets} tickets
                </div>
              </div>
            </div>
            <div className="agent-table__right">
              <div className="agent-table__stat">
                <div className="agent-table__stat-label">Promedio</div>
                <div className="agent-table__stat-value">{agent.promedio}</div>
              </div>
              <div className="agent-table__stat">
                <div className="agent-table__stat-label">CSAT</div>
                <div className="agent-table__stat-value agent-table__stat-value--csat">
                  {agent.satisfaccion}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}