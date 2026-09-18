const SUPABASE_URL = "https://ncopiffauvfglewnczts.supabase.co";

// Paste your Supabase PUBLISHABLE KEY here on GitHub.
// Do NOT use your secret/service-role key.
const SUPABASE_KEY = sb_publishable_KvwoCdcwIl_5XsSMCvWntw_WSnU2qcg

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const form = document.getElementById("booking-form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dog = document.getElementById("dog").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment").value;

    if (!date || !time || !name || !phone || !dog || !address || !payment) {
        alert("Please fill out all the information.");
        return;
    }

    const { error } = await supabaseClient
        .from("bookings")
        .insert({
            date: date,
            time: time,
            customer_name: name,
            phone: phone,
            dog_name: dog,
            address: address,
            payment_method: payment,
            status: "pending"
        });

    if (error) {
        console.error("Booking error:", error);
        alert("Sorry, we couldn't submit your booking. Please try again.");
        return;
    }

    alert(
        "🐾 Walk Request Received!\n\n" +
        "Thank you, " + name + "!\n\n" +
        dog + "'s walk request has been received.\n\n" +
        "Date: " + date + "\n" +
        "Time: " + time + "\n" +
        "Price: $25\n" +
        "Payment: " + payment
    );

    form.reset();
});
