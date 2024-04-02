// document.addEventListener('DOMContentLoaded', () => {
//     alert("Some features on the website are only available to artists and creators. you might need to verify your identity to access them ")

// });


    const overlay = document.querySelector(".overlay"),
        showBtn = document.querySelectorAll(".show-modal"),
        closeBtn = document.querySelector(".close-btn"),
        modalBox = document.querySelector(".modal-box");
        console.log(showBtn)



    showBtn[0].addEventListener("click", () => {
        modalBox.classList.add("active");
        overlay.classList.add("active");
    });

    for (const Btn of showBtn){
        Btn.addEventListener('click', () => {
            modalBox.classList.add("active");
            overlay.classList.add("active");})
    };

    overlay.addEventListener("click", () => {
    });


    closeBtn.addEventListener("click", () => {
        modalBox.classList.remove("active");
        overlay.classList.remove("active");
    });

    

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            event.preventDefault();
        } else if (event.key === 'Enter' && modalBox.classList.contains('active')) {
            // Trigger the same action as the "Okay, Close" button
            simulateClick(okayButton);
        }
    });

    function simulateClick(element) {
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    };
