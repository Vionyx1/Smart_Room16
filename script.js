// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function() {
    function checkPassword() {
        var password = $("#passwordInput").val().trim();
        if (password === "SmartH4R4") {
            $("#error-message").hide();
            $("#login").hide();
            $("#content").show();
            initializeFirebaseInteractions();
        } else {
            $("#error-message").hide().removeClass("shake");
            void $("#error-message")[0].offsetWidth;
            $("#error-message").addClass("shake").text("Incorrect password").show();
        }
    }

    $("#Login").click(checkPassword);
    $("#passwordInput").keypress(function(event) {
        if (event.which === 13) checkPassword();
    });

    function initializeFirebaseInteractions() {
        var database = firebase.database();
        var Led1Status, Led2Status, Led3Status, Led4Status;
        var FanSpeed = 0;

        database.ref().on("value", function(snap) {
            Led1Status = snap.val().Led1Status;
            Led2Status = snap.val().Led2Status;
            Led3Status = snap.val().Led3Status;
            Led4Status = snap.val().Led4Status;
            FanSpeed = snap.val().FanSpeed || 0;
            updateLEDDisplay(Led1Status, Led2Status, Led3Status, Led4Status);
            $("#fanPercentage").text(FanSpeed);
        });

        $(".toggle-btn").click(() => toggleLedStatus('Led1Status', Led1Status));
        $(".toggle-btn1").click(() => toggleLedStatus('Led2Status', Led2Status));
        $(".toggle-btn2").click(() => toggleLedStatus('Led3Status', Led3Status));
        $(".toggle-btn3").click(() => toggleLedStatus('Led4Status', Led4Status));

        function toggleLedStatus(ledKey, ledStatus) {
            var newStatus = ledStatus === "1" ? "0" : "1";
            database.ref(ledKey).set(newStatus);
        }

        function updateLEDDisplay(L1, L2, L3, L4) {
            $("#unact").toggle(L1 !== "1"); $("#act").toggle(L1 === "1");
            $("#unact1").toggle(L2 !== "1"); $("#act1").toggle(L2 === "1");
            $("#unact2").toggle(L3 !== "1"); $("#act2").toggle(L3 === "1");
            $("#unact3").toggle(L4 !== "1"); $("#act3").toggle(L4 === "1");
        }

        database.ref('Temperature').on("value", snap => $(".temp").text("Temperature: " + snap.val() + "°C"));
        database.ref('Humidity').on("value", snap => $(".humidity").text("Humidity: " + snap.val() + " %"));

        $(".button").click(() => {
            if (FanSpeed > 0) {
                FanSpeed = Math.max(FanSpeed - 1, 0);
                database.ref('FanSpeed').set(FanSpeed);
            }
        });

        $(".button1").click(() => {
            if (FanSpeed < 4) {
                FanSpeed = Math.min(FanSpeed + 1, 4);
                database.ref('FanSpeed').set(FanSpeed);
            }
        });
    }
});
