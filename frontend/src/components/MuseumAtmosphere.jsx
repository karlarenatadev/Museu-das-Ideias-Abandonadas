export default function MuseumAtmosphere({ variant = 'page', className = '' }) {
  return (
    <div className={`museum-atmosphere museum-atmosphere--${variant} ${className}`} aria-hidden="true">
      <span className="museum-smoke museum-smoke--one" />
      <span className="museum-smoke museum-smoke--two" />
      <span className="museum-smoke museum-smoke--three" />
      <span className="museum-dust museum-dust--one" />
      <span className="museum-dust museum-dust--two" />
      <span className="museum-light-beam museum-light-beam--one" />
      <span className="museum-light-beam museum-light-beam--two" />
    </div>
  );
}
