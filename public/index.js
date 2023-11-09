let searchValue = document.getElementById("myForm");

searchValue.addEventListener("submit", (e) => {
  e.preventDefault();
  let nameValue = document.getElementById("search").value;
  window.location.href = `/${nameValue}`;
});
