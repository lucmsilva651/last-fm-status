// Initialize components
document.addEventListener('DOMContentLoaded', function () {
  const sidenav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sidenav);

  const dropdown = document.querySelectorAll('.dropdown-trigger');
  M.Dropdown.init(dropdown, {
    "alignment": "right",
    "closeOnClick": true,
    "constrainWidth": false
  });
});