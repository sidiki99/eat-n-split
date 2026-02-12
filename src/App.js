import { useState, useEffect } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Haris Sajid",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
    whatsapp: "923023976388",
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
    whatsapp: "923020730970",
  },
  {
    id: 499476,
    name: "Aqib",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
    whatsapp: "923020730970",
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(() => {
    const stored = localStorage.getItem("friends");
    return stored ? JSON.parse(stored) : initialFriends;
  });

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  // in split form useState  use
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");

  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  function handleShowFriendForm() {
    setShowAddFriend((s) => !s);
    setSelectedFriend(null);
  }

  function handleSelection(friend) {
    setSelectedFriend((cur) =>
      cur?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

 function handleAddFriend(friend) {
 
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  
  // If user clicks Cancel, nothing happens
}


  function handleRemoveFriend(id) {
     const confirmed = window.confirm("Are you sure you want to add this friend?");
  
  if (confirmed) {
    setFriends((friends) =>
      friends.filter((friend) => friend.id !== id)
    )};
    setSelectedFriend(null);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
          onRemoveFriend={handleRemoveFriend}
          bill={bill}
          paidByUser={paidByUser}
        />

        {showAddFriend && (
          <FormAddFriend onAddFriend={handleAddFriend} />
        )}

        <Button onClick={handleShowFriendForm}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          bill={bill}
          setBill={setBill}
          paidByUser={paidByUser}
          setPaidByUser={setPaidByUser}
        />
      )}
    </div>
  );
}

function FriendsList({
  friends,
  onSelection,
  selectedFriend,
  onRemoveFriend,
  bill,
  paidByUser
}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
          onRemoveFriend={onRemoveFriend}
          bill={bill}
          paidByUser={paidByUser}
        />
      ))}
    </ul>
  );
}

function Friend({
  friend,
  onSelection,
  selectedFriend,
  onRemoveFriend,
  bill,
  paidByUser
}) {
  const isSelected = selectedFriend?.id === friend.id;

  function handleWhatsApp() {
  if (!friend.whatsapp) {
    alert("No WhatsApp number available");
    return;
  }

  const cleanNumber = friend.whatsapp.replace(/\D/g, "");

  if (!/^92\d{10}$/.test(cleanNumber)) {
    alert("Invalid WhatsApp number");
    return;
  }

  let message = "";

  if (friend.balance < 0) {
    message = `Hi ${friend.name},\nTotal Bill was ${bill} RS/- and My Expense was ${paidByUser} RS/- \nWith the previous record, I owe you ${Math.abs(
      friend.balance
    )} RS/-.\n I will pay you soon.`;
  } else if (friend.balance > 0) {
    message = `Hi ${friend.name},\nTotal Bill was ${bill} RS/- and My Expense was ${paidByUser} RS/-\n With the previous record, You owe me ${Math.abs(
      friend.balance
    )} RS/- .\n Please send it when possible.`;
  } else {
    message = `Hi ${friend.name},\nWe are  settled up 👍`;
  }

  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    message
  )}`;

  window.open(url, "_blank");
}


  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p>You and {friend.name} are even</p>
      )}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>

      <Button onClick={() => onRemoveFriend(friend.id)}>
        Remove
      </Button>

      <Button onClick={handleWhatsApp} className='whatsapp_btn'>
        WhatsApp
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const [whatsapp, setWhatsapp] = useState("");
  const [imageFile, setImageFile] = useState(null); // store local file if chosen

  function isValidPakistanNumber(number) {
    const regex = /^92\d{10}$/;
    return regex.test(number);
  }

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImage(URL.createObjectURL(file)); // preview locally
  //     setImageFile(file); // store the file if needed
  //   }
  // };

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image || !whatsapp) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidPakistanNumber(whatsapp)) {
      alert("Enter valid WhatsApp number in format 92XXXXXXXXXX");
      return;
    }

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: imageFile
        ? image // For local files, use the object URL (preview)
        : `${image}?u=${id}`, // For URL input, append id
      balance: 0,
      whatsapp: whatsapp,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
    setWhatsapp("");
    setImageFile(null);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧍‍♂️ Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌆 Image URL</label>
      <input
        type="text"
        value={imageFile ? "" : image} // if a file is selected, disable manual URL editing
        onChange={(e) => setImage(e.target.value)}
        placeholder="Or select a file below"
      />

      {/* <label>📁 Or Select Image File</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {image && <img src={image} alt="preview" style={{ width: "100px", marginTop: "5px" }} />} */}

      <label>📱 WhatsApp (92XXXXXXXXXX)</label>
      <input
        type="text"
        value={whatsapp}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
          setWhatsapp(value);
        }}
        maxLength="12"
      />

      <Button>Add</Button>
    </form>
  );
}



function FormSplitBill({ selectedFriend, onSplitBill,bill,setBill,paidByUser,setPaidByUser }) {
  // const [bill, setBill] = useState("");
  // const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplitBill(
      whoIsPaying === "user" ? paidByFriend : -paidByUser
    );
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👨‍✈️ Your expense</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value <= bill) setPaidByUser(value);
        }}
      />

      <label>👨‍🤝‍👨 {selectedFriend.name}'s expense</label>
      <input type="number" disabled value={paidByFriend} />

      <label>😋 Who is paying?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
