// Initialize Firebase with your project's configuration
const firebaseConfig = {
    apiKey: "AIzaSyDR8UUiCMNUg2S8FiL3vQ8SCh3nZs_3-Bk",
    authDomain: "racartech-81aff.firebaseapp.com",
    projectId: "racartech-81aff",
    storageBucket: "racartech-81aff.appspot.com",
    messagingSenderId: "843116902468",
    appId: "1:843116902468:web:15ec03a77394aef0fbe411",
    measurementId: "G-TFH2JNTSTQ"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = firebase.firestore();

// Get references to form elements
const messageForm = document.getElementById("messageForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("msg");
const imageInput = document.getElementById("imageInput");

messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentTimestamp = Date.now();
    const milliseconds = new Date().getMilliseconds();
    const timestampWithMilliseconds = currentTimestamp + milliseconds;

    const timestampString = timestampWithMilliseconds.toString();

    const NAME = nameInput.value;
    const EMAIL = emailInput.value;
    const SUBJECT = subjectInput.value;
    const CONTENT = messageInput.value;
    const ATTACHMENTS_URL = imageInput.files;

    const sendingAlert = document.querySelector(".sending-alert");
    sendingAlert.style.display = "block"; // Display "Sending Files" alert

    const storageRef = firebase.storage().ref();
    const imageUrls = [];
    
    for (const file of ATTACHMENTS_URL) {
        if (file.size <= 25 * 1024 * 1024) {
            const imageRef = storageRef.child(file.name);
            await imageRef.put(file);
            const imageUrl = await imageRef.getDownloadURL();
            imageUrls.push(imageUrl);
        } else {
            console.log(`File ${file.name} exceeds the 25MB size limit.`);
        }
    }
    
    // Convert imageUrls array to a string
    const imageUrlsString = JSON.stringify(imageUrls);

const messageData = [
    timestampString, // Use timestampWithMilliseconds as the unique identifier
    "",
    NAME,
    EMAIL,
    SUBJECT,
    CONTENT,
    imageUrlsString, // String Image
    "0", // Status as a string
    "[]", // Empty array as a string
    "[]", // Empty array as a string
    null, // Null value as a string
    "0", // Status as a string
    "[]" // Empty array as a string

]

const messageDataJson = JSON.stringify(messageData);

try {
    // Update Firestore document with the new data
    await db.collection("suggestions_data").doc("suggestions").update({
        [timestampWithMilliseconds]: messageDataJson
    });

    // Retrieve data from Firestore
    const doc = await db.collection("suggestions_data").doc("suggestions").get();

    // Extract data from the Firestore document
    const messageData = doc.data();

    // Exclude specific fields (email and subject) from client-side representation
    const {  id, name, email, subject, timestamp, imageUrls } = messageData;
    const messageDataWithoutTags = {
        id, name, email, subject, timestamp, imageUrls
    };

    // Now you can use messageDataWithoutTags where you want to hide the tags
    console.log(messageDataWithoutTags);

        // Hide the "Sending Files" alert
        sendingAlert.style.display = "none";

        // Display success alert
        const successAlert = document.querySelector(".alert-success");
        successAlert.style.display = "block";

        setTimeout(() => {
            successAlert.style.display = "none";
        }, 2000);

        // Clear form inputs
        nameInput.value = "";
        emailInput.value = "";
        subjectInput.value = "";
        messageInput.value = "";
        imageInput.value = "";
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});