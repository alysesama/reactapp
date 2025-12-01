function PageSwitchButton({ label = 'Chuyển trang', target = 'fundamental' }) {
  const buildUrl = () => {
    const base = `${window.location.origin}${window.location.pathname}`;
    return target === 'fundamental' ? `${base}?page=fundamental` : base;
  };

  const handleClick = () => {
    window.location.href = buildUrl();
  };

  return (
    <button className="page-switch-button" onClick={handleClick}>
      {label}
    </button>
  );
}

export default PageSwitchButton;

