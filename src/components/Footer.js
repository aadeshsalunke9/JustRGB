export default function Footer() {
  return (
    <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="f-brand">JUST RGB</span>
      <span className="f-copy">© 2025 Aadesh Salunke. All rights reserved.</span>
      <div className="f-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </footer>
  );
}
