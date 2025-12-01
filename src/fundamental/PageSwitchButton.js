function FundamentalSwitchButton() {
  const buildUrl = () => `${window.location.origin}${window.location.pathname}`;

  const handleClick = () => {
    window.location.href = buildUrl();
  };

  return (
    <button className="page-switch-button page-switch-button--light" onClick={handleClick}>
      Quay về Todo App
    </button>
  );
}

export default FundamentalSwitchButton;

