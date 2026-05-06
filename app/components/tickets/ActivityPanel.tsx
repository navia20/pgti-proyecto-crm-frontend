import "./ActivityPanel.css";
import { Circle, User, AlertCircle, Tag } from "lucide-react";
import { TicketActivity } from "../../lib/types/ticket.types";

interface ActivityPanelProps {
  activity: TicketActivity[];
}

function ActivityIcon({ type }: { type: TicketActivity["type"] }) {
  const props = { size: 13, className: "activity-panel__icon" };
  switch (type) {
    case "status_change": return <Circle {...props} />;
    case "assignment": return <User {...props} />;
    case "priority_change": return <AlertCircle {...props} />;
    case "tag_added": return <Tag {...props} />;
  }
}

function ActivityText({ item }: { item: TicketActivity }) {
  switch (item.type) {
    case "status_change":
      return (
        <p className="activity-panel__text">
          <strong>{item.user}</strong> cambió el estado de{" "}
          <strong>{item.from}</strong> a <strong>{item.to}</strong>
        </p>
      );
    case "assignment":
      return (
        <p className="activity-panel__text">
          <strong>{item.user}</strong> asignó a{" "}
          <strong>{item.assignee}</strong>
        </p>
      );
    case "priority_change":
      return (
        <p className="activity-panel__text">
          <strong>{item.user}</strong> cambió prioridad de{" "}
          <strong>{item.from}</strong> a <strong>{item.to}</strong>
        </p>
      );
    case "tag_added":
      return (
        <p className="activity-panel__text">
          <strong>{item.user}</strong> agregó tag{" "}
          <strong>{item.tag}</strong>
        </p>
      );
  }
}

export default function ActivityPanel({ activity }: ActivityPanelProps) {
  return (
    <div className="activity-panel">
      <div className="activity-panel__header">Actividad</div>
      <div className="activity-panel__list">
        {activity.map((item) => (
          <div key={item.id} className="activity-panel__item">
            <ActivityIcon type={item.type} />
            <div className="activity-panel__body">
              <ActivityText item={item} />
              <div className="activity-panel__time">{item.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}