// src/Component/dashboard/ActivityFeed.tsx
// OPTIONAL but RECOMMENDED: Make sure ActivityFeed uses the same Activity type.
// If you already have this file, update its props to match the Activity interface above.

export interface Activity {
  id: string;
  type: "order" | "warning" | "info" | "success";
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-3">
      {activities.map((a) => (
        <div key={a.id} className="flex items-start gap-3">
          <div className="text-xs font-semibold uppercase text-gray-500">
            {a.type}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">{a.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(a.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
