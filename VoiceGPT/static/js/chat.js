let final_transcript = [];
        let interim_transcript = "";

        if ("webkitSpeechRecognition" in window) {
            // Initialize webkitSpeechRecognition
            let speechRecognition = new webkitSpeechRecognition();
    
    
            // Set the properties for the Speech Recognition object
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            const selectDialect = document.querySelector("#select_dialect");

            // Додати обробник події для вибору мови
            selectDialect.addEventListener("change", function () {
                const selectedLanguage = selectDialect.value;
                // Оновити мову розпізнавання
                speechRecognition.lang = selectedLanguage;
            });
    
            // Callback Function for the onStart Event
            speechRecognition.onstart = () => {
                // Show the Status Element
                document.querySelector("#status").style.display = "block";
                // Hide the Start Button and Show the Stop Button
                document.querySelector("#startRecording").style.display = "none";
                document.querySelector("#stopRecording").style.display = "block";
            };
            speechRecognition.onerror = () => {
                // Hide the Status Element
                document.querySelector("#status").style.display = "none";
                // Hide the Stop Button and Show the Start Button
                document.querySelector("#startRecording").style.display = "block";
                document.querySelector("#stopRecording").style.display = "none";
            };
            speechRecognition.onend = () => {
                // Hide the Status Element
                document.querySelector("#status").style.display = "none";
                // Hide the Stop Button and Show the Start Button
                document.querySelector("#startRecording").style.display = "block";
                document.querySelector("#stopRecording").style.display = "none";
            };
    
            speechRecognition.onresult = (event) => {
                
                interim_transcript = "";
                // Loop through the results from the speech recognition object.
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
    
            };
    
            // Set the onClick property of the start button
            document.querySelector("#startRecording").onclick = () => {
                
                final_transcript = [];
                // Start the Speech Recognition
                speechRecognition.start();
            };
            // Set the onClick property of the stop button
            document.querySelector("#stopRecording").onclick = () => {
                // Stop the Speech Recognition
                speechRecognition.stop();
                document.querySelector("#status_waiting").textContent = "Downloading...";
                
                
                // Get the final_transcript and interim_transcript and send them to the server
                const textToPost = final_transcript;
                const interimTextToPost = interim_transcript;
                const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
                
                console.log("Final transcript:", final_transcript);
                console.log("Interim transcript:", interim_transcript);
                console.log("Sending data to server:", textToPost);
                fetch('/', {
                    
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify({ text: textToPost, interimText: interimTextToPost}), 
                }).then(response => {

                    document.querySelector("#status_waiting").textContent = "   ";

                if (response.ok) {
                    
                    window.location.reload();
                } else {
                    
                    console.error('Помилка відправки запиту на сервер');
                }
            })
            };
        } else {
            console.log("Speech Recognition Not Available");
        }