interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  accent?: string;
}

function StatCard({ title, value, description, accent }: StatCardProps) {
  return (
    <div className="detail-card" style={{ padding: '1.5rem' }}>
      <div className="detail-card-header" style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        {accent && <span className={`status-badge ${accent.toLowerCase()}`}>{accent}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{value}</span>
      </div>
      <p className="text-muted" style={{ marginTop: '0.75rem' }}>{description}</p>
    </div>
  );
}

export default StatCard;
