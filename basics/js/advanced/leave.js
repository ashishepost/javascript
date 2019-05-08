(() => {
    window.addEventListener("blur", function() {
        console.log("Leaving");
    })
    console.log("called");
})();
