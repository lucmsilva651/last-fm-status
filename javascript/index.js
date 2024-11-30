// Initialize components
document.addEventListener('DOMContentLoaded', function () {
  const sidenav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sidenav);

  const scrollspy = document.querySelectorAll('.scrollspy');
  M.ScrollSpy.init(scrollspy, { scrollOffset: 50 });
});