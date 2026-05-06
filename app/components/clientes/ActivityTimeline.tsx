import "./ActivityTimeline.css";
import {
  Phone, Mail, Users, DollarSign,
  CheckSquare, FileText,
} from "lucide-react";
import { Actividad, ActividadType } from "../../lib/types/cliente.types";

interface ActivityTimelineProps {
  activities: Actividad[];
}

function ActivityIcon({ type }: { type: ActividadType }) {
  const icons: Record<ActividadType, React.ReactNode> = {
    call: <Phone size={15} />,
    email: <Mail size={15} />,
    meeting: <Users size={15} />,
    deal: <DollarSign size={15} />,
    task: <CheckSquare size={15} />,
    note: <FileText size={15} />,
  };
  return (
    <div className={`activity-timeline__icon activity-timeline__icon--${type}`}>
      {icons[type]}
    </div>
  );
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="activity-timeline">
      {activities.map((activity, index) => (
        <div key={activity.id} className="activity-timeline__item">
          <div className="activity-timeline__icon-col">
            <ActivityIcon type={activity.type} />
            {index < activities.length - 1 && (
              <div className="activity-timeline__line" />
            )}
          </div>
          <div className="activity-timeline__content">
            <div className="activity-timeline__title-row">
              <span className="activity-timeline__title">{activity.title}</span>
              {activity.status && (
                <span className="activity-timeline__status-badge">
                  {activity.status}
                </span>
              )}
            </div>
            <p className="activity-timeline__description">
              {activity.description}
            </p>
            <span className="activity-timeline__meta">
              {activity.user} · {activity.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}