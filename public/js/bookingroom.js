// Fetch rooms and display them
async function getRoom() {
    try {
        const response = await fetch('/user/room');
        if (response.ok) {
            const data = await response.json();
            showRoom(data);
        } else {
            throw Error('Failed to fetch data');
        }
    } catch (err) {
        console.error('Error:', err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// Show room table
function showRoom(data) {
    const tbody = document.querySelector('#tbody');
    let temp = '';
    data.forEach(room => {
        temp += `
            <div class="col-md-4">
                <div class="room-card">
                    <img src="/public/img/${room.image}" alt="Room Image" style="width:50%">
                    <div class="room-details">
                        <p>Room: ${room.name}</p>
                        <p>Seating Capacity: ${room.seat}</p>
                        <p>Floor: ${room.floor}</p>
                        <button class="btn btn-primary reserve-btn" onclick="getDetails('${room.id}')">Book</button>
                    </div>
                    <div class="reserved-overlay" style="display: none;">
                        <div class="reserved-text">RESERVED</div>
                    </div>
                </div>
            </div>`;
    });
    tbody.innerHTML = temp;
}

// Fetch room details for booking
async function getDetails(roomId) {
    try {
        const response = await fetch(`/user/room/${roomId}`);
        if (response.ok) {
            const roomDetail = await response.json();
            showDetail(roomDetail);
        } else {
            throw Error('Failed to fetch room details');
        }
    } catch (err) {
        console.error('Error:', err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// Show room detail in reservation form and modal
function showDetail(roomDetail) {
    document.getElementById('roomId').value = roomDetail.id;
    // Populate other modal fields if needed
    document.getElementById('reservationModal').style.display = 'block';
}

// Booking the room
function bookRoom() {
    const roomId = document.getElementById('roomId').value;
    fetch(`/user/room/book/${roomId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Room booked successfully!");
            closeModal(); // Close and reset modal
            getRoom(); // Refresh the rooms list to update status
        } else {
            alert("Booking failed: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error booking room.");
    });
}

// Close reservation modal
function closeModal() {
    document.getElementById('reservationModal').style.display = 'none';
}

// Initial load of rooms
getRoom();
getDetails();